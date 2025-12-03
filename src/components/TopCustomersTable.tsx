import { formatCurrency, getInitials } from "@/lib/utils";

interface TopCustomer {
  customerId: string;
  email: string;
  name: string | null;
  totalSpent: number;
  ordersCount: number;
}

interface TopCustomersTableProps {
  customers: TopCustomer[];
  loading?: boolean;
}

export default function TopCustomersTable({
  customers,
  loading = false,
}: TopCustomersTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
        Top Customers
      </h2>
      <div className="space-y-4">
        {customers.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            No customers yet
          </p>
        ) : (
          customers.map((customer, index) => (
            <div
              key={customer.customerId}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-sm font-semibold text-white dark:text-zinc-900">
                  {getInitials(customer.name || customer.email)}
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-zinc-50 border-2 border-white dark:border-zinc-900">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                  {customer.name || "Unnamed Customer"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {customer.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(customer.totalSpent)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {customer.ordersCount} order{customer.ordersCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
