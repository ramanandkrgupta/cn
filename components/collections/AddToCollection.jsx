"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AddToCollection({ postId, onClose }) {
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

  const addToCollection = async (collectionId) => {
    try {
      const response = await fetch("/api/v1/members/collections/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId, postId }),
      });

      if (!response.ok) throw new Error("Failed to add to collection");

      toast.success("Added to collection!");
      onClose();
    } catch (error) {
      toast.error("Failed to add to collection");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-200 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add to Collection</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : collections.length === 0 ? (
          <p className="text-center py-4">
            No collections found. Create one first!
          </p>
        ) : (
          <div className="space-y-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => addToCollection(collection.id)}
                className="w-full flex items-center justify-between p-3 bg-base-300 hover:bg-base-100 rounded-lg transition-colors"
              >
                <div>
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="text-sm text-gray-500">
                    {collection._count.posts} items
                  </p>
                </div>
                <Plus size={20} className="text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
