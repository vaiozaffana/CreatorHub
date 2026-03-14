import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OrderTable from "@/components/OrderTable";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: {
      product: { userId: user.id },
    },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders = orders.map((o) => ({
    id: o.id,
    buyerEmail: o.buyerEmail,
    price: o.price,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    product: { title: o.product.title },
  }));

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Track all purchases of your products
        </p>
      </div>

      <OrderTable orders={formattedOrders} />
    </div>
  );
}
