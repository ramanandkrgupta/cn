'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect unauthenticated users to /login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  // Filters state (Course, Semester & Category)
  const [filters, setFilters] = useState({
    course: '',
    semester: '',
    category: '',
  })

  // State for filter options (fetched from API)
  const [filterOptions, setFilterOptions] = useState({
    courses: [],
    semesters: [],
    categories: [],
  })

  // Posts and pagination state
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Observer ref for infinite scrolling
  const observer = useRef(null)
  const loadMoreRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  // Reset posts when filters change
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
  }, [filters])

  // Fetch filter options from your API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/v1/members/posts/filters')
        if (!response.ok) throw new Error('Failed to fetch filter options')
        const data = await response.json()
        setFilterOptions({
          courses: data.courses || [],
          semesters: data.semesters || [],
          categories: data.categories || [],
        })
      } catch (err) {
        console.error('Error fetching filter options:', err)
      }
    }
    fetchFilterOptions()
  }, [])

  // Fetch posts whenever the page or filters change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '1', // Set limit to 1 to load one post at a time
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

        // If fewer posts than expected are returned, assume there are no more posts
        if (data.posts.length < 1) {
          setHasMore(false)
        }

        // Append only unique posts to the existing list
        setPosts((prevPosts) => {
          const newPosts = data.posts.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          )
          return [...prevPosts, ...newPosts]
        })
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page, filters])

  return (
    <div className="container mx-auto p-2">
      {status === 'loading' ? (
        <SkeletonLoading />
      ) : (
        <>
          {/* Filters Container */}
          <div className="bg-base-200 p-2 rounded-md mb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
                {/* Course Dropdown */}
                <select
                  value={filters.course}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="select select-bordered select-xs flex-shrink-0"
                >
                  <option value="">Course</option>
                  {filterOptions.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {/* Semester Dropdown */}
                <select
                  value={filters.semester}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      semester: e.target.value,
                    }))
                  }
                  className="select select-bordered select-xs flex-shrink-0"
                >
                  <option value="">Semester</option>
                  {filterOptions.semesters.length > 0
                    ? filterOptions.semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))
                    : ['1', '2', '3', '4', '5', '6', '7', '8'].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                </select>
                {/* Category Dropdown */}
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="select select-bordered select-xs flex-shrink-0"
                >
                  <option value="">Category</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="items-center">
            {posts.length === 0 && !loading ? (
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
                            setPosts((curr) =>
                              curr.filter((p) => p.id !== post.id)
                            )
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

            {/* Loading Indicator */}
            {loading && <SkeletonLoading />}

            {/* Sentinel div for infinite scrolling */}
            <div ref={loadMoreRef}></div>
          </div>
        </>
      )}
    </div>
  )
}

export default SearchPage
