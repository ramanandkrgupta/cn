"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Dummy sparkline data generator
const generateSparkData = () =>
    Array.from({ length: 20 }, (_, i) => ({ value: Math.random() * 100 + 50 }));

export default function DashboardStatCard({
    title,
    value,
    icon: Icon, // Icon is kept for flexible usage but de-emphasized or removed in this specific design
    trend,
    trendValue,
    color = "primary",
    description,
    subValue,
}) {
    const data = generateSparkData();
    const isPositive = trend === "up";
    const trendColor = isPositive ? "text-success" : trend === "down" ? "text-error" : "text-base-content/50";

    return (
        <div className="bg-base-100 border border-base-200 rounded-lg p-4 h-32 flex flex-col justify-between hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-base-content/50 mb-1">
                        {title}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold font-sans tracking-tight">
                            {value}
                        </div>
                        {subValue && (
                            <div className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {subValue}
                            </div>
                        )}
                    </div>
                </div>
                {/* Compact Trend Indicator */}
                <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                    {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    <span>{trendValue}%</span>
                </div>
            </div>

            {/* Sparkline Config */}
            <div className="h-10 w-full mt-2 -ml-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "hsl(var(--su))" : "hsl(var(--er))"}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
