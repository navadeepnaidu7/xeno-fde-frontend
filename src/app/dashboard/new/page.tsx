"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTenant, CreateTenantInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Plus, Check } from "lucide-react";

export default function NewTenantPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateTenantInput>({
    name: "",
    shopDomain: "",
    webhookSecret: "",
    accessToken: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const newTenant = await createTenant(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/${newTenant.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to stores
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Add a new store
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Connect your Shopify store to start tracking analytics.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {success ? (
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Store created successfully!
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Store Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="My Awesome Store"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={creating}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="shopDomain"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Shop Domain *
              </label>
              <Input
                id="shopDomain"
                type="text"
                placeholder="my-store.myshopify.com"
                value={formData.shopDomain}
                onChange={(e) =>
                  setFormData({ ...formData, shopDomain: e.target.value })
                }
                required
                disabled={creating}
                className="h-12"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your Shopify store URL (e.g., store-name.myshopify.com)
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="webhookSecret"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Webhook Secret *
              </label>
              <Input
                id="webhookSecret"
                type="password"
                placeholder="shpss_xxxxxxxxxxxxx"
                value={formData.webhookSecret}
                onChange={(e) =>
                  setFormData({ ...formData, webhookSecret: e.target.value })
                }
                required
                disabled={creating}
                className="h-12"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Find this in Shopify Admin: Settings &rarr; Notifications &rarr;
                Webhooks
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="accessToken"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Access Token{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  (optional)
                </span>
              </label>
              <Input
                id="accessToken"
                type="password"
                placeholder="shpat_xxxxxxxxxxxxx"
                value={formData.accessToken || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accessToken: e.target.value })
                }
                disabled={creating}
                className="h-12"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Optional: Enable additional Shopify API features
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={creating}
                className="w-full gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating store...
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
    </div>
  );
}
