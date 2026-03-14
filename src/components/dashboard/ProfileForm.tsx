"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User, Loader2, Mail, PenLine, ArrowRight } from "lucide-react";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    bio?: string | null;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingId = toast.loading("Saving profile...");
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      toast.success("Profile updated successfully!", { id: loadingId });
    } catch {
      toast.error("Failed to update profile. Please try again.", { id: loadingId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar card */}
      <div className="flex items-center gap-4 p-5 bg-linear-to-br from-gray-50 to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-100/80 dark:border-gray-700">
        <div className="w-16 h-16 bg-linear-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-2xl flex items-center justify-center shadow-sm">
          <User className="w-7 h-7 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="font-display text-base font-bold text-gray-900 dark:text-white">{user.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <User className="w-3.5 h-3.5 text-gray-400" />
          Display Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user.name}
          required
          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <PenLine className="w-3.5 h-3.5 text-gray-400" />
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={user.bio || ""}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none resize-none leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-500"
          placeholder="Tell your customers about yourself..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group h-11 px-6 flex items-center gap-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-lg shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97] relative overflow-hidden"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="relative z-10">Save Changes</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
            <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        )}
      </button>
    </form>
  );
}
