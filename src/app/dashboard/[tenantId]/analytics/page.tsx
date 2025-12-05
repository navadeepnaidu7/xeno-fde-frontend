"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getTenant,
  getCheckoutAnalytics,
  getRefundAnalytics,
  getCheckouts,
  getRefunds,
  Tenant,
  CheckoutAnalytics,
  RefundAnalytics,
  Checkout,
  Refund,
} from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import MetricsCard from "@/components/MetricsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  RotateCcw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [checkoutAnalytics, setCheckoutAnalytics] = useState<CheckoutAnalytics | null>(null);
  const [refundAnalytics, setRefundAnalytics] = useState<RefundAnalytics | null>(null);
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<Checkout[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"checkouts" | "refunds">("checkouts");

  // Pagination for abandoned checkouts
  const [checkoutOffset, setCheckoutOffset] = useState(0);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const checkoutLimit = 10;

  // Pagination for refunds
  const [refundOffset, setRefundOffset] = useState(0);
  const [refundTotal, setRefundTotal] = useState(0);
  const refundLimit = 10;

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, checkoutData, refundData] = await Promise.all([
        getTenant(tenantId),
        getCheckoutAnalytics(tenantId),
        getRefundAnalytics(tenantId),
      ]);

      setTenant(tenantData);
      setCheckoutAnalytics(checkoutData.analytics);
      setRefundAnalytics(refundData.analytics);

      // Fetch abandoned checkouts
      const abandonedData = await getCheckouts(tenantId, "ABANDONED", checkoutLimit, 0);
      setAbandonedCheckouts(abandonedData.checkouts);
      setCheckoutTotal(abandonedData.total);

      // Fetch refunds
      const refundsData = await getRefunds(tenantId, refundLimit, 0);
      setRefunds(refundsData.refunds);
      setRefundTotal(refundsData.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAbandonedCheckouts(offset: number) {
    try {
      const data = await getCheckouts(tenantId, "ABANDONED", checkoutLimit, offset);
      setAbandonedCheckouts(data.checkouts);
      setCheckoutOffset(offset);
    } catch (err) {
      console.error("Failed to fetch checkouts:", err);
    }
  }

  async function fetchRefundsList(offset: number) {
    try {
      const data = await getRefunds(tenantId, refundLimit, offset);
      setRefunds(data.refunds);
      setRefundOffset(offset);
    } catch (err) {
      console.error("Failed to fetch refunds:", err);
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
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Failed to load analytics
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <Button onClick={() => fetchData()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const checkoutTotalPages = Math.ceil(checkoutTotal / checkoutLimit);
  const checkoutCurrentPage = Math.floor(checkoutOffset / checkoutLimit) + 1;
  const refundTotalPages = Math.ceil(refundTotal / refundLimit);
  const refundCurrentPage = Math.floor(refundOffset / refundLimit) + 1;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        {loading ? (
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
              Analytics
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Checkout & refund insights for{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                {tenant?.name}
              </span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Checkout Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-500" />
          Checkout Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            label="Total Checkouts"
            value={loading ? "" : (checkoutAnalytics?.totalCheckouts || 0).toString()}
            icon={ShoppingCart}
            loading={loading}
          />
          <MetricsCard
            label="Conversion Rate"
            value={loading ? "" : `${(checkoutAnalytics?.conversionRate || 0).toFixed(1)}%`}
            icon={TrendingUp}
            loading={loading}
          />
          <MetricsCard
            label="Abandonment Rate"
            value={loading ? "" : `${(checkoutAnalytics?.abandonmentRate || 0).toFixed(1)}%`}
            icon={TrendingDown}
            loading={loading}
          />
          <MetricsCard
            label="Lost Revenue"
            value={loading ? "" : formatCurrency(checkoutAnalytics?.abandonedValue || 0, "INR")}
            icon={IndianRupee}
            loading={loading}
          />
        </div>
      </div>

      {/* Checkout Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Completed
            </span>
          </div>
          <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            {loading ? "—" : checkoutAnalytics?.completedCheckouts || 0}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
            {loading ? "" : formatCurrency(checkoutAnalytics?.completedValue || 0, "INR")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500 rounded-xl">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Abandoned
            </span>
          </div>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100">
            {loading ? "—" : checkoutAnalytics?.abandonedCheckouts || 0}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {loading ? "" : formatCurrency(checkoutAnalytics?.abandonedValue || 0, "INR")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-500 rounded-xl">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Pending
            </span>
          </div>
          <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
            {loading ? "—" : checkoutAnalytics?.pendingCheckouts || 0}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Awaiting completion
          </p>
        </motion.div>
      </div>

      {/* Refund Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-orange-500" />
          Refund Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricsCard
            label="Total Refunds"
            value={loading ? "" : (refundAnalytics?.totalRefunds || 0).toString()}
            icon={RotateCcw}
            loading={loading}
          />
          <MetricsCard
            label="Total Refunded"
            value={loading ? "" : formatCurrency(refundAnalytics?.totalRefundAmount || 0, "INR")}
            icon={IndianRupee}
            loading={loading}
          />
          <MetricsCard
            label="Avg Refund Amount"
            value={loading ? "" : formatCurrency(refundAnalytics?.averageRefundAmount || 0, "INR")}
            icon={TrendingDown}
            loading={loading}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("checkouts")}
          className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === "checkouts"
              ? "border-red-500 text-red-600 dark:text-red-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Abandoned Carts ({checkoutTotal})
        </button>
        <button
          onClick={() => setActiveTab("refunds")}
          className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === "refunds"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Refunds ({refundTotal})
        </button>
      </div>

      {/* Abandoned Checkouts Table */}
      {activeTab === "checkouts" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Abandoned Carts
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Checkouts that were started but never completed
            </p>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : abandonedCheckouts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                No abandoned carts! All checkouts are completing successfully.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Abandoned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {abandonedCheckouts.map((checkout) => (
                    <TableRow key={checkout.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Mail className="h-4 w-4 text-zinc-500" />
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {checkout.email || "Guest"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{checkout.lineItemsCount} items</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(checkout.totalPrice, checkout.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {formatDateTime(checkout.createdAt)}
                      </TableCell>
                      <TableCell className="text-red-600 dark:text-red-400 text-sm">
                        {checkout.abandonedAt ? formatDateTime(checkout.abandonedAt) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {checkoutTotalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Page {checkoutCurrentPage} of {checkoutTotalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAbandonedCheckouts(checkoutOffset - checkoutLimit)}
                      disabled={checkoutOffset === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAbandonedCheckouts(checkoutOffset + checkoutLimit)}
                      disabled={checkoutCurrentPage >= checkoutTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Refunds Table */}
      {activeTab === "refunds" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Recent Refunds
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Orders that have been refunded
            </p>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : refunds.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                No refunds yet. Your customers are happy!
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id} className="group">
                      <TableCell>
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                          {refund.shopifyRefundId.slice(-8)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          #{refund.shopifyOrderId.slice(-6)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          -{formatCurrency(refund.amount, refund.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm max-w-[200px] truncate">
                        {refund.reason || "No reason provided"}
                      </TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm">
                        {formatDateTime(refund.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {refundTotalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Page {refundCurrentPage} of {refundTotalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchRefundsList(refundOffset - refundLimit)}
                      disabled={refundOffset === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchRefundsList(refundOffset + refundLimit)}
                      disabled={refundCurrentPage >= refundTotalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
