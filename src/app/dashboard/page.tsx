import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardStats from "@/components/DashboardStats";
import OrderTable from "@/components/OrderTable";
import SalesChart from "@/components/SalesChart";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  // Fetch dashboard data
  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      where: { userId: user.id },
    }),
    prisma.order.findMany({
      where: {
        product: { userId: user.id },
      },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Exclude demo orders from stats
  const completedOrders = orders.filter((o) => o.status === "completed" && !o.isDemo);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const totalSales = completedOrders.length;
  const totalProducts = products.length;

  // Calculate conversion rate (exclude demo orders)
  const totalOrders = orders.filter((o) => !o.isDemo).length;
  const conversionRate =
    totalOrders > 0 ? (totalSales / totalOrders) * 100 : 0;

  // Generate chart data from recent orders
  const chartDataMap = new Map<string, { revenue: number; orders: number }>();
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    chartDataMap.set(key, { revenue: 0, orders: 0 });
  }

  completedOrders.forEach((order) => {
    const key = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (chartDataMap.has(key)) {
      const existing = chartDataMap.get(key)!;
      existing.revenue += order.price;
      existing.orders += 1;
    }
  });

  const chartData = Array.from(chartDataMap.entries()).map(
    ([date, data]) => ({
      date,
      ...data,
    })
  );

  const recentOrders = orders.map((o) => ({
    id: o.id,
    buyerEmail: o.buyerEmail,
    price: o.price,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    product: { title: o.product.title },
  }));

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Welcome back, {user.name}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-1.5 h-9 px-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm transition-[background-color,transform,opacity] duration-200 active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" />
          New Product
        </Link>
      </div>

      {/* Stats */}
      <DashboardStats
        totalRevenue={totalRevenue}
        totalSales={totalSales}
        totalProducts={totalProducts}
        conversionRate={conversionRate}
      />

      {/* Chart */}
      <SalesChart data={chartData} />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors duration-200"
          >
            View All →
          </Link>
        </div>
        <OrderTable orders={recentOrders} />
      </div>
    </div>
  );
}
