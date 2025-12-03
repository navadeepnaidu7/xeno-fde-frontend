"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomers, Customer, Pagination, getTenant, Tenant } from "@/lib/api";
import CustomersTable from "@/components/CustomersTable";

export default function CustomersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCustomers(page: number) {
    try {
      setLoading(true);
      setError(null);

      const [tenantData, customersData] = await Promise.all([
        tenant ? Promise.resolve(tenant) : getTenant(tenantId),
        getCustomers(tenantId, page),
      ]);

      if (!tenant) {
        setTenant(tenantData);
      }
      setCustomers(customersData.customers);
      setPagination(customersData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tenantId) {
      fetchCustomers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handlePageChange = (newPage: number) => {
    fetchCustomers(newPage);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Error loading customers
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => fetchCustomers(1)}
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
          Customers
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          View customer data for {tenant?.name || "this store"}
        </p>
      </div>

      {/* Customers Table */}
      <CustomersTable
        customers={customers}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
