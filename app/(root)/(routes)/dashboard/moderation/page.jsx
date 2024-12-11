"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FileText,
  Download,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react";

export default function ModerationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchPendingPosts();
  }, [session, status, router]);

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/admin/moderation?status=pending");
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load pending posts");
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (postId, action) => {
    try {
      let note = "";
      if (action === "reject") {
        note = prompt("Please provide a reason for rejection:");
        if (!note) return; // Cancel if no reason provided
      }

      const response = await fetch("/api/v1/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action, note }),
      });

      if (!response.ok) throw new Error("Failed to moderate post");

      toast.success(`Post ${action}ed successfully`);
      fetchPendingPosts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to moderate post");
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Content Moderation
          </h1>
          <p className="text-gray-500">Review and moderate pending content</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No pending posts to moderate</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-base-200 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    By {post.user?.name || post.user?.email} •
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mb-4">{post.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-base-300 p-3 rounded">
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium">{post.course_name}</p>
                </div>
                <div className="bg-base-300 p-3 rounded">
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{post.subject_name}</p>
                </div>
                <div className="bg-base-300 p-3 rounded">
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-medium">{post.semester_code}</p>
                </div>
                <div className="bg-base-300 p-3 rounded">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{post.category}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <a
                  href={post.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </a>
                <button
                  onClick={() => handleModeration(post.id, "approve")}
                  className="btn btn-success btn-sm gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleModeration(post.id, "reject")}
                  className="btn btn-error btn-sm gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
