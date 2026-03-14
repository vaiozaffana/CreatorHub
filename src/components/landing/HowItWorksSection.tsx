"use client";

import { useRef, useEffect } from "react";
import { Upload, Share2, Banknote, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Product",
    description:
      "Drag and drop your digital file — ebooks, templates, code, or any digital asset.",
  },
  {
    step: "02",
    icon: Share2,
    title: "Share Your Link",
    description:
      "Get a beautiful product page with a unique link. Share it anywhere.",
  },
  {
    step: "03",
    icon: Banknote,
    title: "Get Paid Instantly",
    description:
      "Customers pay through seamless checkout. Money goes directly to you.",
  },
  {
    step: "04",
    icon: Download,
    title: "Auto Delivery",
    description:
      "Files are delivered automatically to buyers. Zero manual work required.",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then((mod) => {
      const gsap = mod.default;

      // Parallax for large numbers
      const handleScroll = () => {
        const rect = el.getBoundingClientRect();
        const progress = -rect.top / window.innerHeight;
        el.querySelectorAll<HTMLElement>("[data-step-number]").forEach((num, i) => {
          if (progress > -0.5 && progress < 2) {
            const offset = progress * (15 + i * 5);
            num.style.transform = `translateY(${offset}px)`;
          }
        });
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Set initial hidden state
      gsap.set("[data-how-heading] > *", { opacity: 0, y: 50 });
      gsap.set("[data-step-line]", { scaleX: 0 });
      gsap.set("[data-step-card]", { opacity: 0, y: 60 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Section heading
              gsap.to("[data-how-heading] > *", {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
              });

              // Step line
              gsap.to("[data-step-line]", {
                scaleX: 1,
                duration: 1.2,
                ease: "power3.inOut",
                delay: 0.4,
              });

              // Cards with stagger
              gsap.to("[data-step-card]", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.5,
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
      id="how-it-works"
      className="py-28 lg:py-40 relative bg-white dark:bg-gray-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div data-how-heading className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
                / How It Works
              </span>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.95]">
                Zero to selling
                <br />
                in{" "}
                <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  minutes
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-gray-500 dark:text-gray-400 text-lg leading-relaxed lg:text-right">
              Four simple steps. No technical skills required. Just upload and earn.
            </p>
          </div>
          <div className="mt-8 h-px bg-linear-to-r from-gray-200 dark:from-gray-800 via-gray-200 dark:via-gray-800 to-transparent" />
        </div>

        {/* Horizontal connecting line (desktop) */}
        <div className="hidden lg:block relative mb-0">
          <div
            data-step-line
            className="absolute top-0 left-[8%] right-[8%] h-px bg-linear-to-r from-violet-300 via-indigo-300 to-violet-300"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} data-step-card className="relative group">
                {/* Large watermark number */}
                <div
                  data-step-number
                  className="absolute -top-4 -left-2 font-display text-[8rem] font-bold text-gray-100/60 dark:text-gray-800/40 leading-none select-none pointer-events-none z-0 group-hover:text-violet-100/60 dark:group-hover:text-violet-900/30 transition-colors duration-500"
                >
                  {step.step}
                </div>

                <div className="relative z-10 pt-16">
                  {/* Dot indicator */}
                  <div className="hidden lg:block absolute -top-[1px] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 group-hover:border-violet-500 group-hover:bg-violet-500 transition-colors duration-300" />
                  </div>

                  <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-gray-900 mb-6 group-hover:bg-violet-600 dark:group-hover:bg-violet-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
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
