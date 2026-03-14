"use client";

import { formatPrice, formatDate } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface Order {
  id: string;
  buyerEmail: string;
  price: number;
  status: string;
  createdAt: string | Date;
  product: {
    title: string;
  };
}

interface OrderTableProps {
  orders: Order[];
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700",
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-700",
  };

  const dotStyles: Record<string, string> = {
    completed: "bg-emerald-500",
    paid: "bg-emerald-500",
    pending: "bg-amber-500",
    failed: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
        styles[status] || styles.pending
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          dotStyles[status] || dotStyles.pending
        }`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 p-16 text-center">
        <Inbox className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No orders yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Orders will appear here once customers purchase your products
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/80 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Product
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Buyer
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Amount
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Status
              </th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.product.title}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {order.buyerEmail}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(order.price)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-gray-400">
                    {formatDate(order.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
