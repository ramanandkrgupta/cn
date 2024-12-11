"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User2, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function UserDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchUserDetails();
  }, [session, params.id]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/v1/admin/users/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      toast.error("Error fetching user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button onClick={() => router.back()} className="btn btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-base-200 p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl">
                  {user?.name?.[0] || user?.email[0]}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name || "N/A"}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Role</span>
              <span className="badge badge-primary">{user?.userRole}</span>
            </div>
            <div className="flex justify-between">
              <span>Joined</span>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">Total Posts</span>
              </div>
              <p className="text-2xl font-bold">{user?._count?.posts || 0}</p>
            </div>

            <div className="bg-base-200 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-secondary" />
                <span className="font-medium">Total Downloads</span>
              </div>
              <p className="text-2xl font-bold">
                {user?._count?.downloads || 0}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {/* Add recent activity list here */}
          </div>
        </div>
      </div>
    </div>
  );
}
