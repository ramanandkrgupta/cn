"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    defs,
    linearGradient,
    stop
} from "recharts";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const data = [
    { name: "Jan", downloads: 400 },
    { name: "Feb", downloads: 300 },
    { name: "Mar", downloads: 200 },
    { name: "Apr", downloads: 278 },
    { name: "May", downloads: 189 },
    { name: "Jun", downloads: 239 },
    { name: "Jul", downloads: 349 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-base-100 p-3 rounded-lg shadow-xl border border-base-200 text-sm">
                <p className="font-bold mb-1">{label}</p>
                <p className="text-primary">
                    Downloads: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export default function DownloadsTrendChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-base-100/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-base-200 shadow-lg h-[300px] md:h-[400px]"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Download className="w-5 h-5 text-primary" />
                        Download Trends
                    </h3>
                    <p className="text-sm text-base-content/60">Monthly content engagement</p>
                </div>
                <select className="select select-sm select-bordered rounded-full bg-base-200/50">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--p))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--p))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--bc) / 0.1)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--bc) / 0.6)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--bc) / 0.6)', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--bc) / 0.05)' }} />
                    <Bar
                        dataKey="downloads"
                        fill="hsl(var(--p))"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
