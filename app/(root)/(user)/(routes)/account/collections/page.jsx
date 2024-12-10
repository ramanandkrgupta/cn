"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Folder, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function Collections() {
  const { data: session } = useSession();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/v1/members/collections");
      if (!response.ok) throw new Error("Failed to fetch collections");
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    // Add collection creation logic
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Collections</h1>
        <button
          onClick={createCollection}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} className="mr-2" />
          New Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-base-200 p-4 rounded-lg"
          >
            {/* Collection card content */}
          </div>
        ))}
      </div>
    </div>
  );
} 