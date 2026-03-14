"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/actions/auth";
import { Zap, Mail, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setResendStatus("sending");

    const result = await resendVerificationEmail(email);
    if (result?.error) {
      setResendStatus("error");
      toast.error(result.error);
    } else {
      setResendStatus("sent");
      setCooldown(60);
      toast.success("Verification email sent!", {
        description: `Check your inbox at ${email}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.06),transparent_70%)]" />

      <div className="w-full max-w-md text-center relative">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow duration-300">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Creator<span className="text-violet-600">Hub</span>
          </span>
        </Link>

        {/* Mail icon */}
        <div className="mx-auto w-20 h-20 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Mail className="w-10 h-10 text-violet-600 dark:text-violet-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          Cek email Anda
        </h1>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-2">
          Kami telah mengirimkan link verifikasi ke
        </p>
        {email && (
          <p className="text-[15px] font-semibold text-gray-900 dark:text-white mb-8">{email}</p>
        )}

        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Klik link di email untuk mengaktifkan akun Anda.
          <br />
          Cek juga folder spam jika tidak menemukannya.
        </p>

        {/* Resend button */}
        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resendStatus === "sending" || !email}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {resendStatus === "sending" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {cooldown > 0
              ? `Kirim ulang dalam ${cooldown}s`
              : "Kirim ulang email"}
          </button>

          <div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke login
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Email salah?{" "}
            <Link
              href="/auth/register"
              className="text-violet-600 font-medium hover:text-violet-700 transition-colors duration-200"
            >
              Daftar ulang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
