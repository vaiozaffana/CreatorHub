"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface SalesChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-16 text-center">
        <BarChart3 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No sales data yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Revenue charts will appear once you start making sales</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h3>
        <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
          Last 30 days
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.06)",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`Rp${new Intl.NumberFormat("id-ID").format(value)}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
