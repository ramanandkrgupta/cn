'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import PostCard from '@/components/cards/PostCard'
import NoDataFound from '@/components/ui/NoDataFound'
import { motion, AnimatePresence } from 'framer-motion'

// A responsive skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
    {[...Array(10).keys()].map((i) => (
      <div key={i} className="bg-base-300 rounded-lg aspect-[3/4]" />
    ))}
  </div>
)

const SearchPage = () => {
  // Filters: Course, Semester, Category, Sort, and Type
  const [filters, setFilters] = useState({
    course: '',
    semester: '',
    category: '',
    sort: 'newest',
    type: 'all',
  })

  const [posts, setPosts] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch posts from the API endpoint based on current filters
  const fetchPosts = async () => {
    try {
      setLoading(true)
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

      // Optionally filter posts by content type if not already handled on the server
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

  // Refetch posts whenever any filter changes
  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <div className="container mx-auto p-2">
      {/* Filters & Post Count in a compact container */}
      <div className="bg-base-200 p-2 rounded-md mb-3">
        {/* This outer container is a flex column on mobile and row on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Left Group: Force one line using flex-nowrap */}
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <input
              type="text"
              placeholder="Course"
              value={filters.course}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, course: e.target.value }))
              }
              className="input input-bordered input-xs flex-shrink-0"
            />
            <select
              value={filters.semester}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, semester: e.target.value }))
              }
              className="select select-bordered select-xs flex-shrink-0"
            >
              <option value="">Sem</option>
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="input input-bordered input-xs flex-shrink-0"
            />
          </div>
          {/* Right Group: Force one line using flex-nowrap */}
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
              className="select select-bordered select-xs flex-shrink-0"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-downloads">Downloads</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="select select-bordered select-xs flex-shrink-0"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <button
              onClick={fetchPosts}
              className="btn btn-xs btn-primary flex-shrink-0 whitespace-nowrap"
            >
              Apply
            </button>
            <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
              Posts: {metadata?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <div className="text-error text-center p-2">{error}</div>
        ) : posts.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
                        setPosts((curr) => curr.filter((p) => p.id !== post.id))
                      } else {
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
      </div>
    </div>
  )
}

export default SearchPage
