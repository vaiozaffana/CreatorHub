"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then((mod) => {
      const gsap = mod.default;

      const ctx = gsap.context(() => {
        // Set initial hidden states explicitly
        gsap.set("[data-hero-line]", { y: "110%", rotateX: -80, opacity: 0 });
        gsap.set("[data-hero-subtitle]", { opacity: 0, y: 30 });
        gsap.set("[data-hero-cta] > *", { opacity: 0, y: 25, scale: 0.95 });
        gsap.set("[data-hero-badge]", { opacity: 0, scale: 0.9 });
        gsap.set("[data-hero-visual]", { opacity: 0, y: 80, scale: 0.92 });
        gsap.set("[data-hero-stat]", { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.2,
        });

        // Staggered text reveal — line by line
        tl.to("[data-hero-line]", {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
        })
          .to(
            "[data-hero-subtitle]",
            { opacity: 1, y: 0, duration: 0.9 },
            "-=0.5"
          )
          .to(
            "[data-hero-cta] > *",
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1 },
            "-=0.5"
          )
          .to(
            "[data-hero-badge]",
            { opacity: 1, scale: 1, duration: 0.6 },
            "-=0.4"
          )
          .to(
            "[data-hero-visual]",
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
            "-=0.7"
          )
          .to(
            "[data-hero-stat]",
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "-=0.6"
          );

        // Parallax on scroll
        const handleScroll = () => {
          const scrollY = window.scrollY;
          const visual = el.querySelector("[data-hero-visual]") as HTMLElement;
          const bg1 = el.querySelector("[data-bg-orb-1]") as HTMLElement;
          const bg2 = el.querySelector("[data-bg-orb-2]") as HTMLElement;

          if (visual) visual.style.transform = `translateY(${scrollY * 0.12}px)`;
          if (bg1) bg1.style.transform = `translateY(${scrollY * 0.2}px)`;
          if (bg2) bg2.style.transform = `translateY(${scrollY * -0.15}px)`;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        cleanup = () => window.removeEventListener("scroll", handleScroll);

        // Floating orbs
        gsap.to("[data-float]", {
          y: -18,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { amount: 2 },
        });
      }, el);

      cleanup = () => {
        ctx.revert();
        window.removeEventListener("scroll", () => {});
      };
    });

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Background — grid + orbs */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div
        data-bg-orb-1
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-[140px]"
      />
      <div
        data-bg-orb-2
        className="absolute -bottom-20 -right-40 w-[500px] h-[500px] bg-indigo-200/25 dark:bg-indigo-500/10 rounded-full blur-[120px]"
      />
      <div data-float className="absolute top-1/4 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-40" />
      <div data-float className="absolute top-1/3 left-[10%] w-2 h-2 bg-indigo-400 rounded-full opacity-30" />
      <div data-float className="absolute bottom-1/3 right-[25%] w-2.5 h-2.5 bg-violet-500 rounded-full opacity-25" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Title — massive bold typography */}
          <div className="mb-8">
            <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.9]">
              <div className="text-reveal-mask">
                <span data-hero-line className="block">Sell Your</span>
              </div>
              <div className="text-reveal-mask">
                <span data-hero-line className="block">
                  Digital{" "}
                  <span className="relative inline-block">
                    <span className="bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Products
                    </span>
                  </span>
                </span>
              </div>
              <div className="text-reveal-mask">
                <span data-hero-line className="block text-stroke-light text-[clamp(2.5rem,7vw,6.5rem)]">
                  Effortlessly.
                </span>
              </div>
            </h1>
          </div>

          {/* Subtitle + CTA row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
            <div className="max-w-md">
              <p data-hero-subtitle className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Upload, price, and sell your digital creations.
                <br className="hidden sm:block" />
                <span className="text-gray-900 dark:text-white font-medium">
                  Automatic delivery. Instant payments.
                </span>
              </p>

              <div data-hero-cta className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="/auth/register"
                  className="group relative flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-semibold text-base hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 transition-all duration-500 ease-out active:scale-[0.97] overflow-hidden"
                >
                  <span className="relative z-10">Start Selling Free</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-4 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors duration-300 text-base"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div data-hero-badge className="flex items-center gap-6 lg:gap-8">
              {[
                { value: "10K+", label: "Creators" },
                { value: "50K+", label: "Products Sold" },
                { value: "Rp2M+", label: "Paid Out" },
              ].map((stat) => (
                <div key={stat.label} data-hero-stat className="text-center">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Visual — floating mock dashboard */}
        <div data-hero-visual className="mt-20 lg:mt-24 relative max-w-6xl mx-auto">
          <div className="bg-gray-950 rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-800/50 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-900/80 border-b border-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="h-7 bg-gray-800/80 rounded-lg flex items-center px-4 min-w-64">
                  <svg className="w-3 h-3 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[11px] text-gray-500 font-mono">creatorhub.io/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Revenue", value: "Rp12.450K", change: "+22%", color: "text-emerald-400" },
                  { label: "Sales", value: "324", change: "+18%", color: "text-violet-400" },
                  { label: "Products", value: "12", change: "+3", color: "text-amber-400" },
                  { label: "Visitors", value: "8.2K", change: "+14%", color: "text-blue-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/20">
                    <p className="text-[11px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${stat.color} tracking-tight font-display`}>{stat.value}</p>
                    <p className="text-[10px] text-emerald-500/70 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/30 rounded-2xl p-5 border border-gray-700/20">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs text-gray-400 font-medium">Revenue Overview</span>
                  <span className="text-[10px] text-gray-600 bg-gray-800 px-2.5 py-1 rounded-lg">Last 30 days</span>
                </div>
                <div className="flex items-end gap-1 h-28 sm:h-36">
                  {[30, 45, 35, 60, 50, 75, 55, 85, 65, 90, 70, 95, 60, 80, 72, 88, 78, 92, 68, 85, 76, 98, 82, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-linear-to-t from-violet-600/50 to-indigo-400/50 rounded-t-sm hover:from-violet-500/70 hover:to-indigo-300/70 transition-colors duration-200"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-violet-500/8 rounded-full blur-3xl" />

          {/* Floating accent badges */}
          <div data-float className="absolute -right-4 top-1/4 hidden lg:flex items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-xl shadow-gray-900/10 border border-gray-100 dark:border-gray-800">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/15 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">New Sale!</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">UI Kit — Rp49.000</p>
            </div>
          </div>

          <div data-float className="absolute -left-4 top-2/3 hidden lg:flex items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-xl shadow-gray-900/10 border border-gray-100 dark:border-gray-800">
            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-500/15 rounded-xl flex items-center justify-center">
              <span className="text-sm">🎉</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Rp250K Hari Ini</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">5 orders</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
