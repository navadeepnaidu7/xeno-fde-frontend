import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface MetricsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

export default function MetricsCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
  loading = false,
}: MetricsCardProps) {
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="group p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
          {typeof change !== "undefined" && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend === "up" && "text-green-600 dark:text-green-500",
                trend === "down" && "text-red-600 dark:text-red-500",
                trend === "neutral" && "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {trend === "up" && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
              {trend === "down" && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
            <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </div>
        )}
      </div>
    </div>
  );
}
