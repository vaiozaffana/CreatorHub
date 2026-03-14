"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started.",
    features: [
      "Up to 3 products",
      "Basic analytics",
      "Standard checkout",
      "Email support",
      "Community access",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp299K",
    period: "/bln",
    description: "For serious creators who want to scale.",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Custom domain",
      "Email automation",
      "API access",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "Rp799K",
    period: "/bln",
    description: "For teams selling at scale.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then((mod) => {
      const gsap = mod.default;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.from("[data-pricing-card]", {
                opacity: 0,
                y: 40,
                duration: 0.7,
                stagger: 0.12,
                ease: "power3.out",
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.15 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 lg:py-32 bg-white relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-100/80 text-emerald-700 text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Start for free. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              data-pricing-card
              className={`relative rounded-2xl ${
                plan.popular
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 ring-1 ring-gray-800 md:-my-4 py-10 px-8"
                  : "bg-white border border-gray-200/80 shadow-sm py-8 px-7"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-sm font-semibold mb-4 uppercase tracking-wider ${
                    plan.popular ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        plan.popular ? "bg-violet-500/20" : "bg-violet-50"
                      }`}
                    >
                      <Check
                        className={`w-2.5 h-2.5 ${
                          plan.popular ? "text-violet-400" : "text-violet-600"
                        }`}
                        strokeWidth={3}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`group flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-sm font-medium transition-[background-color,transform] duration-200 ease-out active:scale-[0.97] ${
                  plan.popular
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-sm"
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
