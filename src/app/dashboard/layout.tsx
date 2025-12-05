"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTenants, Tenant } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  Store,
  Plus,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract tenantId from path
  const pathParts = pathname.split("/");
  const tenantIdFromPath = pathParts[2] || null;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchTenants() {
      try {
        const data = await getTenants();
        setTenants(data);

        // Set selected tenant from path or first tenant
        if (tenantIdFromPath) {
          const tenant = data.find((t) => t.id === tenantIdFromPath);
          if (tenant) {
            setSelectedTenant(tenant);
          } else if (data.length > 0) {
            setSelectedTenant(data[0]);
            router.push(`/dashboard/${data[0].id}`);
          }
        } else if (data.length > 0) {
          setSelectedTenant(data[0]);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch tenants:", error.message);
        } else {
          console.error("Failed to fetch tenants:", error);
        }
      } finally {
        setTenantsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchTenants();
    }
  }, [status, tenantIdFromPath, router]);

  const handleTenantChange = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowTenantDropdown(false);
    // Navigate to the same sub-page for the new tenant
    const currentSubPath = pathParts.slice(3).join("/");
    router.push(`/dashboard/${tenant.id}${currentSubPath ? `/${currentSubPath}` : ""}`);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  if (status === "loading" || tenantsLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center animate-pulse">
            <BarChart3 className="h-7 w-7 text-white dark:text-zinc-900" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: selectedTenant ? `/dashboard/${selectedTenant.id}` : "/dashboard",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      href: selectedTenant ? `/dashboard/${selectedTenant.id}/orders` : "/dashboard",
    },
    {
      icon: Users,
      label: "Customers",
      href: selectedTenant ? `/dashboard/${selectedTenant.id}/customers` : "/dashboard",
    },
    {
      icon: Package,
      label: "Products",
      href: selectedTenant ? `/dashboard/${selectedTenant.id}/products` : "/dashboard",
    },
    {
      icon: Settings,
      label: "Settings",
      href: selectedTenant ? `/dashboard/${selectedTenant.id}/settings` : "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white dark:text-zinc-900" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">Xeno</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-16 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transform transition-transform duration-200 ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.label !== "Dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-lg"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${!isActive ? "group-hover:scale-110" : ""
                  }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 w-full cursor-pointer transition-all duration-300 group border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-300" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white dark:text-zinc-900" />
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Xeno
          </span>
        </div>

        {/* Tenant Selector */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <button
              onClick={() => setShowTenantDropdown(!showTenantDropdown)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 transition-all duration-200 cursor-pointer group hover:shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {selectedTenant?.name || "Select store"}
                </span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${showTenantDropdown ? "rotate-180" : "group-hover:translate-y-0.5"
                  }`}
              />
            </button>

            {showTenantDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 z-50 overflow-hidden backdrop-blur-sm">
                <div className="max-h-48 overflow-y-auto p-2">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => handleTenantChange(tenant)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 cursor-pointer ${selectedTenant?.id === tenant.id
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${selectedTenant?.id === tenant.id
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                        : "bg-zinc-200 dark:bg-zinc-700"
                        }`}>
                        <Store className={`h-4 w-4 ${selectedTenant?.id === tenant.id ? "text-white" : "text-zinc-600 dark:text-zinc-400"
                          }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                          {tenant.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {tenant.shopDomain}
                        </p>
                      </div>
                      {selectedTenant?.id === tenant.id && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
                <Link
                  href={selectedTenant ? `/dashboard/${selectedTenant.id}/settings` : "/dashboard"}
                  onClick={() => setShowTenantDropdown(false)}
                  className="flex items-center gap-3 px-4 py-3 border-t-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-all duration-200 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors duration-200">
                    <Plus className="h-4 w-4 text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200" />
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    Add new store
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.label !== "Dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-400/20"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${!isActive ? "group-hover:scale-110" : ""
                  }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-sm font-semibold text-white dark:text-zinc-900">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 mt-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 cursor-pointer transition-all duration-300 group border border-red-100 dark:border-red-900/30 text-sm font-medium"
          >
            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
