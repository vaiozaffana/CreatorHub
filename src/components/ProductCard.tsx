"use client";

import Link from "next/link";
import { formatPrice, truncate } from "@/lib/utils";
import { ShoppingCart, Download, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
  slug: string;
  creatorName?: string;
  downloads?: number;
  featured?: boolean;
}

export default function ProductCard({
  title,
  description,
  price,
  thumbnailUrl,
  slug,
  creatorName,
  downloads,
  featured = false,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 overflow-hidden transition-all duration-500 ease-out",
        "hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-950/40 hover:-translate-y-1 hover:border-gray-200/80 dark:hover:border-gray-700",
        featured && "sm:col-span-2 sm:row-span-1"
      )}
    >
      <Link href={`/products/${slug}`} className={cn(featured ? "sm:flex sm:items-stretch" : "block")}>
        {/* Thumbnail */}
        <div
          className={cn(
            "relative overflow-hidden bg-gray-50 dark:bg-gray-800",
            featured ? "sm:w-[55%] sm:min-h-70 aspect-16/10 sm:aspect-auto" : "aspect-16/10"
          )}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-50 to-violet-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-violet-900/20">
              <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-600 group-hover:shadow-md group-hover:scale-105 transition-all duration-500">
                <ShoppingCart className="w-6 h-6 text-gray-300 dark:text-gray-500" />
              </div>
            </div>
          )}

          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100/50 dark:border-gray-700/50 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-all duration-300">
            {formatPrice(price)}
          </div>

          {/* Hover overlay arrow */}
          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
            <ArrowUpRight className="w-4 h-4 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Content */}
        <div className={cn("p-5", featured && "sm:flex-1 sm:flex sm:flex-col sm:justify-center sm:p-7")}>
          <h3
            className={cn(
              "font-display font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 tracking-tight",
              featured ? "text-lg sm:text-xl" : "text-[15px]"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2",
              featured ? "text-sm sm:line-clamp-3 sm:mb-5 mb-3" : "text-[13px] mb-3"
            )}
          >
            {truncate(description, featured ? 160 : 100)}
          </p>
          <div className="flex items-center gap-3">
            {creatorName && (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">by {creatorName}</span>
            )}
            {typeof downloads === "number" && (
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Download className="w-3 h-3" />
                {downloads}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
