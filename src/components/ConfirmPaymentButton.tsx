"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface ConfirmPaymentButtonProps {
  onConfirm: () => Promise<{ error?: string; success?: boolean; redirectTo?: string }>;
  price: string;
}

export default function ConfirmPaymentButton({ onConfirm, price }: ConfirmPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsProcessing(true);
    const loadingId = toast.loading("Processing payment...", {
      description: `Confirming payment of ${price}`,
    });
    try {
      const result = await onConfirm();
      if (result?.error) {
        toast.error(result.error, { id: loadingId });
      } else if (result?.success && result?.redirectTo) {
        toast.success("Payment confirmed!", {
          id: loadingId,
          description: "Redirecting to download page...",
        });
        router.push(result.redirectTo);
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { id: loadingId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className="group w-full h-12 flex items-center justify-center gap-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97] relative overflow-hidden"
    >
      <CheckCircle className="w-4 h-4 relative z-10" />
      <span className="relative z-10">
        {isProcessing ? "Processing..." : "Confirm Payment"}
      </span>
      <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
}
