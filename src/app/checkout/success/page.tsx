import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, ArrowLeft, Sparkles, Play } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: { include: { user: true } },
    },
  });

  if (!order || order.status !== "completed") notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background celebration */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)]" />

      <div className="max-w-sm w-full text-center relative">
        {/* Back to Home */}
        <div className="mb-6 text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-8 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50">
          {/* Success Icon */}
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {order.isDemo
              ? "This was a demo purchase. No files are included."
              : "Thank you for your purchase. Your file is ready for download."}
          </p>

          {/* Product Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-2 mb-1">
              {order.isDemo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <Play className="w-2.5 h-2.5" />
                  Demo
                </span>
              )}
            </div>
            <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-1">
              {order.product.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              by {order.product.user.name}
            </p>
          </div>

          {order.isDemo && (
            <>
              {/* Demo Success — no download */}
              <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Play className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-violet-900 dark:text-violet-300 mb-1">
                      Demo Purchase Complete
                    </p>
                    <p className="text-xs text-violet-700 dark:text-violet-400 leading-relaxed">
                      This demo shows the purchase flow without providing a download link.
                      Use the <strong>&quot;Buy Now&quot;</strong> button on the product page to make a real purchase and get access to the files.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/products/${order.product.slug}`}
                className="group flex items-center justify-center gap-2.5 w-full h-12 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-500/5 transition-all duration-300 active:scale-[0.97] mb-4"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span>Back to Product</span>
              </Link>
            </>
          )}

          {!order.isDemo && (
            <>
              {/* Real Purchase — show download */}
              <a
                href={`/api/download?orderId=${order.id}`}
                className="group flex items-center justify-center gap-2.5 w-full h-12 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/10 transition-all duration-300 active:scale-[0.97] mb-4 relative overflow-hidden"
              >
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Download File</span>
                <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </a>

              <p className="text-xs text-gray-400 mb-6">
                A copy of the download link has been sent to{" "}
                <span className="font-medium text-gray-500">{order.buyerEmail}</span>
              </p>
            </>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200 group"
          >
            Browse more products
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </main>
  );
}
