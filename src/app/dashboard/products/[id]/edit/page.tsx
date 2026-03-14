import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSignedThumbnailUrl } from "@/lib/storage";
import { redirect, notFound } from "next/navigation";
import { updateProduct } from "@/actions/products";
import UploadForm from "@/components/UploadForm";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.userId !== user.id) {
    notFound();
  }

  const handleUpdate = async (formData: FormData) => {
    "use server";
    return await updateProduct(product.id, formData);
  };

  const signedThumbnailUrl = await getSignedThumbnailUrl(product.thumbnailUrl);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-14 lg:pt-0">
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Products
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <Pencil className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">Edit Product</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your product details</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <UploadForm
          onSubmit={handleUpdate}
          initialData={{
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnailUrl: signedThumbnailUrl,
          }}
          isEditing
        />
      </div>
    </div>
  );
}
