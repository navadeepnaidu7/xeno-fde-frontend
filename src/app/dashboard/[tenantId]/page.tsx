"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMetrics, getTenant, Metrics, Tenant } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import MetricsCard from "@/components/MetricsCard";
import RevenueChart from "@/components/RevenueChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import { IndianRupee, Users, ShoppingCart, TrendingUp, Target, Repeat, CalendarDays, X, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function TenantDashboardPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  async function fetchData(start?: string, end?: string) {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, metricsData] = await Promise.all([
        getTenant(tenantId),
        getMetrics(tenantId, start, end),
      ]);

      setTenant(tenantData);
      setMetrics(metricsData);
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

  const handleApplyDateFilter = () => {
    fetchData(startDate || undefined, endDate || undefined);
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
  };

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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Date Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button
            variant={showDateFilter || startDate || endDate ? "secondary" : "outline"}
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`gap-2 transition-all duration-300 ${startDate || endDate
              ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              : ""
              }`}
          >
            {showDateFilter ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            <span>{startDate || endDate ? "Filtered" : "Filter"}</span>
            {(startDate || endDate) && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">
                ON
              </span>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Date Filter Panel */}
      <AnimatePresence>
        {showDateFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-2">
              <div className="flex flex-col sm:flex-row gap-6 items-end">
                <div className="flex-1 w-full space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <CalendarDays className="h-4 w-4 text-zinc-500" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all"
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <CalendarDays className="h-4 w-4 text-zinc-500" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleApplyDateFilter}
                    className="flex-1 sm:flex-none"
                  >
                    Apply Filter
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleClearDateFilter}
                    className="flex-1 sm:flex-none"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
}
