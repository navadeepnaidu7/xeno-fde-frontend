"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMetrics, getTenant, Metrics, Tenant } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import MetricsCard from "@/components/MetricsCard";
import RevenueChart from "@/components/RevenueChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default function TenantDashboardPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [tenantData, metricsData] = await Promise.all([
          getTenant(tenantId),
          getMetrics(tenantId),
        ]);

        setTenant(tenantData);
        setMetrics(metricsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    if (tenantId) {
      fetchData();
    }
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
          <button
            onClick={() => window.location.reload()}
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
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Analytics overview for {tenant?.name}
            </p>
          </>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          label="Total Revenue"
          value={loading ? "" : formatCurrency(metrics?.totalRevenue || 0)}
          icon={DollarSign}
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
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics?.ordersByDate || []} loading={loading} />
        <TopCustomersTable
          customers={metrics?.topCustomers || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
