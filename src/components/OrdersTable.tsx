"use client";

import { Order, Pagination } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function OrdersTable({
  orders,
  pagination,
  onPageChange,
  loading = false,
}: OrdersTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse flex-1" />
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Orders
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {pagination.totalCount} total orders
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No orders found
                </p>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{order.orderNumber}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(order.createdAt)}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {order.customerId.slice(0, 8)}...
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(order.total, order.currency)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
