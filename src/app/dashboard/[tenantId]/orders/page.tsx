"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrders, getCustomers, Order, Customer, Pagination, getTenant, Tenant } from "@/lib/api";
import OrdersTable from "@/components/OrdersTable";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Map<string, Customer>>(new Map());
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date filter state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Fetch all customers to create a lookup map
  async function fetchCustomers() {
    try {
      const customersData = await getCustomers(tenantId, 1, 100);
      const customerMap = new Map<string, Customer>();
      customersData.customers.forEach((customer) => {
        customerMap.set(customer.id, customer);
      });
      setCustomers(customerMap);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  }

  async function fetchOrders(page: number, start?: string, end?: string) {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, ordersData] = await Promise.all([
        tenant ? Promise.resolve(tenant) : getTenant(tenantId),
        getOrders(tenantId, page, 20, start, end),
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
      fetchCustomers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage, startDate || undefined, endDate || undefined);
  };

  const handleApplyDateFilter = () => {
    fetchOrders(1, startDate || undefined, endDate || undefined);
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchOrders(1);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Error loading orders
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <Button
            onClick={() => fetchOrders(1)}
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
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Orders
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            View and manage orders for <span className="font-semibold text-zinc-900 dark:text-zinc-200">{tenant?.name || "this store"}</span>
          </p>
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

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
        customerMap={customers}
      />
    </div>
  );
}
