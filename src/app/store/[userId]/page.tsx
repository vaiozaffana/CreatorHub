import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSignedThumbnailUrl } from "@/lib/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Package, Zap, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

interface StorePageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { userId } = await params;
  const creator = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!creator) return { title: "Store Not Found" };

  return {
    title: `${creator.name}'s Store — CreatorHub`,
    description: creator.bio || `Browse digital products by ${creator.name}`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { userId } = await params;

  const creator = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      products: {
        where: { published: true },
        include: {
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!creator) notFound();

  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch {
    // Not logged in
  }

  const totalSales = creator.products.reduce(
    (sum, p) => sum + p._count.orders,
    0
  );
  const totalDownloads = creator.products.reduce(
    (sum, p) => sum + p.downloads,
    0
  );

  // Generate signed thumbnail URLs for all products
  const productsWithSignedUrls = await Promise.all(
    creator.products.map(async (product) => ({
      ...product,
      signedThumbnailUrl: await getSignedThumbnailUrl(product.thumbnailUrl),
    }))
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar user={currentUser} />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gray-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />

        {/* Floating orbs */}
        <div className="absolute top-10 right-1/4 w-40 h-40 bg-violet-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 bg-linear-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-violet-500/20 ring-4 ring-white/10">
              <span className="font-display text-2xl font-bold text-white">
                {creator.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              {creator.name}
            </h1>

            {creator.bio && (
              <p className="text-gray-400 max-w-lg mx-auto leading-relaxed mb-6 text-[15px]">
                {creator.bio}
              </p>
            )}

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.07] backdrop-blur-sm rounded-full border border-white/10">
                <Package className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-sm font-medium text-gray-300">
                  {creator.products.length}{" "}
                  {creator.products.length === 1 ? "Product" : "Products"}
                </span>
              </div>
              {totalSales > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.07] backdrop-blur-sm rounded-full border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {totalSales} {totalSales === 1 ? "Sale" : "Sales"}
                  </span>
                </div>
              )}
              {totalDownloads > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.07] backdrop-blur-sm rounded-full border border-white/10">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {totalDownloads} Downloads
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white dark:from-gray-950 to-transparent" />
      </section>

      {/* ── Products Grid ── */}
      <section className="relative pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pt-4">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                All Products
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Browse {creator.name}&apos;s digital products
              </p>
            </div>
            {creator.products.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                <Package className="w-3 h-3" />
                {creator.products.length} items
              </span>
            )}
          </div>

          {creator.products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1">
                No products yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This creator hasn&apos;t published any products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithSignedUrls.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  thumbnailUrl={product.signedThumbnailUrl}
                  slug={product.slug}
                  downloads={product.downloads}
                  featured={index === 0 && creator.products.length > 2}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
