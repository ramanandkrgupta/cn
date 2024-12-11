"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Folder, Lock, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import Image from "next/image";

export default function CollectionView() {
  const params = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollection();
  }, [params.id]);

  const fetchCollection = async () => {
    try {
      const response = await fetch(`/api/v1/public/collections/${params.id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch collection");
      }
      const data = await response.json();
      setCollection(data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading collection..." />;
  if (error) return <div className="text-center p-6 text-error">{error}</div>;
  if (!collection)
    return <div className="text-center p-6">Collection not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-base-200 rounded-lg overflow-hidden">
        {/* Collection Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Folder className="w-12 h-12 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{collection.name}</h1>
                <p className="text-gray-500 mt-1">{collection.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">
                    Created by {collection.user?.name || "Anonymous"}
                  </span>
                  {collection.isPublic ? (
                    <Globe size={16} className="text-success" />
                  ) : (
                    <Lock size={16} className="text-warning" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Posts */}
        <div className="border-t border-base-300 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Posts in Collection ({collection.posts.length})
          </h2>
          {collection.posts.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              No posts in this collection yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {collection.posts.map((post) => (
                <div key={post.id} className="group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={
                        post.thumbnail_url ||
                        "/images/placeholders/pdf-placeholder.png"
                      }
                      alt={post.title}
                      width={200}
                      height={267}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="mt-2 text-sm font-medium line-clamp-2">
                    {post.title}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
