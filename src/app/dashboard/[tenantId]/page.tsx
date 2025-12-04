"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMetrics, getTenant, getOrders, getProducts, Metrics, Tenant, Order, Product } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import MetricsCard from "@/components/MetricsCard";
import RevenueChart from "@/components/RevenueChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import OrderValueDistributionChart from "@/components/OrderValueDistributionChart";
import TopProductsChart from "@/components/TopProductsChart";
import { IndianRupee, Users, ShoppingCart, TrendingUp, Target, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TenantDashboardPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, metricsData, ordersData, productsData] = await Promise.all([
        getTenant(tenantId),
        getMetrics(tenantId),
        getOrders(tenantId, 1, 200), // Fetch orders for distribution chart
        getProducts(tenantId, 1, 50), // Fetch products for top products chart
      ]);

      setTenant(tenantData);
      setMetrics(metricsData);
      setOrders(ordersData.orders);
      setProducts(productsData.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tenantId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Something went wrong
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        {loading && !tenant ? (
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Analytics overview for <span className="font-semibold text-zinc-900 dark:text-zinc-200">{tenant?.name}</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricsCard
          label="Total Revenue"
          value={loading ? "" : formatCurrency(metrics?.totalRevenue || 0)}
          icon={IndianRupee}
          loading={loading}
        />
        <MetricsCard
          label="Total Customers"
          value={loading ? "" : formatNumber(metrics?.customersCount || 0)}
          icon={Users}
          loading={loading}
        />
        <MetricsCard
          label="Total Orders"
          value={loading ? "" : formatNumber(metrics?.ordersCount || 0)}
          icon={ShoppingCart}
          loading={loading}
        />
        <MetricsCard
          label="Avg Order Value"
          value={
            loading
              ? ""
              : formatCurrency(
                metrics?.ordersCount
                  ? (metrics.totalRevenue || 0) / metrics.ordersCount
                  : 0
              )
          }
          icon={TrendingUp}
          loading={loading}
        />
        <MetricsCard
          label="Revenue per Customer"
          value={
            loading
              ? ""
              : formatCurrency(
                metrics?.customersCount
                  ? (metrics.totalRevenue || 0) / metrics.customersCount
                  : 0
              )
          }
          icon={Target}
          loading={loading}
        />
        <MetricsCard
          label="Orders per Customer"
          value={
            loading
              ? ""
              : (metrics?.customersCount
                ? ((metrics.ordersCount || 0) / metrics.customersCount).toFixed(1)
                : "0")
          }
          icon={Repeat}
          loading={loading}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics?.ordersByDate || []} loading={loading} />
        <TopCustomersTable
          customers={metrics?.topCustomers || []}
          loading={loading}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderValueDistributionChart orders={orders} loading={loading} />
        <TopProductsChart products={products} loading={loading} />
      </div>
    </div>
  );
}
