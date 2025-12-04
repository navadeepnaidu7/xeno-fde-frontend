"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Product } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface TopProductsChartProps {
    products: Product[];
    loading?: boolean;
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function TopProductsChart({
    products,
    loading = false,
}: TopProductsChartProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col">
                <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />
                <div className="flex-1 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Get top 5 products by price (as proxy for value)
    const topProducts = [...products]
        .filter((p) => p.price !== null && p.price > 0)
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 5)
        .map((product) => ({
            name: product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title,
            fullName: product.title,
            price: product.price || 0,
            vendor: product.vendor || "Unknown",
        }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col shadow-sm"
        >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Top Products by Price
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Highest value products in catalog
            </p>

            {topProducts.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                    No product data available
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topProducts}
                            layout="vertical"
                            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                        >
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#71717a", fontSize: 12 }}
                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#71717a", fontSize: 12 }}
                                width={100}
                            />
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
                                formatter={(value: number) => [formatCurrency(value), "Price"]}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload[0]) {
                                        return payload[0].payload.fullName;
                                    }
                                    return label;
                                }}
                            />
                            <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={28}>
                                {topProducts.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </motion.div>
    );
}
