"use client";

import { Customer, Pagination } from "@/lib/api";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomersTableProps {
  customers: Customer[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function CustomersTable({
  customers,
  pagination,
  onPageChange,
  loading = false,
}: CustomersTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse flex-1" />
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
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
          Customers
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {pagination.totalCount} total customers
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Orders</TableHead>
            <TableHead className="text-right">Total Spent</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No customers found
                </p>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => {
              const fullName =
                [customer.firstName, customer.lastName]
                  .filter(Boolean)
                  .join(" ") || null;

              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-sm font-semibold text-white dark:text-zinc-900">
                        {getInitials(fullName || customer.email)}
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {fullName || "Unnamed"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-400">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.ordersCount}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right text-zinc-500 dark:text-zinc-400">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })
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
