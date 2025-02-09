'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PostCard from '@/components/cards/PostCard'
import NoDataFound from '@/components/ui/NoDataFound'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// A simple skeleton loading component (same as your view-doc page)
const SkeletonLoading = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {[...Array(10).keys()].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg aspect-[3/4]" />
      ))}
    </div>
  </div>
)

const SearchPage = () => {
  const router = useRouter()

  // Filters: course, semester, category; plus sort and type
  const [filters, setFilters] = useState({
    course: '',
    semester: '',
    category: '',
    sort: 'newest',
    type: 'all', // all, free, premium
  })
  const [posts, setPosts] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to fetch posts from our search API endpoint
  const fetchPosts = async () => {
    try {
      setLoading(true)
      // Build query parameters from filters
      const params = new URLSearchParams({
        sort: filters.sort,
        type: filters.type,
      })
      if (filters.course) params.append('course', filters.course)
      if (filters.semester) params.append('semester', filters.semester)
      if (filters.category) params.append('category', filters.category)

      const response = await fetch(
        `/api/v1/members/search/posts?${params.toString()}`,
        { method: 'GET' }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts')
      }

      // Optionally filter posts by content type (free/premium) if not handled server‑side
      let filteredPosts = data.posts
      if (filters.type === 'free') {
        filteredPosts = data.posts.filter((post) => !post.premium)
      } else if (filters.type === 'premium') {
        filteredPosts = data.posts.filter((post) => post.premium)
      }

      setPosts(filteredPosts)
      setMetadata({ total: filteredPosts.length })
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch posts when any filter changes
  useEffect(() => {
    fetchPosts()
  }, [filters])

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.back()}
        >
          <button
            aria-label="Go Back"
            className="hover:bg-base-300 rounded-full transition-colors p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Search Posts</h1>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        {/* Primary Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Course Filter */}
          <input
            type="text"
            placeholder="Course"
            value={filters.course}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, course: e.target.value }))
            }
            className="input input-bordered input-sm"
          />
          {/* Semester Filter */}
          <select
            value={filters.semester}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, semester: e.target.value }))
            }
            className="select select-bordered select-sm"
          >
            <option value="">All Semesters</option>
            {['1', '2', '3', '4', '5', '6', '7', '8'].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {/* Category Filter */}
          <input
            type="text"
            placeholder="Category"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="input input-bordered input-sm"
          />
        </div>

        {/* Additional Controls */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
            className="select select-bordered select-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-downloads">Most Downloads</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="select select-bordered select-sm"
          >
            <option value="all">All Content</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
          </select>
        </div>
      </div>

      {/* Stats Section */}
      {metadata && (
        <div className="stats stats-horizontal shadow-sm bg-base-200 stats-sm text-sm mb-6">
          <div className="stat py-2">
            <div className="stat-title text-xs">Posts</div>
            <div className="stat-value text-base">{metadata.total}</div>
          </div>
        </div>
      )}

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
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard
                    data={post}
                    onUpdate={(updatedPost) => {
                      if (updatedPost === null) {
                        // Post was deleted; remove it from the list.
                        setPosts((curr) => curr.filter((p) => p.id !== post.id))
                      } else {
                        // Otherwise, update the specific post.
                        setPosts((curr) =>
                          curr.map((p) =>
                            p.id === updatedPost.id ? updatedPost : p
                          )
                        )
                      }
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* "No More Posts" Message */}
        {posts.length > 0 && metadata && posts.length >= metadata.total && (
          <div className="text-center mt-6 text-sm text-gray-500">
            No more posts available
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
