import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { parseSupabaseStorageUrl } from "@/lib/utils";

/**
 * Create a Supabase admin client using service role key.
 * This is for server-side operations that need elevated permissions (like creating signed URLs).
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

/**
 * Parse a stored reference into bucket + path.
 * This function uses parseSupabaseStorageUrl which supports:
 *  1. New format: "bucket:path"  (e.g. "product-files:userId/123-file.pdf")
 *  2. Legacy format: full Supabase public URL
 */
function parseBucketAndPath(ref: string): {
  bucket: string;
  path: string;
} | null {
  return parseSupabaseStorageUrl(ref);
}

/**
 * Generate a public URL for a Supabase storage object.
 * Use this for assets that are okay to be publicly visible (e.g. thumbnails).
 */
export async function getPublicFileUrl(
  ref: string
): Promise<string | null> {
  const parsed = parseBucketAndPath(ref);
  if (!parsed) {
    if (ref.startsWith("http://") || ref.startsWith("https://")) return ref;
    return null;
  }

  try {
    const supabase = await createServerClient();
    const { data } = supabase.storage
      .from(parsed.bucket)
      .getPublicUrl(parsed.path);

    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

/**
 * Generate a signed URL for a Supabase storage object (for private files).
 * Requires service role key for permissions.
 * Returns null if signing fails.
 */
export async function getSignedUrl(
  ref: string,
  expiresIn = 60 * 60 // 1 hour
): Promise<string | null> {
  const parsed = parseBucketAndPath(ref);
  if (!parsed) {
    if (ref.startsWith("http://") || ref.startsWith("https://")) return ref;
    return null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(parsed.bucket)
      .createSignedUrl(parsed.path, expiresIn);

    if (error) {
      console.error(
        `Supabase signed URL error for ${parsed.bucket}/${parsed.path}:`,
        error
      );
      return null;
    }

    if (!data?.signedUrl) {
      console.error(
        `No signed URL returned for ${parsed.bucket}/${parsed.path}`
      );
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error(
      `Exception creating signed URL for ${parsed.bucket}/${parsed.path}:`,
      error
    );
    return null;
  }
}

/**
 * Generate thumbnail URL for a product.
 * Thumbnails use public URLs (they are displayed publicly on product pages).
 * Returns null if no thumbnail reference is provided.
 */
export async function getSignedThumbnailUrl(
  thumbnailRef: string | null | undefined
): Promise<string | null> {
  if (!thumbnailRef) return null;
  return getPublicFileUrl(thumbnailRef);
}

/**
 * Generate a signed download URL for a product file.
 * Uses short-lived signed URLs for security.
 * Returns null if signing fails.
 */
export async function getSignedDownloadUrl(
  fileRef: string,
  expiresIn = 5 * 60 // 5 minutes — short-lived for security
): Promise<string | null> {
  if (!fileRef) return null;
  return getSignedUrl(fileRef, expiresIn);
}
