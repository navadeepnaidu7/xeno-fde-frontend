import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white dark:text-zinc-900" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Xeno
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Now supporting multi-tenant analytics
            </div>

            <h1 className="display-xl text-zinc-900 dark:text-zinc-50 mb-6">
              Store Analytics
              <br />
              <span className="gradient-text">Made Simple</span>
            </h1>

            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The modern dashboard for Shopify stores. Track revenue, understand
              your customers, and grow your business with actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signin">
                <Button size="xl" className="gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="xl">
                  See Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Total Revenue", value: "$124,563.00", change: "+12.5%" },
                    { label: "Total Customers", value: "2,451", change: "+8.2%" },
                    { label: "Total Orders", value: "4,891", change: "+15.3%" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-end px-8 pb-4 gap-2">
                  {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-zinc-900 dark:bg-zinc-50 rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="display-md text-zinc-900 dark:text-zinc-50 mb-4">
              Everything you need to grow
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful features designed to help you understand your store performance
              and make data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Revenue Analytics",
                description:
                  "Track your revenue trends over time with beautiful charts and actionable insights.",
              },
              {
                icon: Users,
                title: "Customer Insights",
                description:
                  "Understand your top customers, their spending patterns, and lifetime value.",
              },
              {
                icon: ShoppingCart,
                title: "Order Management",
                description:
                  "View and filter all your orders with powerful search and pagination.",
              },
              {
                icon: TrendingUp,
                title: "Growth Metrics",
                description:
                  "Monitor key performance indicators and track your growth over time.",
              },
              {
                icon: Shield,
                title: "Multi-Tenant Security",
                description:
                  "Securely manage multiple stores with complete data isolation.",
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description:
                  "Get instant updates as new orders come in through Shopify webhooks.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-lg cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                  <feature.icon className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display-md text-zinc-900 dark:text-zinc-50 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Connect your Shopify store and start tracking your metrics in minutes.
          </p>
          <Link href="/auth/signin">
            <Button size="xl" className="gap-2">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Xeno
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Built for the Xeno FDE Assignment 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
