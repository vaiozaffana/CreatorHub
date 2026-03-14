"use client";

import { useRef, useEffect } from "react";
import {
  Upload,
  CreditCard,
  Download,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Anything",
    description:
      "Ebooks, templates, source code, UI kits, courses — upload any digital file.",
    color: "from-violet-500 to-purple-600",
    iconColor: "text-violet-600",
    bg: "bg-violet-50",
    span: "md:col-span-2",
  },
  {
    icon: CreditCard,
    title: "Instant Checkout",
    description:
      "Seamless payment flow. Customers pay and get instant access.",
    color: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
    span: "",
  },
  {
    icon: Download,
    title: "Auto Delivery",
    description:
      "Files delivered automatically after payment. Zero manual work.",
    color: "from-blue-500 to-cyan-600",
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track revenue, conversions, and growth with real-time analytics.",
    color: "from-amber-500 to-orange-600",
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
    span: "",
  },
  {
    icon: Shield,
    title: "Secure & Protected",
    description:
      "Files protected with signed URLs. Only paid customers get access.",
    color: "from-red-500 to-rose-600",
    iconColor: "text-red-600",
    bg: "bg-red-50",
    span: "",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Modern infrastructure for blazing-fast performance globally.",
    color: "from-indigo-500 to-violet-600",
    iconColor: "text-indigo-600",
    bg: "bg-indigo-50",
    span: "md:col-span-2",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then((mod) => {
      const gsap = mod.default;

      // Parallax for section heading
      const handleScroll = () => {
        const rect = el.getBoundingClientRect();
        const progress = -rect.top / window.innerHeight;
        const heading = el.querySelector("[data-feature-heading]") as HTMLElement;
        if (heading && progress > -0.5 && progress < 1.5) {
          heading.style.transform = `translateY(${progress * -20}px)`;
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Set initial hidden state
      gsap.set("[data-feature-heading] > *", { opacity: 0, y: 50 });
      gsap.set("[data-feature-card]", { opacity: 0, y: 60, scale: 0.95 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Heading animation
              gsap.to("[data-feature-heading] > *", {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
              });

              // Cards stagger with scale
              gsap.to("[data-feature-card]", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.3,
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.05 }
      );

      if (el) observer.observe(el);

      cleanup = () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    });

    return () => cleanup?.();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-28 lg:py-40 bg-[#fafafa] dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — big bold split layout */}
        <div data-feature-heading className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">
                / Features
              </span>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.95]">
                Everything you
                <br />
                need to{" "}
                <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  succeed
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-gray-500 dark:text-gray-400 text-lg leading-relaxed lg:text-right">
              From upload to delivery — we handle the infrastructure so you can focus on creating.
            </p>
          </div>
          <div className="mt-8 h-px bg-linear-to-r from-gray-200 dark:from-gray-800 via-gray-200 dark:via-gray-800 to-transparent" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-feature-card
                className={`group relative p-8 rounded-3xl border border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300/80 dark:hover:border-gray-700 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-950/50 hover:-translate-y-1 ${feature.span}`}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                <div className="relative">
                  <div
                    className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
