import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getSignedThumbnailUrl } from "@/lib/storage";
import Link from "next/link";
import {
  ShoppingCart,
  Download,
  User,
  Star,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle,
  Info,
} from "lucide-react";
import DemoBuyButton from "@/components/DemoBuyButton";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} — CreatorHub`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      user: true,
      _count: {
        select: {
          orders: {
            where: { isDemo: false, status: "completed" },
          },
        },
      },
    },
  });

  if (!product || !product.published) {
    notFound();
  }

  // Get current user to determine if this is the creator's own product
  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch {
    // Not logged in
  }

  const isOwner = currentUser?.id === product.userId;

  const thumbnailUrl = await getSignedThumbnailUrl(product.thumbnailUrl);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Bar with Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </Link>
        </div>
      </div>

      {/* Hero area with subtle bg */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid opacity-[0.02]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_70%)]" />

        <div className="relative pt-8 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Product Details */}
              <div className="lg:col-span-3 space-y-6">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100/80 dark:border-gray-800 shadow-sm group">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-50 to-violet-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-violet-900/20">
                      <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
                        <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 bg-violet-50 dark:bg-violet-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    <h2 className="font-display text-[15px] font-bold text-gray-900 dark:text-white">
                      About this product
                    </h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {product.description.split("\n").map((paragraph, i) => (
                      <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Creator */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <h2 className="font-display text-[15px] font-bold text-gray-900 dark:text-white">
                      About the Creator
                    </h2>
                  </div>
                  <Link
                    href={`/store/${product.user.id}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl group/creator hover:bg-gray-100/80 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <div className="w-12 h-12 bg-linear-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="font-display text-sm font-bold text-violet-700 dark:text-violet-400">
                        {product.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover/creator:text-violet-600 dark:group-hover/creator:text-violet-400 transition-colors duration-300">
                        {product.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        View all products
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover/creator:text-violet-500 group-hover/creator:translate-x-0.5 transition-all duration-300" />
                  </Link>
                </div>
              </div>

              {/* Right: Purchase Card */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-7 shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50">
                    <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight leading-tight">
                      {product.title}
                    </h1>

                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">one-time</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        {product.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {product._count.orders} sales
                      </span>
                    </div>

                    {/* Buy & Demo Buttons */}
                    <div className="flex flex-col gap-3">
                      {isOwner ? (
                        <>
                          {/* Owner Notice */}
                          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-xl">
                            <Info className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                              Ini adalah produk milik Anda sendiri, sehingga tidak dapat dibeli. Gunakan <span className="font-semibold">Demo Buy</span> untuk menguji alur pembelian.
                            </p>
                          </div>

                          {/* Demo Buy Button */}
                          <DemoBuyButton productId={product.id} />
                        </>
                      ) : (
                        <>
                          {/* Buy Button */}
                          <Link
                            href={`/checkout/${product.id}`}
                            className="group flex items-center justify-center gap-2.5 w-full h-13 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg shadow-gray-900/10 transition-all duration-300 active:scale-[0.97] relative overflow-hidden"
                          >
                            <ShoppingCart className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Buy Now</span>
                            <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </Link>

                          {/* Demo Buy Button */}
                          <DemoBuyButton productId={product.id} />
                        </>
                      )}
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      {[
                        { icon: Shield, text: "Secure checkout", color: "text-emerald-500" },
                        { icon: Zap, text: "Instant download after purchase", color: "text-violet-500 dark:text-violet-400" },
                        { icon: CheckCircle, text: "Lifetime access to files", color: "text-blue-500 dark:text-blue-400" },
                      ].map((badge) => (
                        <div key={badge.text} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                          <badge.icon className={`w-4 h-4 ${badge.color}`} />
                          {badge.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Info */}
                  {product.fileName && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                            Included File
                          </h3>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{product.fileName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
