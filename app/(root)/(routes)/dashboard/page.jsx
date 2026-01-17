"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, FileText, BookOpen, Download } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Components
import DashboardStatCard from "./components/DashboardStatCard";
import DownloadsTrendChart from "./components/DownloadsTrendChart";
import UserGrowthChart from "./components/UserGrowthChart";
import RecentActivityTable from "./components/RecentActivityTable";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, premium: 0, trend: 0 },
    documents: { total: 0, premium: 0, trend: 0 },
    subjects: { total: 0, trend: 0 },
    engagement: { downloads: 0, likes: 0, shares: 0, trend: 0 },
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchDashboardStats();
  }, [session, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/admin/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Section */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Good Morning, {session?.user?.name}
          </h1>
          <p className="text-base-content/60 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm">Generate Report</button>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          title="Total Users"
          value={stats.users.total.toLocaleString()}
          subValue={`${stats.users.premium} PRO`}
          icon={Users}
          color="primary"
          trend="up"
          trendValue={stats.users.trend}
          description="Total registered users"
        />
        <DashboardStatCard
          title="Documents"
          value={stats.documents.total.toLocaleString()}
          icon={FileText}
          color="secondary"
          trend="up"
          trendValue={stats.documents.trend}
          description="Notes & papers"
        />
        <DashboardStatCard
          title="Subjects"
          value={stats.subjects.total.toLocaleString()}
          icon={BookOpen}
          color="accent"
          trend="neutral"
          trendValue={0}
          description="Active subjects"
        />
        <DashboardStatCard
          title="Downloads"
          value={stats.engagement.downloads.toLocaleString()}
          icon={Download}
          color="info"
          trend="down"
          trendValue={Math.abs(stats.engagement.trend)}
          description="Total downloads"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DownloadsTrendChart />
        <UserGrowthChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentActivityTable />
        </div>

        {/* Simple Quick Actions Panel */}
        <div className="bg-base-100/50 backdrop-blur-md rounded-2xl p-6 border border-base-200 shadow-lg flex flex-col gap-4">
          <h3 className="text-lg font-bold mb-2">Quick Actions</h3>

          <button onClick={() => router.push('/dashboard/users')} className="btn btn-outline justify-start gap-3 h-auto py-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">Manage Users</div>
              <div className="text-xs opacity-60">View and edit users</div>
            </div>
          </button>

          <button onClick={() => router.push('/dashboard/posts')} className="btn btn-outline justify-start gap-3 h-auto py-3">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">Review Posts</div>
              <div className="text-xs opacity-60">Approve or reject content</div>
            </div>
          </button>

          <button onClick={() => router.push('/dashboard/settings')} className="btn btn-outline justify-start gap-3 h-auto py-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              {/* Using BookOpen as generic setting icon placeholder or change to Settings */}
              <BookOpen size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold">System Settings</div>
              <div className="text-xs opacity-60">Configure global preferences</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

