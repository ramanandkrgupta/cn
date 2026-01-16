"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const data = [
    { name: "Mon", users: 10 },
    { name: "Tue", users: 15 },
    { name: "Wed", users: 12 },
    { name: "Thu", users: 25 },
    { name: "Fri", users: 30 },
    { name: "Sat", users: 45 },
    { name: "Sun", users: 50 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-base-100 p-3 rounded-lg shadow-xl border border-base-200 text-sm">
                <p className="font-bold mb-1">{label}</p>
                <p className="text-secondary">
                    New Users: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export default function UserGrowthChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-base-100/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-base-200 shadow-lg h-[300px] md:h-[400px]"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary" />
                        User Growth
                    </h3>
                    <p className="text-sm text-base-content/60">New registrations this week</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 0,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--s))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--s))" stopOpacity={0} />
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
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--bc) / 0.2)' }} />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="hsl(var(--s))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
