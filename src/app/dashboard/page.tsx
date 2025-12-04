"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTenants, Tenant } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Store, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTenants() {
      try {
        const data = await getTenants();
        setTenants(data);
        // If there's only one tenant, redirect to it
        if (data.length === 1) {
          router.push(`/dashboard/${data[0].id}`);
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
            <Store className="h-8 w-8 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            No stores connected
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Connect your first Shopify store to start tracking analytics.
          </p>
          <Link href="/dashboard/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Add your first store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Select a store
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Choose a store to view its analytics dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <Link
            key={tenant.id}
            href={`/dashboard/${tenant.id}`}
            className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Store className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              {tenant.name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
              {tenant.shopDomain}
            </p>
          </Link>
        ))}

        <Link
          href="/dashboard/new"
          className="group p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 flex flex-col items-center justify-center text-center min-h-[160px] cursor-pointer"
        >
          <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700 transition-colors">
            <Plus className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Add another store
          </p>
        </Link>
      </div>
    </div>
  );
}
