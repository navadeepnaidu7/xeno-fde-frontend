"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueData {
  date: string;
  orders: number;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
}

export default function RevenueChart({ data, loading = false }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="h-[300px] bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
        Revenue Trend
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e4e4e7"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#18181b"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
