"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, Trash2, Edit, ArrowLeft } from "lucide-react";
import PostCard from "@/components/cards/PostCard";

export default function UserUploads() {
  const router = useRouter();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserUploads();
  }, []);

  const fetchUserUploads = async () => {
    try {
      const response = await fetch("/api/v1/members/users/uploads");
      if (response.ok) {
        const data = await response.json();
        setUploads(data);
      } else {
        throw new Error("Failed to fetch uploads");
      }
    } catch (error) {
      console.error("Error fetching uploads:", error);
      toast.error("Failed to load uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/v1/members/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUploads((prev) => prev.filter((upload) => upload.id !== postId));
        toast.success("Post deleted successfully");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-6">
          {/* Back Button */}
          <button onClick={() => router.back()} aria-label="Go Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Your Uploads</h1>
        </div>
        <button
          onClick={() => router.push("/upload")}
          className="btn btn-primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          New Upload
        </button>
      </div>

      {uploads.length === 0 ? (
        <div className="text-center py-8">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No uploads yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {uploads.map((post) => (
            <div key={post.id} className="relative">
              <PostCard data={post} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => router.push(`/edit/${post.id}`)}
                  className="btn btn-circle btn-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="btn btn-circle btn-sm btn-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
