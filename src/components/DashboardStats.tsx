"use client";

import { useRef, useEffect } from "react";
import { Banknote, Package, ShoppingBag, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  conversionRate: number;
}

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;

    let startTime: number;
    const duration = 1200;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      if (el) {
        const formatted = decimals > 0
          ? current.toFixed(decimals)
          : new Intl.NumberFormat("id-ID").format(Math.round(current));
        el.textContent = `${prefix}${formatted}${suffix}`;
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, prefix, suffix, decimals]);

  return (
    <span ref={countRef}>
      {prefix}0{suffix}
    </span>
  );
}

export default function DashboardStats({
  totalRevenue,
  totalSales,
  totalProducts,
  conversionRate,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      prefix: "Rp",
      decimals: 0,
      icon: Banknote,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Sales",
      value: totalSales,
      prefix: "",
      decimals: 0,
      icon: ShoppingBag,
      iconColor: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      label: "Products",
      value: totalProducts,
      prefix: "",
      decimals: 0,
      icon: Package,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Conversion Rate",
      value: conversionRate,
      prefix: "",
      suffix: "%",
      decimals: 1,
      icon: TrendingUp,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-5 hover:shadow-md hover:shadow-gray-100/60 dark:hover:shadow-gray-900/50 transition-shadow duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <div
                className={`${stat.bgColor} w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
              >
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
