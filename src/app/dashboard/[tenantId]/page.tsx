"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMetrics, getTenant, Metrics, Tenant } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import MetricsCard from "@/components/MetricsCard";
import RevenueChart from "@/components/RevenueChart";
import TopCustomersTable from "@/components/TopCustomersTable";
import { DollarSign, Users, ShoppingCart, TrendingUp, Target, Repeat, CalendarDays, X, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        
        {/* Date Filter Toggle */}
        <Button
          variant={showDateFilter || startDate || endDate ? "default" : "outline"}
          onClick={() => setShowDateFilter(!showDateFilter)}
          className={`gap-2 shadow-sm hover:shadow-md transition-all duration-300 ${
            startDate || endDate
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 text-white"
              : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>{startDate || endDate ? "Filtered" : "Filter"}</span>
          {(startDate || endDate) && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs font-semibold">
              ✓
            </span>
          )}
        </Button>
      </div>

      {/* Date Filter Panel */}
      {showDateFilter && (
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/80 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 backdrop-blur-sm">
          {/* Decorative gradient blur */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                <CalendarDays className="h-4 w-4 text-emerald-500" />
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                <CalendarDays className="h-4 w-4 text-teal-500" />
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all duration-200 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                onClick={handleApplyDateFilter} 
                className="flex-1 sm:flex-none h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearDateFilter} 
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
