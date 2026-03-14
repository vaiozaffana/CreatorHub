"use client";

import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingId = toast.loading("Deleting product...");
    try {
      const result = await deleteProduct(productId);
      if (result?.error) {
        toast.error(result.error, { id: loadingId });
      } else {
        toast.success("Product deleted successfully!", { id: loadingId });
      }
    } catch {
      toast.error("Failed to delete product. Please try again.", { id: loadingId });
    } finally {
      setIsDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
      title="Delete product"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
