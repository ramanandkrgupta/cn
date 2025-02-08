// UserUploads.jsx
'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, ArrowLeft } from 'lucide-react'
import PostCard from '@/components/cards/PostCard'
import NoDataFound from '@/components/ui/NoDataFound'

// Skeleton loading component remains unchanged
const SkeletonLoading = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg aspect-[3/4]" />
      ))}
    </div>
  </div>
)

export default function UserUploads() {
  const router = useRouter()
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Refs for FLIP animation
  const itemRefs = useRef({})
  const prevPositions = useRef(new Map())

  useEffect(() => {
    fetchUserUploads()
  }, [])

  const fetchUserUploads = async () => {
    try {
      const response = await fetch('/api/v1/members/users/uploads')
      if (response.ok) {
        const data = await response.json()
        setUploads(data)
      } else {
        throw new Error('Failed to fetch uploads')
      }
    } catch (err) {
      console.error('Error fetching uploads:', err)
      setError(err.message)
      toast.error('Failed to load uploads')
    } finally {
      setLoading(false)
    }
  }

  // Record positions before layout changes
  const recordPositions = () => {
    uploads.forEach((item) => {
      const el = itemRefs.current[item.id]
      if (el) {
        prevPositions.current.set(item.id, el.getBoundingClientRect())
      }
    })
  }

  // Handle deletion with animation
  const handleDelete = async (postId) => {
    recordPositions()

    try {
      const response = await fetch(`/api/v1/members/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        // toast.error(errorData.error || 'Failed to delete post')
        return
      }

      setUploads((prev) => prev.filter((upload) => upload.id !== postId))
      toast.success('Post deleted successfully')
    } catch (err) {
      console.error('Error deleting post:', err)
      // toast.error('Failed to delete post')
    }
  }

  // FLIP animation after state updates
  useLayoutEffect(() => {
    uploads.forEach((item) => {
      const el = itemRefs.current[item.id]
      const oldRect = prevPositions.current.get(item.id)

      if (el && oldRect) {
        const newRect = el.getBoundingClientRect()
        const deltaX = oldRect.left - newRect.left
        const deltaY = oldRect.top - newRect.top

        if (deltaX || deltaY) {
          // Apply inverse transform
          el.style.transition = 'none'
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`

          // Force reflow
          el.getBoundingClientRect()

          // Animate to final position
          el.style.transition = 'transform 300ms ease'
          el.style.transform = ''
        }
      }
    })
    prevPositions.current.clear()
  }, [uploads])

  return (
    <div className="container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            aria-label="Go Back"
            className="hover:bg-base-300 rounded-full transition-colors p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Your Uploads</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <button
            onClick={() => router.push('/upload')}
            className="btn btn-primary btn-sm sm:btn-md"
          >
            <Upload className="w-4 h-4 mr-2" />
            New Upload
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <div className="text-error text-center p-4">{error}</div>
        ) : uploads.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {uploads.map((post) => (
              <div
                key={post.id}
                className="relative transform-gpu"
                ref={(el) => {
                  itemRefs.current[post.id] = el
                }}
              >
                <PostCard
                  data={post}
                  className="w-full aspect-square"
                  onUpdate={(updatedPost) => {
                    if (!updatedPost) {
                      // Handle deletion
                      handleDelete(post.id)
                    } else {
                      // Handle other updates
                      setUploads((prev) =>
                        prev.map((p) =>
                          p.id === updatedPost.id ? updatedPost : p
                        )
                      )
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
