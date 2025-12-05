"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTenant, createTenant, triggerSync, getSyncStatus, Tenant, CreateTenantInput, SyncResult, SyncStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Store, Globe, Calendar, Key, Loader2, Plus, Check, RefreshCw, Package, Users, ShoppingCart } from "lucide-react";

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.tenantId as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  // New tenant form state
  const [showNewTenantForm, setShowNewTenantForm] = useState(false);
  const [newTenantData, setNewTenantData] = useState<CreateTenantInput>({
    name: "",
    shopDomain: "",
    webhookSecret: "",
    accessToken: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    async function fetchTenant() {
      try {
        setLoading(true);
        const [tenantData, statusData] = await Promise.all([
          getTenant(tenantId),
          getSyncStatus(tenantId).catch(() => null),
        ]);
        setTenant(tenantData);
        if (statusData) setSyncStatus(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tenant");
      } finally {
        setLoading(false);
      }
    }

    if (tenantId && tenantId !== "new") {
      fetchTenant();
    } else {
      setShowNewTenantForm(true);
      setLoading(false);
    }
  }, [tenantId]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);

    try {
      const result = await triggerSync(tenantId);
      setSyncResult(result);
      // Refresh sync status after successful sync
      const statusData = await getSyncStatus(tenantId).catch(() => null);
      if (statusData) setSyncStatus(statusData);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);

    try {
      const newTenant = await createTenant(newTenantData);
      setCreateSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/${newTenant.id}`);
      }, 1500);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create tenant"
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Error loading settings
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
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {showNewTenantForm ? "Add a new store" : `Manage settings for ${tenant?.name}`}
        </p>
      </div>

      {/* Current Store Info */}
      {tenant && !showNewTenantForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Store Information
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Store className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Store Name
                </p>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {tenant.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Globe className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Shop Domain
                </p>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {tenant.shopDomain}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Created
                </p>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {formatDate(tenant.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Key className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Tenant ID
                </p>
                <p className="text-sm font-mono text-zinc-900 dark:text-zinc-50">
                  {tenant.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Data Section */}
      {tenant && !showNewTenantForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Sync Data
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Sync products, customers, and orders from your Shopify store
            </p>
          </div>
          <div className="p-6 space-y-6">
            {/* Current Data Counts */}
            {syncStatus && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{syncStatus.counts.products}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{syncStatus.counts.customers}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Customers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{syncStatus.counts.orders}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Orders</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Button and Result */}
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="w-fit gap-2"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>

              {/* Success Message */}
              {syncResult && syncResult.success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Sync completed successfully!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Dashboard data updated with latest data
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {syncError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {syncError}
                  </p>
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Data is automatically synced every 6 hours. Use this button to manually refresh data from Shopify.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add New Store Button */}
      {tenant && !showNewTenantForm && (
        <div className="flex justify-end">
          <Button onClick={() => setShowNewTenantForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Another Store
          </Button>
        </div>
      )}

      {/* New Store Form */}
      {showNewTenantForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Add New Store
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Connect a Shopify store to start tracking analytics.
            </p>
          </div>

          {createSuccess ? (
            <div className="p-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Store created successfully!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateTenant} className="p-6 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Store Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Store"
                  value={newTenantData.name}
                  onChange={(e) =>
                    setNewTenantData({ ...newTenantData, name: e.target.value })
                  }
                  required
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="shopDomain"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Shop Domain
                </label>
                <Input
                  id="shopDomain"
                  type="text"
                  placeholder="my-store.myshopify.com"
                  value={newTenantData.shopDomain}
                  onChange={(e) =>
                    setNewTenantData({
                      ...newTenantData,
                      shopDomain: e.target.value,
                    })
                  }
                  required
                  disabled={creating}
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Enter your Shopify store domain (e.g., store.myshopify.com)
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="webhookSecret"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Webhook Secret
                </label>
                <Input
                  id="webhookSecret"
                  type="password"
                  placeholder="Your Shopify webhook secret"
                  value={newTenantData.webhookSecret}
                  onChange={(e) =>
                    setNewTenantData({
                      ...newTenantData,
                      webhookSecret: e.target.value,
                    })
                  }
                  required
                  disabled={creating}
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Find this in your Shopify admin under Settings &gt; Notifications
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accessToken"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Access Token (Optional)
                </label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Shopify API access token"
                  value={newTenantData.accessToken || ""}
                  onChange={(e) =>
                    setNewTenantData({
                      ...newTenantData,
                      accessToken: e.target.value,
                    })
                  }
                  disabled={creating}
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Optional: Used for additional API access
                </p>
              </div>

              {createError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {createError}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                {tenant && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTenantForm(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={creating} className="gap-2">
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Store
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
