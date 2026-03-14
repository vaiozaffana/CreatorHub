import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format a number as IDR string for input display (e.g. 150000 → "150.000")
 */
export function formatPriceInput(value: number | string): string {
  const num = typeof value === "string" ? parsePriceInput(value) : value;
  if (isNaN(num) || num === 0) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Parse an IDR-formatted string back to a number (e.g. "150.000" → 150000)
 */
export function parsePriceInput(value: string): number {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  return parseInt(cleaned, 10) || 0;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat("-", Math.random().toString(36).substring(2, 8));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Extract the storage path from a Supabase URL.
 * Supports two formats:
 *  1. New format: "bucket:path" (e.g. "product-files:userId/123-file.pdf")
 *  2. Legacy format: https://<project>.supabase.co/storage/v1/object/public/bucket/path
 *     e.g. https://<project>.supabase.co/storage/v1/object/public/thumbnails/userId/123-img.png
 *     → { bucket: "thumbnails", path: "userId/123-img.png" }
 */
export function parseSupabaseStorageUrl(url: string): {
  bucket: string;
  path: string;
} | null {
  // Check for new format: "bucket:path"
  const colonIdx = url.indexOf(":");
  if (colonIdx > 0 && !url.startsWith("http")) {
    return {
      bucket: url.substring(0, colonIdx),
      path: url.substring(colonIdx + 1),
    };
  }

  // Check for legacy format: full Supabase public URL
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1], path: match[2] };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
