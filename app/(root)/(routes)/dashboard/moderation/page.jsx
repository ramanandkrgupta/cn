"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ModerationPage() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    const response = await fetch('/api/admin/moderation');
    const data = await response.json();
    setPendingPosts(data.posts);
  };

  const handleModeration = async (postId, action, note) => {
    try {
      const response = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, note })
      });

      if (response.ok) {
        toast.success(`Post ${action}`);
        fetchPendingPosts();
      }
    } catch (error) {
      toast.error("Error moderating post");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>
      <div className="grid gap-6">
        {pendingPosts.map(post => (
          <div key={post.id} className="bg-base-200 p-4 rounded-lg">
            {/* Post details and moderation buttons */}
          </div>
        ))}
      </div>
    </div>
  );
} 