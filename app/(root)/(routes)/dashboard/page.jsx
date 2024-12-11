"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  BookOpen,
  Download,
  Upload,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  Crown,
  Heart,
  Share2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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

  const StatCard = ({
    title,
    value,
    trend,
    icon: Icon,
    color,
    subValue,
    subLabel,
  }) => (
    <div className="bg-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold">{value.toLocaleString()}</h3>
        <p className="text-gray-500">{title}</p>
        {subValue !== undefined && (
          <p className="text-sm mt-2">
            <span className="font-medium">{subValue.toLocaleString()}</span>{" "}
            <span className="text-gray-500">{subLabel}</span>
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          trend={stats.users.trend}
          icon={Users}
          color="bg-blue-500"
          subValue={stats.users.premium}
          subLabel="premium users"
        />
        <StatCard
          title="Total Documents"
          value={stats.documents.total}
          trend={stats.documents.trend}
          icon={FileText}
          color="bg-green-500"
          subValue={stats.documents.premium}
          subLabel="premium content"
        />
        <StatCard
          title="Total Subjects"
          value={stats.subjects.total}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Engagement"
          value={stats.engagement.downloads}
          trend={stats.engagement.trend}
          icon={Download}
          color="bg-yellow-500"
          subValue={stats.engagement.likes + stats.engagement.shares}
          subLabel="interactions"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/dashboard/users"
          className="bg-base-200 p-6 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold">Manage Users</h3>
          </div>
          <p className="text-sm text-gray-500">View and manage user accounts</p>
        </Link>

        <Link
          href="/dashboard/posts"
          className="bg-base-200 p-6 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5" />
            <h3 className="font-semibold">Manage Documents</h3>
          </div>
          <p className="text-sm text-gray-500">
            View and manage uploaded content
          </p>
        </Link>

        <Link
          href="/dashboard/subjects"
          className="bg-base-200 p-6 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold">Manage Subjects</h3>
          </div>
          <p className="text-sm text-gray-500">
            View and manage course subjects
          </p>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-base-200 p-6 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold">Settings</h3>
          </div>
          <p className="text-sm text-gray-500">Configure dashboard settings</p>
        </Link>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-5 h-5" />
            <h3 className="font-semibold">Downloads</h3>
          </div>
          <p className="text-3xl font-bold mb-2">
            {stats.engagement.downloads.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total document downloads</p>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5" />
            <h3 className="font-semibold">Likes</h3>
          </div>
          <p className="text-3xl font-bold mb-2">
            {stats.engagement.likes.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total document likes</p>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-5 h-5" />
            <h3 className="font-semibold">Shares</h3>
          </div>
          <p className="text-3xl font-bold mb-2">
            {stats.engagement.shares.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total document shares</p>
        </div>
      </div>
    </div>
  );
}
