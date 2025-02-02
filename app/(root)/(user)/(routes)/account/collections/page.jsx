"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  Folder,
  Share2,
  Edit,
  Trash,
  Lock,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Collections() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  useEffect(() => {
    if (session?.user?.role !== "PRO") {
      router.push("/account/plans");
      toast.error("Collections are a PRO feature");
      return;
    }
    fetchCollections();
  }, [session, router]);

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

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/members/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create collection");

      const newCollection = await response.json();
      setCollections((prev) => [newCollection, ...prev]);
      setShowCreateModal(false);
      setFormData({ name: "", description: "", isPublic: false });
      toast.success("Collection created successfully!");
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  const handleEditCollection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/members/collections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCollection.id,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update collection");

      const updatedCollection = await response.json();
      setCollections((prev) =>
        prev.map((c) => (c.id === editingCollection.id ? updatedCollection : c))
      );
      setShowEditModal(false);
      setEditingCollection(null);
      toast.success("Collection updated successfully!");
    } catch (error) {
      toast.error("Failed to update collection");
    }
  };

  const handleDelete = async (collectionId) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      const response = await fetch(`/api/v1/members/collections`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: collectionId }),
      });

      if (!response.ok) throw new Error("Failed to delete collection");

      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
      toast.success("Collection deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  const handleShare = async (collectionId) => {
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;

    try {
      await navigator.share({
        title: collection.name,
        text: collection.description,
        url: `${window.location.origin}/collections/${collectionId}`,
      });

      toast.success("Collection shared successfully!");
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share collection");
      }
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
    });
    setShowEditModal(true);
  };

  const toggleExpand = (collectionId) => {
    setExpandedCollection(
      expandedCollection === collectionId ? null : collectionId
    );
  };

  const removeFromCollection = async (collectionId, postId) => {
    try {
      const response = await fetch("/api/v1/members/collections/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionId, postId }),
      });

      if (!response.ok) throw new Error("Failed to remove from collection");

      // Update local state
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === collectionId) {
            return {
              ...c,
              posts: c.posts.filter((p) => p.id !== postId),
              _count: { ...c._count, posts: c._count.posts - 1 },
            };
          }
          return c;
        })
      );

      toast.success("Removed from collection");
    } catch (error) {
      toast.error("Failed to remove from collection");
    }
  };

  if (loading) return <LoadingState message="Loading collections..." />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Collections</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} className="mr-2" />
          New Collection
        </button>
      </div>

      {/* Collections List */}
      <div className="space-y-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-base-200 rounded-lg overflow-hidden"
          >
            {/* Collection Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="text-sm text-gray-500">
                      {collection.description}
                    </p>
                  </div>
                </div>
                {collection.isPublic ? (
                  <Globe size={16} className="text-success" />
                ) : (
                  <Lock size={16} className="text-warning" />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <button
                  onClick={() => toggleExpand(collection.id)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <span>{collection._count.posts} items</span>
                  {expandedCollection === collection.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare(collection.id)}
                    className="btn btn-ghost btn-xs"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={() => handleEdit(collection)}
                    className="btn btn-ghost btn-xs"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Collection Posts */}
            {expandedCollection === collection.id && (
              <div className="border-t border-base-300">
                {collection.posts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No posts in this collection yet
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                    {collection.posts.map((post) => (
                      <div key={post.id} className="relative group">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden">
                          <Image
                            src={
                              post.thumbnail_url ||
                              "/images/placeholders/pdf-placeholder.png"
                            }
                            alt={post.title}
                            width={200}
                            height={267}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() =>
                              removeFromCollection(collection.id, post.id)
                            }
                            className="btn btn-sm btn-error"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="mt-2 text-sm font-medium line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              Create New Collection
            </h2>
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="textarea textarea-bordered w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="checkbox"
                />
                <label>Make this collection public</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Collection</h2>
            <form onSubmit={handleEditCollection} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="textarea textarea-bordered w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="checkbox"
                />
                <label>Make this collection public</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCollection(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
