import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ProfileForm from "@/components/dashboard/ProfileForm";
import CopyButton from "@/components/ui/CopyButton";
import { User, Link2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const updateProfile = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;

    await prisma.user.update({
      where: { id: user.id },
      data: { name, bio },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath(`/store/${user.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your creator profile
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <ProfileForm user={user} onSubmit={updateProfile} />
      </div>

      {/* Store Link */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Link2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display text-[15px] font-semibold text-gray-900 dark:text-white">
              Your Store
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Share this link to let customers browse your products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store/${user.id}`}
            className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          />
          <CopyButton
            text={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store/${user.id}`}
          />
          <a
            href={`/store/${user.id}`}
            target="_blank"
            className="group h-11 px-5 inline-flex items-center bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/10 transition-all duration-300 active:scale-[0.97] relative overflow-hidden dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:shadow-none"
          >
            <span className="relative z-10">Visit Store</span>
            <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
