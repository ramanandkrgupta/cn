'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, Trash2, Edit, ArrowLeft } from 'lucide-react'
import PostCard from '@/components/cards/PostCard'
import NoDataFound from '@/components/ui/NoDataFound'

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

export default function UserUploads() {
  const router = useRouter()
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    } catch (error) {
      console.error('Error fetching uploads:', error)
      setError(error.message)
      toast.error('Failed to load uploads')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/v1/members/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUploads((prev) => prev.filter((upload) => upload.id !== postId))
        toast.success('Post deleted successfully')
      } else {
        throw new Error('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

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
              <div key={post.id} className="relative">
                <PostCard data={post} className="w-full aspect-square" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/edit/${post.id}`)}
                    className="btn btn-circle btn-xs sm:btn-sm btn-ghost bg-base-100/80 hover:bg-base-200/90"
                    aria-label="Edit post"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn btn-circle btn-xs sm:btn-sm btn-ghost bg-error/20 hover:bg-error/30"
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
