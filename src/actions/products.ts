"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const user = await requireAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const fileUrl = formData.get("_fileUrl") as string; // From API upload
  const fileName = formData.get("_fileName") as string | null; // Actual filename with extension

  if (!title || !description || !price || !fileUrl) {
    return { error: "All fields are required" };
  }

  const slug = generateSlug(title);

  // Thumbnail is optional
  const thumbnailUrl = formData.get("_thumbnailUrl") as string | null;

  await prisma.product.create({
    data: {
      userId: user.id,
      title,
      slug,
      description,
      price,
      fileUrl, // Already uploaded via API
      fileName: fileName || title, // Use actual filename if provided, fallback to title
      thumbnailUrl, // Already uploaded via API (or null)
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true, redirect: "/dashboard/products" };
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await requireAuth();

  // Verify ownership
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.userId !== user.id) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  
  // File URLs come from API upload (client-side)
  const fileUrl = formData.get("_fileUrl") as string | null;
  const fileName = formData.get("_fileName") as string | null;
  const thumbnailUrl = formData.get("_thumbnailUrl") as string | null;

  const updateData: Record<string, unknown> = {
    title,
    description,
    price,
  };

  // Only update fileUrl if a new file was uploaded
  if (fileUrl) {
    updateData.fileUrl = fileUrl;
    updateData.fileName = fileName || title; // Use actual filename if provided
  }

  // Only update thumbnailUrl if a new thumbnail was uploaded
  if (thumbnailUrl) {
    updateData.thumbnailUrl = thumbnailUrl;
  }

  await prisma.product.update({
    where: { id: productId },
    data: updateData,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath(`/products/${product.slug}`);
  return { success: true, redirect: "/dashboard/products" };
}

export async function deleteProduct(productId: string) {
  const user = await requireAuth();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.userId !== user.id) {
    return { error: "Unauthorized" };
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function toggleProductPublished(productId: string) {
  const user = await requireAuth();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.userId !== user.id) {
    return { error: "Unauthorized" };
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { published: !product.published },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true, published: updated.published };
}
