"use client";

import { toggleProductPublished } from "@/actions/products";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function TogglePublishedButton({
  productId,
  published,
}: {
  productId: string;
  published: boolean;
}) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const result = await toggleProductPublished(productId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result?.published ? "Product published!" : "Product unpublished"
        );
      }
    } catch {
      toast.error("Failed to update product status.");
    } finally {
      setIsToggling(false);
    }
  };

  if (isToggling) {
    return (
      <div className="p-1.5">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-1.5 rounded-lg transition-colors duration-200 ${
        published
          ? "text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300"
      }`}
      title={published ? "Unpublish" : "Publish"}
    >
      {published ? (
        <Eye className="w-3.5 h-3.5" />
      ) : (
        <EyeOff className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
