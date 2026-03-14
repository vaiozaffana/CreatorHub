import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { simulatePaymentSuccess } from "@/actions/orders";
import { CreditCard, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConfirmPaymentButton from "@/components/ConfirmPaymentButton";

interface ConfirmPageProps {
  searchParams: Promise<{ orderId?: string; paymentId?: string }>;
}

export default async function ConfirmPage({
  searchParams,
}: ConfirmPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: { include: { user: true } },
      payment: true,
    },
  });

  if (!order) notFound();

  const handleConfirmPayment = async () => {
    "use server";
    return await simulatePaymentSuccess(orderId);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.05),transparent_70%)]" />

      <div className="max-w-sm w-full relative">
        {/* Cancel / Back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Cancel
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-7 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              Confirm Payment
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review your order and complete payment
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Product</span>
              <span className="text-gray-900 dark:text-white font-medium text-right max-w-[60%] truncate">
                {order.product.title}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Seller</span>
              <span className="text-gray-900 dark:text-white">
                {order.product.user.name}
              </span>
            </div>
            {!order.isDemo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-gray-900 dark:text-white text-right max-w-[60%] truncate">{order.buyerEmail}</span>
              </div>
            )}
            {order.isDemo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 text-xs font-semibold rounded-full">
                  Demo Purchase
                </span>
              </div>
            )}
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between">
              <span className="font-display font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-display text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(order.price)}
              </span>
            </div>
          </div>

          {/* Sandbox Notice */}
          {order.isDemo ? (
            <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-2xl p-4 mb-5">
              <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                <strong>Demo Mode:</strong> This is a demo purchase. After confirming,
                you will see a success page <strong>without</strong> a download link.
                Use &quot;Buy Now&quot; for the real purchase with file access.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-5">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                <strong>Sandbox Mode:</strong> Pembayaran ini adalah simulasi — tidak menggunakan uang asli.
                Klik tombol di bawah untuk menyelesaikan pembelian dan mendapatkan akses download.
              </p>
            </div>
          )}

          {/* Confirm Button */}
          <ConfirmPaymentButton
            onConfirm={handleConfirmPayment}
            price={formatPrice(order.price)}
          />

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            Secure payment processing
          </div>
        </div>
      </div>
    </main>
  );
}
