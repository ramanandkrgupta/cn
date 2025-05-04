'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import {
  Download,
  Heart,
  Share2,
  Eye,
  Crown,
  Flame,
  Plus,
  Lock,
  Loader2,
} from 'lucide-react'
import { saveAs } from 'file-saver'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import Link from 'next/link'
import PostViewDialogBox from '../models/PostViewDialogBox'
import AddToCollection from '../collections/AddToCollection'
import Modal from '@/components/Modal' // Import the new Modal component

// Import the category constant from your constants.
import { category } from '@/constants/index'

// ----------------------------
// EditDocForm: Only allows editing Title, Category, and Description.
// ----------------------------
const EditDocForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || '',
    description: initialData.description || '',
    premium: initialData.premium || '',
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate required fields: title and category.
    if (!formData.title || !formData.category) {
      toast.error('Please fill in both Title and Category.')
      return
    }
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Category</option>
          {category.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Premium
        </label>
        <select
          value={formData.premium}
          onChange={(e) => handleInputChange('premium', e.target.value === 'true')}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Enter description (optional)"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  )
}

// ----------------------------
// PostCard Component
// ----------------------------
const PostCard = ({ data, onUpdate = () => {} }) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [downloadInProgress, setDownloadInProgress] = useState(new Set())
  const [metrics, setMetrics] = useState({
    downloads: data.downloads || 0,
    likes: data.likes || 0,
    shares: data.shares || 0,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Check if the user has already liked the post.
  useEffect(() => {
    const checkUserInteraction = async () => {
      if (session?.user) {
        const response = await fetch(
          `/api/v1/members/posts/metrics?postId=${data.id}`
        )
        if (response.ok) {
          const { hasLiked } = await response.json()
          setHasLiked(hasLiked)
        }
      }
    }
    checkUserInteraction()
  }, [data.id, session])

  const addUserDetailsToPdf = async (existingPdfBytes, userName, userEmail) => {
    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true,
    })
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pages = pdfDoc.getPages()
    pages.forEach((page) => {
      const { width } = page.getSize()
      const fontSize = 10
      const userDetails = `${userName} - ${userEmail}`
      const textWidth = helveticaFont.widthOfTextAtSize(userDetails, fontSize)
      page.drawText(userDetails, {
        x: width - textWidth - 10,
        y: 10,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
      })
    })
    return await pdfDoc.save()
  }

  const handleDownload = async (e) => {
    e.stopPropagation()
    if (downloadInProgress.has(data.id)) return
    try {
      if (!session?.user) {
        toast.error('Please login to download files')
        return
      }
      if (data.premium && session.user.role !== 'PRO') {
        toast.error(
          'This is a premium file. You need a premium membership to download it.'
        )
        return
      }
      setIsDownloading(true)
      setDownloadInProgress((prev) => new Set(prev).add(data.id))
      const response = await fetch('/api/v1/members/posts/secure-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: data.id }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get file access')
      }
      const { fileUrl } = await response.json()
      const fileResponse = await fetch(fileUrl)
      const existingPdfBytes = await fileResponse.arrayBuffer()
      const modifiedPdfBytes = await addUserDetailsToPdf(
        existingPdfBytes,
        session.user.name,
        session.user.email
      )
      const modifiedBlob = new Blob([modifiedPdfBytes], {
        type: 'application/pdf',
      })
      saveAs(modifiedBlob, `cn-${data.title}`)
      const metricsResponse = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: data.id, metricType: 'downloads' }),
      })
      if (metricsResponse.ok) {
        const updatedMetrics = await metricsResponse.json()
        setMetrics((prev) => ({ ...prev, ...updatedMetrics }))
        onUpdate({ ...data, ...updatedMetrics })
      }
      toast.success('File downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error(error.message || 'Error downloading file')
    } finally {
      setIsDownloading(false)
      setDownloadInProgress((prev) => {
        const newSet = new Set(prev)
        newSet.delete(data.id)
        return newSet
      })
    }
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!session?.user) {
      toast.error('Please login to like/unlike posts')
      return
    }
    const previousLikedState = hasLiked
    const newLikedState = !hasLiked
    setHasLiked(newLikedState)
    setMetrics((prev) => ({
      ...prev,
      likes: newLikedState ? prev.likes + 1 : Math.max(prev.likes - 1, 0),
    }))
    try {
      const response = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: data.id,
          metricType: 'likes',
          action: newLikedState ? 'like' : 'unlike',
        }),
      })
      if (!response.ok) {
        setHasLiked(previousLikedState)
        setMetrics((prev) => ({
          ...prev,
          likes: newLikedState ? prev.likes - 1 : prev.likes + 1,
        }))
        const result = await response.json()
        throw new Error(result.error || 'Failed to update like status')
      }
      const result = await response.json()
      if (result.likes !== undefined) {
        setMetrics((prev) => ({ ...prev, likes: result.likes }))
        onUpdate({ ...data, likes: result.likes })
      }
      toast.success(newLikedState ? 'Post liked!' : 'Post unliked!')
    } catch (error) {
      console.error('Like/Unlike error:', error)
      toast.error(error.message || 'Error updating post status')
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    const SharePost = {
      title: data.title || '',
      content: `Hey! Check out these notes for your best result in exams.\n\n🛂Course Name🛂\n ${
        data.course_name
      }\n\n📕File Title 📕\n ${data.title}\n\n#${data.subject_name.replace(
        /\s/g,
        ''
      )} #${data.course_name.replace(/\s/g, '')}\n\n🚀 Download Link 🚀\n`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/view-doc/pdf/${
        data.id
      }`,
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: SharePost.title,
          text: SharePost.content,
          url: SharePost.url,
        })
      } else {
        await navigator.clipboard.writeText(
          `${SharePost.content}\n${SharePost.url}`
        )
        toast.success('Link copied to clipboard!')
      }
      const response = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: data.id, metricType: 'shares' }),
      })
      if (response.ok) {
        const updatedMetrics = await response.json()
        setMetrics((prev) => ({ ...prev, ...updatedMetrics }))
        onUpdate({ ...data, ...updatedMetrics })
      }
    } catch (error) {
      console.error('Share error:', error)
      if (error.name === 'AbortError') return
      toast.error('Error sharing post')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/v1/members/posts/${data.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        let errorMessage = 'Failed to delete post'
        try {
          const result = await response.json()
          errorMessage = result.error || errorMessage
        } catch (jsonError) {
          const text = await response.text()
          if (text) {
            errorMessage = text
          }
        }

        // If the error is "Record not found", we'll treat it as a successful deletion
        // since the post is already gone
        if (errorMessage.includes('Record to delete does not exist')) {
          toast.success('Post removed successfully')
          await new Promise((resolve) => setTimeout(resolve, 300))
          onUpdate(null)
          return
        }

        throw new Error(errorMessage)
      }

      // Add a small delay for the fade-out animation
      await new Promise((resolve) => setTimeout(resolve, 300))

      toast.success('Post deleted successfully!')
      onUpdate(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Error deleting post')
      setIsDeleting(false)
    } finally {
      setShowDeleteModal(false)
    }
  }

  const getPlaceholderImage = () => {
    return `https://placehold.co/600x800/222222/ffffff?text=${encodeURIComponent(
      data.title || 'No Title'
    )}`
  }
  console.log('User avatar URL:', data.user?.avatar)

  return (
    <div
      className={`relative group bg-base-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isDeleting ? 'opacity-0 transition-opacity duration-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Action Bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="flex gap-2">
          {data.premium && (
            <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PRO
            </span>
          )}
          {Date.now() - new Date(data.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
            <span className="bg-accent/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              NEW
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`btn btn-circle btn-sm ${
              hasLiked ? 'bg-red-500' : 'bg-base-100/80 hover:bg-base-100'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                hasLiked ? 'fill-white text-white' : 'text-white'
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowCollectionModal(true)
            }}
            className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
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
              unoptimized
            />
          </div>
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="font-semibold text-sm line-clamp-2">{data.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src={
                  data.user?.avatar || 'https://placehold.co/40x40?text=User'
                }
                alt={data.user?.name || 'Uploader'}
                width={20}
                height={20}
                className="rounded-full"
                unoptimized
              />
              <p className="text-xs opacity-75">{data.user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-base-300 bg-base-100">
        <div className="flex md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{metrics.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{metrics.downloads}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="btn btn-ghost btn-sm">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              disabled={
                downloadInProgress.has(data.id) ||
                (data.premium &&
                  (!session?.user || session.user.role !== 'PRO'))
              }
              className="btn btn-primary btn-sm"
            >
              {downloadInProgress.has(data.id) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !session?.user ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {session?.user &&
          (session.user.id === data.userId ||
            session.user.role === 'ADMIN') && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEditModal(true)
                }}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteModal(true)
                }}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </div>
          )}
      </div>

      {/* Modals */}
      {showCollectionModal && (
        <AddToCollection
          postId={data.id}
          onClose={() => setShowCollectionModal(false)}
        />
      )}
      {isOpen && (
        <PostViewDialogBox isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
      )}
      {showDeleteModal && (
        <Modal>
          <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Delete Post
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-error"
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showEditModal && (
        <Modal>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Post</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <EditDocForm
              initialData={data}
              onSave={async (updatedFields) => {
                try {
                  const response = await fetch(
                    `/api/v1/members/posts/${data.id}`,
                    {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updatedFields),
                    }
                  )
                  if (!response.ok) {
                    const result = await response.json()
                    throw new Error(result.error || 'Failed to update post')
                  }
                  const updatedPost = await response.json()
                  toast.success('Post updated successfully!')
                  onUpdate(updatedPost)
                  setShowEditModal(false)
                } catch (error) {
                  console.error('Update error:', error)
                  toast.error(error.message || 'Failed to update post')
                }
              }}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default PostCard
