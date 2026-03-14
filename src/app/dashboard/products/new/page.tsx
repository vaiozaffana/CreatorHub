import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createProduct } from "@/actions/products";
import UploadForm from "@/components/UploadForm";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

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
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">Create New Product</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload your digital product and start selling
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <UploadForm onSubmit={createProduct} />
      </div>
    </div>
  );
}
