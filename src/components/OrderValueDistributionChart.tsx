"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Order } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface OrderValueDistributionChartProps {
    orders: Order[];
    loading?: boolean;
}

const VALUE_RANGES = [
    { name: "₹0 - ₹500", min: 0, max: 500, color: "#8b5cf6" },
    { name: "₹500 - ₹1K", min: 500, max: 1000, color: "#06b6d4" },
    { name: "₹1K - ₹2.5K", min: 1000, max: 2500, color: "#10b981" },
    { name: "₹2.5K+", min: 2500, max: Infinity, color: "#f59e0b" },
];

export default function OrderValueDistributionChart({
    orders,
    loading = false,
}: OrderValueDistributionChartProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col">
                <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
                </div>
            </div>
        );
    }

    // Compute distribution
    const distribution = VALUE_RANGES.map((range) => {
        const count = orders.filter(
            (order) => order.total >= range.min && order.total < range.max
        ).length;
        return {
            name: range.name,
            value: count,
            color: range.color,
        };
    }).filter((item) => item.value > 0);

    const total = orders.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col shadow-sm"
        >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Order Value Distribution
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Breakdown of {total} orders by value range
            </p>

            {distribution.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                    No order data available
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(24, 24, 27, 0.95)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                                }}
                                itemStyle={{
                                    color: "#ffffff",
                                    fontSize: "13px",
                                    fontWeight: 500
                                }}
                                labelStyle={{
                                    color: "#ffffff",
                                    marginBottom: "4px",
                                    fontSize: "14px",
                                    fontWeight: 600
                                }}
                                formatter={(value: number, name: string) => [
                                    `${value} orders (${((value / total) * 100).toFixed(1)}%)`,
                                    name,
                                ]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value: string) => (
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
}
