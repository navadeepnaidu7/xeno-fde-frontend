"use client";

import { Product, Pagination } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import { ChevronLeft, ChevronRight, Package, Tag } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function ProductsTable({
  products,
  pagination,
  onPageChange,
  loading = false,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Products
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {pagination.totalCount} total products
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Package className="h-6 w-6 text-zinc-400" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No products found
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Package className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                        {product.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        ID: {(product.shopifyProductId || product.id || "—").slice(-8)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.productType ? (
                    <Badge variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {product.productType}
                    </Badge>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500 text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {product.vendor || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {product.price !== null ? (
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(product.price, "INR")}
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">
                  {formatDate(product.createdAt)}
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
