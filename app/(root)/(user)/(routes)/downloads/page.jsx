"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/cards/PostCard";

// Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-6 bg-base-300 rounded"></div>
      <div className="h-8 w-48 bg-base-300 rounded"></div>
    </div>

    {/* Grid Skeleton */}
    <div className="grid md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg p-4">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-base-content/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-base-content/10 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-base-content/10 rounded w-1/2"></div>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-2">
            <div className="h-3 bg-base-content/10 rounded w-full"></div>
            <div className="h-3 bg-base-content/10 rounded w-5/6"></div>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between mt-4">
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Downloads() {
  const { data: session } = useSession();
  const router = useRouter();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/v1members/users/downloads");
          if (!response.ok) {
            throw new Error("Failed to fetch downloads");
          }
          const data = await response.json();
          setDownloads(data);
        } catch (error) {
          console.error("Error fetching downloads:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDownloads();
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm p-0"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold">Your Downloads</h1>
      </div>

      {downloads.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <Download className="w-12 h-12 mx-auto mb-4 text-base-content/60" />
          <p className="text-base-content/60">No downloads yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {downloads.map((download) => (
            <PostCard
              key={download.id}
              data={download.post}
              className="h-full" // Make cards equal height
            />
          ))}
        </div>
      )}
    </div>
  );
}
