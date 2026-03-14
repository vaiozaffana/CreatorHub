"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then((mod) => {
      const gsap = mod.default;

      // Set initial hidden state
      gsap.set("[data-cta-line]", { y: "110%", rotateX: -60, opacity: 0 });
      gsap.set("[data-cta-sub]", { opacity: 0, y: 25 });
      gsap.set("[data-cta-btn]", { opacity: 0, scale: 0.9, y: 20 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Big text reveal
              gsap.to("[data-cta-line]", {
                y: 0,
                rotateX: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.12,
                ease: "power4.out",
              });

              gsap.to("[data-cta-sub]", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.5,
                ease: "power3.out",
              });

              gsap.to("[data-cta-btn]", {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                delay: 0.7,
                ease: "power3.out",
              });

              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (el) observer.observe(el);
      cleanup = () => observer.disconnect();
    });

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Dark background with grain */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Large decorative text watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-display text-[20vw] font-bold text-white/[0.02] whitespace-nowrap tracking-tighter">
          START NOW
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-44">
        <div className="max-w-4xl">
          {/* Big bold headline */}
          <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-white tracking-tighter leading-[0.9] mb-8">
            <div className="text-reveal-mask">
              <span data-cta-line className="block">Ready to start</span>
            </div>
            <div className="text-reveal-mask">
              <span data-cta-line className="block">
                <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  selling?
                </span>
              </span>
            </div>
          </h2>

          <p data-cta-sub className="text-xl text-gray-400 max-w-lg leading-relaxed mb-10">
            Join thousands of creators earning with CreatorHub.
            Set up your store in under 2 minutes.
          </p>

          <div data-cta-btn className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/auth/register"
              className="group relative flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 shadow-2xl shadow-white/10 transition-all duration-500 ease-out active:scale-[0.97] overflow-hidden dark:shadow-black/20"
            >
              <span className="relative z-10">Create Your Store</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-linear-to-r from-violet-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <div className="flex items-center gap-6 px-4 py-5">
              <span className="text-sm text-gray-500">Free forever</span>
              <span className="w-px h-4 bg-gray-700" />
              <span className="text-sm text-gray-500">No credit card</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
