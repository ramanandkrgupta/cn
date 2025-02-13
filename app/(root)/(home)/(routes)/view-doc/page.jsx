// app/(root)/(home)/(routes)/view-doc/page.jsx

'use client'
import toast from 'react-hot-toast'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PostCard from '@/components/cards/PostCard'
import NoDataFound from '@/components/ui/NoDataFound'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion' // Import framer-motion

// Format subject code (BT101 -> BT-101)
const formatSubjectCode = (code) => {
  if (!code) return ''
  const match = code.match(/([A-Za-z]+)(\d+)/)
  return match ? `${match[1]}-${match[2]}` : code
}

// Format semester (one -> First)
const formatSemester = (sem) => {
  if (!sem) return ''
  const semesterMap = {
    one: 'First',
    two: 'Second',
    three: 'Third',
    four: 'Fourth',
    five: 'Fifth',
    six: 'Sixth',
    seven: 'Seventh',
    eight: 'Eighth',
  }
  return semesterMap[sem.toLowerCase()] || sem
}

// AdCard component now uses the ad properties from the site settings.
const AdCard = ({ ad }) => (
  <a href={ad.url} target="_blank" rel="noopener noreferrer">
    <div className="rounded-lg flex flex-col items-center justify-center">
      {ad.img && (
        <img
          src={ad.img}
          alt={ad.title || 'Sponsored Ad'}
          className="object-contain h-2/3 w-full mb-2 rounded-md"
        />
      )}
      <div className="hover:bg-white w-full p-2 rounded-md text-center">
        {ad.title && <span className="font-bold ">{ad.title}</span>}
      </div>
    </div>
  </a>
)

// Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg aspect-[3/4]" />
      ))}
    </div>
  </div>
)

const ViewDoc = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const course = searchParams.get('name')
  const semester = searchParams.get('sem')
  const category = searchParams.get('category')
  const subId = searchParams.get('subId')

  const [posts, setPosts] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // New state to hold public site settings (ads, banners, etc.)
  const [siteSettings, setSiteSettings] = useState(null)

  // Update the filter state and options
  const [filters, setFilters] = useState({
    sort: 'newest',
    type: 'all',
  })

  // Fetch posts based on URL parameters and filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          sort: filters.sort,
          type: filters.type,
        })

        const response = await fetch(
          `/api/v1/public/posts/filter/${encodeURIComponent(
            course
          )}/${encodeURIComponent(semester)}/${encodeURIComponent(
            category
          )}/${encodeURIComponent(subId)}?${params}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts')
        }

        // Filter posts based on type
        const filteredPosts = data.posts.filter((post) => {
          switch (filters.type) {
            case 'free':
              return !post.premium
            case 'premium':
              return post.premium
            default:
              return true
          }
        })

        setPosts(filteredPosts)
        setMetadata({
          ...data.meta,
          total: filteredPosts.length,
        })
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError(error.message)
        toast.error('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    if (course && semester && category && subId) {
      fetchPosts()
    }
  }, [course, semester, category, subId, filters])

  // Update document title and meta tags for SEO
  useEffect(() => {
    const title = `${category} - ${formatSubjectCode(
      subId
    )} - ${course?.toUpperCase()} - ${formatSemester(
      semester
    )} Semester | RGPV Notes`
    const description = `Access free ${category?.toLowerCase()} for ${formatSubjectCode(
      subId
    )} (${course?.toUpperCase()}) ${formatSemester(
      semester
    )} Semester at RGPV University. Download lecture notes, previous year question papers, syllabus, and video lectures.`

    document.title = title

    // Function to update or create meta tags
    const updateMetaTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = name
        document.head.appendChild(tag)
      }
      tag.content = content
    }

    updateMetaTag('description', description)
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('og:type', 'website')
    updateMetaTag('og:site_name', 'RGPV Notes')
  }, [course, semester, category, subId])

  // Fetch public site settings (which include your ads) once on mount.
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/v1/public/site-settings')
        if (!res.ok) {
          throw new Error('Failed to fetch site settings')
        }
        const data = await res.json()
        setSiteSettings(data)
      } catch (error) {
        console.error(error)
        // You might want to show a toast or fallback to default ads.
      }
    }
    fetchSettings()
  }, [])

  // Choose an ad interval (example: 3 on desktop, 4 on mobile)
  const adInterval = 3 // adjust as needed

  return (
    <div className="container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2" onClick={() => router.back()}>
          <button
            aria-label="Go Back"
            className="hover:bg-base-300 rounded-full transition-colors"
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
            <AnimatePresence>
              {(() => {
                const gridItems = []
                let adCounter = 0
                // Use ads from site settings if available; otherwise, fallback to an empty array.
                const adsData = siteSettings?.ads || []
                posts.forEach((post, index) => {
                  gridItems.push(
                    <motion.div
                      key={`post-${post.id}`}
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
                            setPosts((currentPosts) =>
                              currentPosts.filter((p) => p.id !== post.id)
                            )
                          } else {
                            setPosts((currentPosts) =>
                              currentPosts.map((p) =>
                                p.id === updatedPost.id ? updatedPost : p
                              )
                            )
                          }
                        }}
                      />
                    </motion.div>
                  )
                  // Insert an ad every adInterval posts (except after the last post)
                  if (
                    (index + 1) % adInterval === 0 &&
                    index !== posts.length - 1
                  ) {
                    // Cycle through ads using modulo.
                    const ad = adsData[adCounter % adsData.length]
                    adCounter++
                    if (ad) {
                      gridItems.push(
                        <motion.div
                          key={`ad-${index}`}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AdCard ad={ad} />
                        </motion.div>
                      )
                    }
                  }
                })
                return gridItems
              })()}
            </AnimatePresence>
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
  )
}

export default ViewDoc
