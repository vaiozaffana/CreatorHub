"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPriceInput, parsePriceInput } from "@/lib/utils";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  Banknote,
  Type,
  AlignLeft,
  Sparkles,
} from "lucide-react";

interface UploadFormProps {
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean; redirect?: string } | void>;
  initialData?: {
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string | null;
  };
  isEditing?: boolean;
}

export default function UploadForm({
  onSubmit,
  initialData,
  isEditing = false,
}: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [priceDisplay, setPriceDisplay] = useState<string>(
    initialData?.price ? formatPriceInput(initialData.price) : ""
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialData?.thumbnailUrl || ""
  );
  const [dragOverFile, setDragOverFile] = useState(false);
  const [dragOverThumb, setDragOverThumb] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /**
   * Upload file to /api/upload endpoint dengan chunked uploads
   * Membagi file besar jadi chunks 2MB untuk bypass Vercel payload limit
   * Returns the file URL to be stored in FormData
   */
  const uploadFileToApi = async (file: File, bucket: string, onProgress?: (chunk: number, total: number) => void): Promise<string> => {
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

    // Generate upload session ID
    const uploadSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Upload file in chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = file.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("chunkIndex", i.toString());
      chunkFormData.append("totalChunks", totalChunks.toString());
      chunkFormData.append("uploadSessionId", uploadSessionId);
      chunkFormData.append("bucket", bucket);
      chunkFormData.append("fileName", file.name);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: chunkFormData,
      });

      if (!response.ok) {
        let errorMessage = `Upload failed at chunk ${i + 1}/${totalChunks} with status ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
        throw new Error(errorMessage);
      }

      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, totalChunks);
      }

      // Only last chunk returns fileUrl
      if (i === totalChunks - 1) {
        try {
          const data = await response.json();
          if (!data.fileUrl) {
            throw new Error("No file URL returned from server");
          }
          return data.fileUrl;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Invalid response from server";
          throw new Error(message);
        }
      }
    }

    throw new Error("Upload failed: No response from server");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingId = toast.loading(
      isEditing ? "Updating product..." : "Creating product...",
      { description: "Processing files..." }
    );
    try {
      const formData = new FormData(e.currentTarget);
      const fileInput = fileInputRef.current;
      const thumbnailInput = thumbnailInputRef.current;

      // Upload digital product file if provided
      if (fileInput?.files?.[0]) {
        const file = fileInput.files[0];
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        const fileUrl = await uploadFileToApi(file, "product-files", (chunk, total) => {
          toast.loading(
            `Uploading product file: ${chunk}/${total} chunks (${fileSize}MB)...`,
            { id: loadingId }
          );
        });
        formData.set("_fileUrl", fileUrl);
        formData.set("_fileName", file.name); // Store actual filename with extension
        formData.delete("file");
      }

      // Upload thumbnail if provided
      if (thumbnailInput?.files?.[0]) {
        const file = thumbnailInput.files[0];
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        const thumbnailUrl = await uploadFileToApi(file, "product-thumbnails", (chunk, total) => {
          toast.loading(
            `Uploading thumbnail: ${chunk}/${total} chunks (${fileSize}MB)...`,
            { id: loadingId }
          );
        });
        formData.set("_thumbnailUrl", thumbnailUrl);
        formData.delete("thumbnail");
      }

      // Now submit only text data + file URLs to Server Action
      const result = await onSubmit(formData);
      if (result?.error) {
        toast.error(result.error, { id: loadingId });
      } else {
        toast.success(
          isEditing ? "Product updated successfully!" : "Product created successfully!",
          { id: loadingId, description: "Redirecting..." }
        );
        if (result?.redirect) {
          router.push(result.redirect);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { id: loadingId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setFileName(file.name);
    }
  };

  const handleThumbDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverThumb(false);
    const file = e.dataTransfer.files?.[0];
    if (file && thumbnailInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      thumbnailInputRef.current.files = dt.files;
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Product Details Section ── */}
      <div className="space-y-1">
        <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          Product Details
        </h3>
        <p className="text-xs text-gray-400">Basic information about your product</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Type className="w-3.5 h-3.5 text-gray-400" />
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-500"
          placeholder="e.g., Next.js SaaS Starter Template"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none placeholder:text-gray-300 dark:placeholder:text-gray-500 leading-relaxed"
          placeholder="Describe what makes your product special..."
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Banknote className="w-3.5 h-3.5 text-gray-400" />
          Harga (IDR)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-violet-500 font-semibold">
            Rp
          </span>
          <input
            type="text"
            id="price"
            inputMode="numeric"
            value={priceDisplay}
            onChange={(e) => {
              const raw = e.target.value;
              const num = parsePriceInput(raw);
              setPriceDisplay(num > 0 ? formatPriceInput(num) : "");
            }}
            required
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-500"
            placeholder="150.000"
          />
          {/* Hidden input sends the raw numeric value */}
          <input
            type="hidden"
            name="price"
            value={parsePriceInput(priceDisplay)}
          />
        </div>
      </div>

      {/* ── Files Section ── */}
      <div className="pt-2 space-y-1">
        <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-violet-500" />
          Files
        </h3>
        <p className="text-xs text-gray-400">Upload your product file and optional thumbnail</p>
      </div>

      {/* Digital File Upload */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          Digital File
          {isEditing && <span className="text-gray-400 font-normal text-xs">(leave empty to keep existing)</span>}
        </label>
        <div
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group
            ${
              dragOverFile
                ? "border-violet-400 bg-violet-50/50"
                : fileName
                  ? "border-violet-200 bg-violet-50/30"
                  : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/20"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverFile(true);
          }}
          onDragLeave={() => setDragOverFile(false)}
          onDrop={handleFileDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            onChange={handleFileChange}
            className="hidden"
            required={!isEditing}
          />
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{fileName}</p>
                <p className="text-xs text-gray-400">Click or drag to change</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="ml-auto p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dragOverFile ? "Drop your file here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ZIP, PDF, or any file up to 50MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
          Thumbnail Image
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <div
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group
            ${
              dragOverThumb
                ? "border-violet-400 bg-violet-50/50"
                : thumbnailPreview
                  ? "border-violet-200 bg-violet-50/30"
                  : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/20"
            }
          `}
          onClick={() => thumbnailInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverThumb(true);
          }}
          onDragLeave={() => setDragOverThumb(false)}
          onDrop={handleThumbDrop}
        >
          <input
            ref={thumbnailInputRef}
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
          {thumbnailPreview ? (
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="max-h-40 mx-auto rounded-xl object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThumbnailPreview("");
                  if (thumbnailInputRef.current)
                    thumbnailInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors duration-200" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {dragOverThumb ? "Drop your image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG or WebP (recommended 1200×750)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full h-12 flex items-center justify-center gap-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97] relative overflow-hidden"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="relative z-10">
                {isEditing ? "Update Product" : "Create Product"}
              </span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
