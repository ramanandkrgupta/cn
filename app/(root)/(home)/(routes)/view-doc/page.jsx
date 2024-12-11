// app/(root)/(home)/(routes)/view-doc/page.jsx

"use client";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/cards/PostCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Format subject code (BT101 -> BT-101)
const formatSubjectCode = (code) => {
  if (!code) return "";
  const match = code.match(/([A-Za-z]+)(\d+)/);
  return match ? `${match[1]}-${match[2]}` : code;
};

// Format semester (one -> First)
const formatSemester = (sem) => {
  if (!sem) return "";
  const semesterMap = {
    one: "First",
    two: "Second",
    three: "Third",
    four: "Fourth",
    five: "Fifth",
    six: "Sixth",
    seven: "Seventh",
    eight: "Eighth",
  };
  return semesterMap[sem.toLowerCase()] || sem;
};

// Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg aspect-[3/4]" />
      ))}
    </div>
  </div>
);

const ViewDoc = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");
  const subId = searchParams.get("subId");

  const [posts, setPosts] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update the filter state and options
  const [filters, setFilters] = useState({
    sort: "newest",
    type: "all",
  });

  // Modified fetch function
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          sort: filters.sort,
          type: filters.type,
        });

        const response = await fetch(
          `/api/v1/public/posts/filter/${encodeURIComponent(
            course
          )}/${encodeURIComponent(semester)}/${encodeURIComponent(
            category
          )}/${encodeURIComponent(subId)}?${params}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch posts");
        }

        // Filter posts based on type
        const filteredPosts = data.posts.filter((post) => {
          switch (filters.type) {
            case "free":
              return !post.premium;
            case "premium":
              return post.premium;
            default:
              return true;
          }
        });

        setPosts(filteredPosts);
        setMetadata({
          ...data.meta,
          total: filteredPosts.length,
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (course && semester && category && subId) {
      fetchPosts();
    }
  }, [course, semester, category, subId, filters]);

  // Update document title and meta tags
  useEffect(() => {
    const title = `${category} - ${formatSubjectCode(
      subId
    )} - ${course?.toUpperCase()} - ${formatSemester(
      semester
    )} Semester | RGPV Notes`;
    const description = `Access free ${category?.toLowerCase()} for ${formatSubjectCode(
      subId
    )} (${course?.toUpperCase()}) ${formatSemester(
      semester
    )} Semester at RGPV University. Download lecture notes, previous year question papers, syllabus, and video lectures.`;

    document.title = title;

    // Update meta tags
    const updateMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateMetaTag("description", description);
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:site_name", "RGPV Notes");
  }, [course, semester, category, subId]);

  return (
    <div className="container">
      {/* Header Section */}
      {/* nn */}
      <div className=" mb-6">
        <div className="flex items-center gap-2" onClick={() => router.back()}>
          <button
            aria-label="Go Back"
            className="hover:bg-base-300  rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="select_header">{category}</h1>
        </div>

        <small className="text-gray-400">
          Path: rgpv/
          <Link
            href={`/rgpv/${course}`}
            className="text-blue-500 hover:underline"
          >
            {course}
          </Link>
          /
          <Link
            href={`/rgpv/${course}/${semester}`}
            className="text-blue-500 hover:underline"
          >
            {semester}
          </Link>
          /
          <Link
            href={`/rgpv/${course}/${semester}/${subId}`}
            className="text-blue-500 hover:underline"
          >
            {subId}
          </Link>
          /{category}
        </small>
      </div>

      {/* Controls and Stats Section */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            className="select select-bordered select-sm"
            value={filters.sort}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-downloads">Most Downloads</option>
          </select>

          <select
            className="select select-bordered select-sm"
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="all">All Content</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
          </select>
        </div>

        {/* Compact Stats */}
        {metadata && (
          <div className="stats stats-horizontal shadow-sm bg-base-200 stats-sm text-sm">
            <div className="stat py-2">
              <div className="stat-title text-xs">Posts</div>
              <div className="stat-value text-base">{metadata.total}</div>
            </div>
            <div className="stat py-2">
              <div className="stat-title text-xs">Downloads</div>
              <div className="stat-value text-base">
                {metadata.stats.downloads}
              </div>
            </div>
            <div className="stat py-2">
              <div className="stat-title text-xs">Likes</div>
              <div className="stat-value text-base">{metadata.stats.likes}</div>
            </div>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <div className="text-error text-center p-4">{error}</div>
        ) : posts.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                data={post}
                onUpdate={(updatedPost) => {
                  setPosts((currentPosts) =>
                    currentPosts.map((p) =>
                      p.id === updatedPost.id ? updatedPost : p
                    )
                  );
                }}
              />
            ))}
          </div>
        )}

        {/* No More Posts Message */}
        {posts.length > 0 && posts.length >= (metadata?.total || 0) && (
          <div className="text-center mt-6 text-sm text-gray-500">
            No more posts available
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDoc;
