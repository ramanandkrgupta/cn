'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function ModerationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchPendingPosts()
  }, [session, status, router])

  const fetchPendingPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/admin/moderation?status=pending')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load pending posts')
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async (postId, action) => {
    try {
      let note = ''
      if (action === 'reject') {
        note = prompt('Please provide a reason for rejection:')
        if (!note) return
      }
      const response = await fetch('/api/v1/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, note }),
      })
      if (!response.ok) throw new Error('Failed to moderate post')
      toast.success(`Post ${action}ed successfully`)
      fetchPendingPosts()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to moderate post')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 overflow-x-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Content Moderation
          </h1>
          <p className="mt-1 text-[10px] sm:text-xs text-gray-300">
            Review and moderate pending content
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-4">
            <Clock className="w-10 h-10 mx-auto text-gray-500 mb-2" />
            <p className="text-sm text-gray-500">
              No pending posts to moderate
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 rounded-lg border border-orange-500 p-2 sm:p-3"
              >
                <div className="mb-2">
                  <h3 className="text-base sm:text-lg font-semibold break-words">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-[9px] sm:text-xs text-gray-400 break-words">
                    By {post.user?.name || post.user?.email} •{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mb-2 text-[9px] sm:text-xs break-words">
                  {post.description}
                </p>

                {/* Post Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2">
                  {[
                    { label: 'Course', value: post.course_name },
                    { label: 'Subject', value: post.subject_name },
                    { label: 'Semester', value: post.semester_code },
                    { label: 'Category', value: post.category },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-gray-800 rounded p-1 text-center"
                    >
                      <p className="text-[7px] sm:text-[9px] text-gray-400">
                        {item.label}
                      </p>
                      <p className="text-[8px] sm:text-[10px] font-medium break-words truncate">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-1">
                  <a
                    href={post.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-black font-bold px-2 py-1 rounded text-[8px] sm:text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </a>
                  <button
                    onClick={() => handleModeration(post.id, 'approve')}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-black font-bold px-2 py-1 rounded text-[8px] sm:text-xs"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleModeration(post.id, 'reject')}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-black font-bold px-2 py-1 rounded text-[8px] sm:text-xs"
                  >
                    <XCircle className="w-3 h-3" />
                    Reject
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
