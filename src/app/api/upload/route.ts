import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

const BUCKET_PRODUCT_FILES = "product-files";
const BUCKET_PRODUCT_THUMBNAILS = "product-thumbnails";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// In-memory storage for upload sessions
// In production, use Redis or database
const uploadSessions = new Map<string, Map<number, Uint8Array>>();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// MIME type mapping
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",

    // Videos
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    flv: "video/x-flv",
    wmv: "video/x-ms-wmv",
    m3u8: "application/vnd.apple.mpegurl",
    ts: "video/mp2t",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    flac: "audio/flac",
    aac: "audio/aac",
    m4a: "audio/mp4",
    wma: "audio/x-ms-wma",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    csv: "text/csv",
    rtf: "application/rtf",

    // Archives
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    tar: "application/x-tar",
    gz: "application/gzip",

    // Code/Web
    js: "application/javascript",
    json: "application/json",
    html: "text/html",
    css: "text/css",
    xml: "application/xml",
    sql: "text/plain",
    py: "text/x-python",
    java: "text/x-java-source",
    cpp: "text/x-c++src",
    c: "text/x-csrc",
    tsx: "text/typescript",

    // Default
    bin: "application/octet-stream",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

// Cleanup old sessions
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, _] of uploadSessions.entries()) {
    const sessionTime = parseInt(sessionId.split("-")[0]);
    if (now - sessionTime > SESSION_TIMEOUT) {
      uploadSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Validate auth FIRST before reading body
    const user = await requireAuth();

    // Read FormData (now safe because chunks are small < 2.5MB)
    const formData = await request.formData();

    const uploadSessionId = formData.get("uploadSessionId") as string;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);
    const bucket = formData.get("bucket") as string;
    const fileName = formData.get("fileName") as string;
    const chunk = formData.get("chunk") as File;

    // Validate inputs
    if (!uploadSessionId || isNaN(chunkIndex) || isNaN(totalChunks) || !bucket || !chunk) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate bucket
    if (bucket !== BUCKET_PRODUCT_FILES && bucket !== BUCKET_PRODUCT_THUMBNAILS) {
      return NextResponse.json(
        { error: "Invalid bucket" },
        { status: 400 }
      );
    }

    // Read chunk as Uint8Array
    const chunkBuffer = new Uint8Array(await chunk.arrayBuffer());

    // Initialize session if not exists
    if (!uploadSessions.has(uploadSessionId)) {
      uploadSessions.set(uploadSessionId, new Map());
    }

    // Store chunk
    const session = uploadSessions.get(uploadSessionId)!;
    session.set(chunkIndex, chunkBuffer);

    // If all chunks received, combine and upload
    if (session.size === totalChunks) {
      // Combine all chunks
      const chunks: Uint8Array[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunk = session.get(i);
        if (!chunk) {
          return NextResponse.json(
            { error: "Incomplete upload: missing chunk" },
            { status: 400 }
          );
        }
        chunks.push(chunk);
      }

      // Calculate total size
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);

      // Validate final file size
      if (totalSize > MAX_FILE_SIZE) {
        uploadSessions.delete(uploadSessionId);
        return NextResponse.json(
          { error: `File size exceeds 50MB limit. Current size: ${(totalSize / 1024 / 1024).toFixed(2)}MB` },
          { status: 413 }
        );
      }

      // Combine chunks into single Uint8Array
      const fileBuffer = new Uint8Array(totalSize);
      let offset = 0;
      for (const chunk of chunks) {
        fileBuffer.set(chunk, offset);
        offset += chunk.byteLength;
      }

      // Get file extension and MIME type
      const fileExtension = fileName?.split(".").pop()?.toLowerCase() || "bin";
      const mimeType = getMimeType(fileExtension);

      // Upload to Supabase
      const supabase = await createClient();
      const timestamp = Date.now();
      const safeName = (fileName || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${user.id}/${timestamp}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: mimeType,
        });

      if (uploadError) {
        uploadSessions.delete(uploadSessionId);
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // Cleanup session
      uploadSessions.delete(uploadSessionId);

      const fileUrl = `${bucket}:${storagePath}`;
      return NextResponse.json({
        success: true,
        fileUrl,
        fileName: safeName,
        size: totalSize,
        sizeInMb: (totalSize / 1024 / 1024).toFixed(2),
      });
    } else {
      // Chunk received, waiting for more
      return NextResponse.json({
        success: true,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} received`,
        chunksReceived: session.size,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
