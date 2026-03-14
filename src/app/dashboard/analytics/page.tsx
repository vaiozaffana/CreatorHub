import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SalesChart from "@/components/SalesChart";
import DashboardStats from "@/components/DashboardStats";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: {
      product: { userId: user.id },
      status: "completed",
      isDemo: false,
    },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const products = await prisma.product.findMany({
    where: { userId: user.id },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const totalSales = orders.length;
  const totalProducts = products.length;

  const allOrders = await prisma.order.count({
    where: { product: { userId: user.id }, isDemo: false },
  });
  const conversionRate =
    allOrders > 0 ? (totalSales / allOrders) * 100 : 0;

  // Monthly chart data
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

  orders.forEach((order) => {
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
    ([date, data]) => ({ date, ...data })
  );

  // Top products
  const productSales = new Map<
    string,
    { title: string; revenue: number; count: number }
  >();
  orders.forEach((order) => {
    const existing = productSales.get(order.productId);
    if (existing) {
      existing.revenue += order.price;
      existing.count += 1;
    } else {
      productSales.set(order.productId, {
        title: order.product.title,
        revenue: order.price,
        count: 1,
      });
    }
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Track your sales performance and growth
        </p>
      </div>

      <DashboardStats
        totalRevenue={totalRevenue}
        totalSales={totalSales}
        totalProducts={totalProducts}
        conversionRate={conversionRate}
      />

      <SalesChart data={chartData} />

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-5">
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-4">
          Top Products
        </h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No sales data yet</p>
        ) : (
          <div className="space-y-0">
            {topProducts.map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.count} sales
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${product.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
