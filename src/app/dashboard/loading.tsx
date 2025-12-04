"use client";

import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLoading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex items-center justify-center"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center shadow-xl">
                        <BarChart3 className="h-8 w-8 text-white dark:text-zinc-900" />
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-zinc-900/50 dark:border-zinc-50/50"
                        animate={{
                            scale: [1, 1.4, 1.4],
                            opacity: [0.5, 0, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center gap-2"
                >
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                        Loading
                    </p>
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
