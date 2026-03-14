import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getSignedThumbnailUrl } from "@/lib/storage";
import Link from "next/link";
import { ShoppingCart, Shield, ArrowLeft } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

interface CheckoutPageProps {
  params: Promise<{ productId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { user: true },
  });

  if (!product) notFound();

  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch {
    // Not logged in
  }

  const thumbnailUrl = await getSignedThumbnailUrl(product.thumbnailUrl);

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-gray-950 relative overflow-hidden">
      {/* Top Bar with Cancel Button */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Cancel
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Shield className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.04),transparent_70%)] pointer-events-none" />

      <div className="pt-8 pb-16 relative">
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
              <ShoppingCart className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Checkout</span>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-5 mb-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingCart className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                  {product.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  by {product.user.name}
                </p>
              </div>
              <span className="font-display text-lg font-bold text-gray-900 dark:text-white shrink-0">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-7 shadow-sm">
            <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
              Complete Purchase
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your email to receive the download link
            </p>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Processing Fee</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between">
                <span className="font-display font-bold text-gray-900 dark:text-white">Total</span>
                <span className="font-display text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <CheckoutForm
              productId={product.id}
              price={formatPrice(product.price)}
              defaultEmail={currentUser?.email || ""}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
