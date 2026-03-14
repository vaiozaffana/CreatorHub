"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn, signUp, signInWithGoogle } from "@/actions/auth";
import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";

type AuthMode = "login" | "register";

interface AuthPanelProps {
  initialMode: AuthMode;
}

function AuthPanelInner({ initialMode }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pickup URL errors (e.g. from OAuth or email confirmation)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) toast.error(urlError);
  }, [searchParams]);

  // Animate when switching modes
  const switchMode = useCallback((newMode: AuthMode) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Let the CSS transition run, then flip
    setTimeout(() => {
      setMode(newMode);
      // Update URL without full navigation
      window.history.replaceState(null, "", `/auth/${newMode === "login" ? "login" : "register"}`);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 500);
  }, [isTransitioning]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const loadingId = toast.loading(
      mode === "login" ? "Signing in..." : "Creating account..."
    );
    try {
      if (mode === "login") {
        const result = await signIn(formData);
        if (result?.error) {
          toast.error(result.error, {
            id: loadingId,
            description: result.error.toLowerCase().includes("belum diverifikasi")
              ? "Cek inbox email Anda atau daftar ulang untuk kirim ulang email verifikasi."
              : undefined,
            duration: 6000,
          });
        } else if (result?.success && result?.redirectTo) {
          toast.success("Welcome back!", {
            id: loadingId,
            description: "Redirecting to dashboard...",
          });
          router.push(result.redirectTo);
          return;
        }
      } else {
        const result = await signUp(formData);
        if (result?.error) {
          toast.error(result.error, { id: loadingId });
        } else if (result?.success) {
          toast.success("Account created! Please verify your email.", {
            id: loadingId,
            description: `Verification link sent to ${result.email}`,
          });
          router.push(
            `/auth/verify-email?email=${encodeURIComponent(result.email || "")}`
          );
          return;
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.", {
        id: loadingId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === "login";
  // When transitioning, we flip the visual position
  const flipped = isTransitioning;

  return (
    <div className="min-h-screen flex relative overflow-y-auto bg-white dark:bg-gray-950">
      {/* ══════════════════════════════════════════════════════
          BRAND PANEL — slides between left & right
          ══════════════════════════════════════════════════════ */}
      <div
        className={`
          hidden lg:flex absolute inset-y-0 w-[50%] z-20
          transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
          ${isLogin && !flipped ? "left-0" : ""}
          ${isLogin && flipped ? "left-[50%]" : ""}
          ${!isLogin && !flipped ? "left-[50%]" : ""}
          ${!isLogin && flipped ? "left-0" : ""}
        `}
      >
        <div className="relative w-full h-full bg-gray-950 overflow-hidden flex items-center justify-center p-12">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid opacity-[0.04]" />
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              isLogin
                ? "bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.25),transparent_60%)]"
                : "bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.25),transparent_60%)]"
            }`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />

          {/* Floating decorative orbs */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-violet-500/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px]" />

          {/* Content — transitions between login and register info */}
          <div className="relative max-w-md text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-12 group cursor-pointer">
              <div className="w-11 h-11 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-shadow duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                Creator<span className="text-violet-400">Hub</span>
              </span>
            </Link>

            <div
              className={`transition-all duration-500 ${
                flipped ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              {isLogin ? (
                <>
                  <h2 className="font-display text-4xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
                    Welcome back
                    <br />
                    <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      creator
                    </span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-lg mb-10">
                    Track sales, manage products, and grow your digital business.
                  </p>
                  <div className="flex items-center justify-center gap-8">
                    {[
                      { value: "10K+", label: "Creators", icon: Sparkles },
                      { value: "Rp2M+", label: "Revenue", icon: TrendingUp },
                      { value: "99.9%", label: "Uptime", icon: Shield },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                        <p className="font-display text-xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-display text-4xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
                    Start selling
                    <br />
                    <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      today
                    </span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-lg mb-10">
                    Join thousands of creators who use CreatorHub to sell
                    digital products.
                  </p>
                  <div className="space-y-4 text-left mx-auto max-w-xs">
                    {[
                      "No platform fees on free plan",
                      "Instant payouts to your account",
                      "Built-in analytics dashboard",
                      "Secure file delivery",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <span className="text-[15px] text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FORM PANEL — slides to the opposite side
          ══════════════════════════════════════════════════════ */}
      <div
        className={`
          w-full lg:w-[50%] lg:absolute lg:inset-y-0 z-10
          transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
          ${isLogin && !flipped ? "lg:left-[50%]" : ""}
          ${isLogin && flipped ? "lg:left-0" : ""}
          ${!isLogin && !flipped ? "lg:left-0" : ""}
          ${!isLogin && flipped ? "lg:left-[50%]" : ""}
          flex items-center justify-center px-4 sm:px-8 bg-white dark:bg-gray-950
          overflow-y-auto
        `}
      >
        <div className="w-full max-w-100 py-8 my-auto">
          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden flex items-center justify-center gap-2.5 mb-8 cursor-pointer"
          >
            <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Creator<span className="text-violet-600">Hub</span>
            </span>
          </Link>

          {/* Form content with crossfade */}
          <div
            className={`transition-all duration-500 ${
              flipped ? "opacity-0 scale-[0.97] translate-y-2" : "opacity-100 scale-100 translate-y-0"
            }`}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isLogin ? "Sign in" : "Create account"}
              </h1>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-2">
                {isLogin
                  ? "Enter your credentials to continue"
                  : "Start selling digital products in minutes"}
              </p>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="space-y-4">
              {/* Name — register only */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-gray-300 dark:hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full h-12 flex items-center justify-center gap-2.5 bg-gray-900 dark:bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-violet-700 shadow-lg shadow-gray-900/10 dark:shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.97] mt-1 relative overflow-hidden cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">
                      {isLogin ? "Sign In" : "Create Account"}
                    </span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-950 px-3 text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="w-full">
              {/* Google */}
              <button
                type="button"
                disabled={!!oauthLoading || isLoading}
                onClick={async () => {
                  setOauthLoading("google");
                  try {
                    const result = await signInWithGoogle();
                    if (result?.error) {
                      toast.error(result.error);
                    }
                  } catch {
                    // redirect throws — this is expected
                  } finally {
                    setOauthLoading(null);
                  }
                }}
                className="flex items-center justify-center gap-2.5 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97] cursor-pointer w-full"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>Google</span>
              </button>
            </div>

            {/* Switch mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => switchMode(isLogin ? "register" : "login")}
                  className="text-violet-600 font-semibold hover:text-violet-700 transition-colors duration-200 cursor-pointer"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE BOTTOM DECORATION
          ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-1 bg-linear-to-r from-violet-600 via-indigo-600 to-violet-600" />
    </div>
  );
}

export default function AuthPanel(props: AuthPanelProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        </div>
      }
    >
      <AuthPanelInner {...props} />
    </Suspense>
  );
}
