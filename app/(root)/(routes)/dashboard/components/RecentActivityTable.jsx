"use client";

import { motion } from "framer-motion";
import { FileText, UserPlus, CreditCard, Clock } from "lucide-react";

const activities = [
    {
        id: 1,
        user: "Alice Johnson",
        action: "New User Signup",
        type: "signup",
        time: "2 mins ago",
        amount: null,
    },
    {
        id: 2,
        user: "Bob Smith",
        action: "Uploaded 'Physics Notes'",
        type: "upload",
        time: "15 mins ago",
        amount: null,
    },
    {
        id: 3,
        user: "Charlie Brown",
        action: "Purchased PRO Plan",
        type: "purchase",
        time: "1 hour ago",
        amount: "$9.99",
    },
    {
        id: 4,
        user: "David Lee",
        action: "New User Signup",
        type: "signup",
        time: "2 hours ago",
        amount: null,
    },
    {
        id: 5,
        user: "Eva Green",
        action: "Uploaded 'Math Assignment'",
        type: "upload",
        time: "3 hours ago",
        amount: null,
    },
];

const getIcon = (type) => {
    switch (type) {
        case "signup":
            return <UserPlus className="w-5 h-5 text-blue-500" />;
        case "upload":
            return <FileText className="w-5 h-5 text-orange-500" />;
        case "purchase":
            return <CreditCard className="w-5 h-5 text-green-500" />;
        default:
            return <Clock className="w-5 h-5 text-gray-500" />;
    }
};

const getBadge = (type) => {
    switch (type) {
        case "signup":
            return "badge-info badge-outline";
        case "upload":
            return "badge-warning badge-outline";
        case "purchase":
            return "badge-success badge-outline";
        default:
            return "badge-ghost";
    }
};

export default function RecentActivityTable() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-base-100/50 backdrop-blur-md rounded-2xl border border-base-200 shadow-lg overflow-hidden"
        >
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <button className="btn btn-xs btn-ghost">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Date</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity) => (
                            <tr key={activity.id} className="hover:bg-base-200/30 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8 flex items-center justify-center bg-base-300">
                                                <span className="text-xs">{activity.user[0]}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{activity.user}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-base-200">
                                            {getIcon(activity.type)}
                                        </div>
                                        <span className="font-medium text-sm">{activity.action}</span>
                                    </div>
                                </td>
                                <td className="text-sm text-base-content/60">{activity.time}</td>
                                <td>
                                    <span className={`badge ${getBadge(activity.type)}`}>
                                        {activity.type.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
