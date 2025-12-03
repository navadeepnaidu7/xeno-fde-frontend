"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrders, Order, Pagination, getTenant, Tenant } from "@/lib/api";
import OrdersTable from "@/components/OrdersTable";

export default function OrdersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders(page: number) {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, ordersData] = await Promise.all([
        tenant ? Promise.resolve(tenant) : getTenant(tenantId),
        getOrders(tenantId, page),
      ]);

      if (!tenant) {
        setTenant(tenantData);
      }
      setOrders(ordersData.orders);
      setPagination(ordersData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tenantId) {
      fetchOrders(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Error loading orders
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => fetchOrders(1)}
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Orders
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          View and manage orders for {tenant?.name || "this store"}
        </p>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
