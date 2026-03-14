import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedThumbnailUrl } from "@/lib/storage";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Plus,
  Pencil,
  ExternalLink,
  Download,
} from "lucide-react";
import DeleteProductButton from "@/components/dashboard/DeleteProductButton";
import TogglePublishedButton from "@/components/dashboard/TogglePublishedButton";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Generate signed thumbnail URLs
  const productsWithThumbnails = await Promise.all(
    products.map(async (product) => ({
      ...product,
      signedThumbnailUrl: await getSignedThumbnailUrl(product.thumbnailUrl),
    }))
  );

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your digital products
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-1.5 h-9 px-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm transition-[background-color,transform,opacity] duration-200 active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" />
          New Product
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-16 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            No products yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 max-w-xs mx-auto">
            Create your first digital product and start selling.
          </p>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm transition-[background-color,transform,opacity] duration-200 active:scale-[0.97]"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsWithThumbnails.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 overflow-hidden hover:shadow-md hover:shadow-gray-100/60 dark:hover:shadow-gray-900/50 transition-shadow duration-300 ease-out group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-16/10 bg-gray-50 dark:bg-gray-800">
                {product.signedThumbnailUrl ? (
                  <img
                    src={product.signedThumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600">
                      <Download className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      product.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${product.published ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {product.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-1">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {product._count.orders} orders
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  Created {formatDate(product.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </Link>
                  <div className="ml-auto flex items-center gap-0.5">
                    <TogglePublishedButton
                      productId={product.id}
                      published={product.published}
                    />
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
