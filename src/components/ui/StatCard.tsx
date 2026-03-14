import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = "text-violet-600",
  iconBg = "bg-violet-50",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                  trend.value >= 0
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
