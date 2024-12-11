import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import {
  Download,
  Heart,
  Share2,
  Eye,
  Crown,
  Flame,
  Clock,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import PostViewDialogBox from "../models/PostViewDialogBox";
import AddToCollection from "../collections/AddToCollection";

const PostCard = ({ data, onUpdate }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for collection modal
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Function to determine placeholder image based on file type
  const getPlaceholderImage = () => {
    if (!data.file_name) return "/images/placeholders/default-placeholder.png";
    const extension = data.file_name.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "/images/placeholders/pdf-placeholder.png";
      case "doc":
      case "docx":
        return "/images/placeholders/doc-placeholder.png";
      default:
        return "/images/placeholders/default-placeholder.png";
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!session) {
      signIn();
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/post/${data.id}/like`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to like post");

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: data.title,
        text: data.description,
        url: window.location.href,
      });

      // Update share count
      const response = await fetch(`/api/post/${data.id}/share`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to update share count");

      const updatedPost = await response.json();
      onUpdate(updatedPost);
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!session) {
      signIn();
      return;
    }

    if (data.premium && session.user.role !== "PRO") {
      toast.error(
        "This is a premium document. Please upgrade to PRO to download."
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/post/${data.id}/download`);
      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Get updated post data
      const updateResponse = await fetch(`/api/post/${data.id}`);
      if (!updateResponse.ok)
        throw new Error("Failed to update download count");

      const updatedPost = await updateResponse.json();
      onUpdate(updatedPost);
    } catch (error) {
      toast.error("Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative group bg-base-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(true)}
    >
      {/* Thumbnail Section */}
      <div className="aspect-[3/4] relative overflow-hidden bg-neutral">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <Image
            src={data.thumbnail_url || getPlaceholderImage()}
            alt={data.title}
            width={300}
            height={400}
            className="transition-transform duration-300 group-hover:scale-105 object-cover"
            priority
          />
        </div>

        {/* Overlay Icons */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-2">
          {data.premium && (
            <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PRO
            </span>
          )}
          {Date.now() - new Date(data.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
            <span className="bg-accent/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              New
            </span>
          )}
        </div>

        {/* Title and Category */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-semibold text-sm line-clamp-2">{data.title}</h3>
          <p className="text-xs opacity-75 mt-1">{data.category}</p>
        </div>
      </div>

      {/* Updated Action Bar */}
      <div className="p-2 flex items-center justify-between bg-base-200">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCollectionModal(true);
            }}
            className="btn btn-ghost btn-xs"
            title="Add to Collection"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="btn btn-ghost btn-xs gap-1 hover:text-primary"
          >
            <Heart
              className={`w-4 h-4 ${
                data.isLiked ? "fill-primary text-primary" : ""
              }`}
            />
            <span className="text-xs">{data.likes}</span>
          </button>
          <button
            onClick={handleShare}
            disabled={isLoading}
            className="btn btn-ghost btn-xs gap-1 hover:text-accent"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs">{data.shares}</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <Download className="w-4 h-4" />
            {data.downloads}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={
            isLoading ||
            (data.premium && (!session?.user || session.user.role !== "PRO"))
          }
          className={`btn btn-xs ${
            isLoading
              ? "loading"
              : data.premium && (!session?.user || session.user.role !== "PRO")
              ? "btn-disabled"
              : "btn-primary"
          }`}
          title={
            data.premium && (!session?.user || session.user.role !== "PRO")
              ? "PRO members only"
              : `Download (${data.downloads})`
          }
        >
          {!isLoading && <Download className="w-4 h-4" />}
        </button>
      </div>

      {/* Add Collection Modal */}
      {showCollectionModal && (
        <AddToCollection
          postId={data.id}
          onClose={() => setShowCollectionModal(false)}
        />
      )}

      {/* View Dialog */}
      {isOpen && (
        <PostViewDialogBox isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
      )}
    </div>
  );
};

export default PostCard;
