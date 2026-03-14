"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDemoOrder } from "@/actions/orders";
import { Play, Loader2 } from "lucide-react";

interface DemoBuyButtonProps {
  productId: string;
}

export default function DemoBuyButton({ productId }: DemoBuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDemoBuy = async () => {
    setIsLoading(true);
    const loadingId = toast.loading("Starting demo purchase...");
    try {
      const result = await createDemoOrder(productId);
      if (result?.error) {
        toast.error(result.error, { id: loadingId });
      } else if (result?.success && result?.redirectTo) {
        toast.success("Demo order created!", {
          id: loadingId,
          description: "Redirecting to payment confirmation...",
        });
        router.push(result.redirectTo);
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { id: loadingId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDemoBuy}
      disabled={isLoading}
      className="group flex items-center justify-center gap-2.5 w-full h-13 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      <span>{isLoading ? "Processing..." : "Demo Buy"}</span>
    </button>
  );
}
