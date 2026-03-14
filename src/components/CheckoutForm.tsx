"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/actions/orders";
import { Lock, Mail, Shield, Zap } from "lucide-react";

interface CheckoutFormProps {
  productId: string;
  price: string;
  defaultEmail: string;
}

export default function CheckoutForm({ productId, price, defaultEmail }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingId = toast.loading("Processing payment...", {
      description: "Creating invoice, please wait...",
    });
    try {
      const formData = new FormData(e.currentTarget);
      const result = await createOrder(formData);
      if (result?.error) {
        toast.error(result.error, { id: loadingId });
      } else if (result?.success && result?.redirectTo) {
        toast.success("Order created!", {
          id: loadingId,
          description: "Redirecting to payment page...",
        });
        router.push(result.redirectTo);
        return;
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { id: loadingId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="productId" value={productId} />

      <div className="space-y-2">
        <label
          htmlFor="buyerEmail"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            id="buyerEmail"
            name="buyerEmail"
            required
            defaultValue={defaultEmail}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
            placeholder="you@example.com"
          />
        </div>
        <p className="text-xs text-gray-400">
          Your download link will be sent to this email
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group w-full h-12 flex items-center justify-center gap-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97] relative overflow-hidden"
      >
        <Lock className="w-4 h-4 relative z-10" />
        <span className="relative z-10">{isSubmitting ? "Processing..." : `Pay ${price}`}</span>
        <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Shield className="w-3.5 h-3.5" />
          Secure payment
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Zap className="w-3.5 h-3.5" />
          Instant delivery
        </div>
      </div>
    </form>
  );
}
