"use client";

import { useRef, useEffect } from "react";
import {
  BookOpen,
  Code2,
  Palette,
  GraduationCap,
  Layout,
  FileCode2,
  Layers,
  Music,
} from "lucide-react";

const categories = [
  { icon: BookOpen, name: "Ebooks", count: "2.4K+", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200/60" },
  { icon: Layout, name: "Templates", count: "1.8K+", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60" },
  { icon: Palette, name: "UI Kits", count: "960+", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200/60" },
  { icon: GraduationCap, name: "Courses", count: "540+", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/60" },
  { icon: Code2, name: "Source Code", count: "1.2K+", color: "text-red-600", bg: "bg-red-50", border: "border-red-200/60" },
  { icon: FileCode2, name: "SaaS Starters", count: "320+", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200/60" },
  { icon: Layers, name: "Design Systems", count: "180+", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200/60" },
  { icon: Music, name: "Audio & Music", count: "750+", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200/60" },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then((mod) => {
      const gsap = mod.default;

      // Set initial hidden state
      gsap.set("[data-showcase-heading] > *", { opacity: 0, y: 50 });
      gsap.set("[data-showcase-card]", { opacity: 0, scale: 0.9, y: 30 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to("[data-showcase-heading] > *", {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
              });

              gsap.to("[data-showcase-card]", {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                ease: "power3.out",
                delay: 0.4,
              });

              observer.disconnect();
            }
          });
        },
        { threshold: 0.05 }
      );

      if (el) observer.observe(el);
      cleanup = () => observer.disconnect();
    });

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 bg-[#fafafa] dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-[0.04]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-showcase-heading className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
                / Marketplace
              </span>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.95]">
                Sell any type of
                <br />
                <span className="bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  digital product
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-gray-500 dark:text-gray-400 text-lg leading-relaxed lg:text-right">
              Whether it&apos;s an ebook, a Figma template, or a full SaaS starter — CreatorHub supports it all.
            </p>
          </div>
          <div className="mt-8 h-px bg-linear-to-r from-gray-200 via-gray-200 to-transparent dark:from-gray-800 dark:via-gray-800" />
        </div>

        {/* Categories grid — 2 rows with different sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                data-showcase-card
                className={`group flex flex-col items-center justify-center p-8 rounded-3xl border ${cat.border} bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-500 ease-out cursor-default`}
              >
                <div
                  className={`${cat.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <Icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                <span className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                  {cat.name}
                </span>
                <span className="text-sm text-gray-400 font-medium">{cat.count} listed</span>
              </div>
            );
          })}
        </div>

        {/* Infinite scroll marquee — category text */}
        <div className="mt-16 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...categories, ...categories].map((cat, i) => (
              <span
                key={i}
                className="font-display text-[4rem] lg:text-[6rem] font-bold text-gray-100 dark:text-gray-800/60 mx-8 select-none tracking-tighter"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
