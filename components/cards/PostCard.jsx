import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
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
import toast from 'react-hot-toast'
import { saveAs } from 'file-saver'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import Link from 'next/link'

import PostViewDialogBox from '../models/PostViewDialogBox'
import AddToCollection from '../collections/AddToCollection'

const PostCard = ({ data, onUpdate }) => {
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

  // On mount, check if the user has already liked the post
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

    if (downloadInProgress.has(data.id)) {
      return
    }

    try {
      if (!session?.user) {
        toast.error('Please login to download files')
        return
      }

      if (data.premium && session.user.userRole !== 'PRO') {
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
        body: JSON.stringify({
          postId: data.id,
          metricType: 'downloads',
        }),
      })

      if (metricsResponse.ok) {
        const updatedMetrics = await metricsResponse.json()
        setMetrics((prev) => ({
          ...prev,
          ...updatedMetrics,
        }))
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

  // Optimistic toggle for like/unlike so the user can switch anytime
  const handleLike = async (e) => {
    e.stopPropagation()

    if (!session?.user) {
      toast.error('Please login to like/unlike posts')
      return
    }

    // Save the current state so we can revert if the API fails
    const previousLikedState = hasLiked
    const newLikedState = !hasLiked

    // Optimistically update the UI
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
        // Revert the optimistic update if the API call fails
        setHasLiked(previousLikedState)
        setMetrics((prev) => ({
          ...prev,
          likes: newLikedState ? prev.likes - 1 : prev.likes + 1,
        }))
        const result = await response.json()
        throw new Error(result.error || 'Failed to update like status')
      }

      // Optionally update with server response if provided
      const result = await response.json()
      if (result.likes !== undefined) {
        setMetrics((prev) => ({ ...prev, likes: result.likes }))
      }

      toast.success(newLikedState ? 'Post liked!' : 'Post unliked!')
    } catch (error) {
      console.error('Like/Unlike error:', error)
      toast.error(error.message || 'Error updating post status')
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()

    try {
      const SharePost = {
        title: data.title || '',
        content: `Hey! Check out these notes for your best result in exams.\n\n🛂Course Name🛂\n ${
          data.course_name
        }\n\n📕File Title 📕\n ${data.title}\n\n#${data.subject_name.replace(
          /\s/g,
          ''
        )} #${data.course_name.replace(/\s/g, '')}\n\n🚀 Download Link 🚀\n`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/post/${
          data.id
        }/${data.title.replace(/\s+/g, '-')}`,
      }

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
        body: JSON.stringify({
          postId: data.id,
          metricType: 'shares',
        }),
      })

      if (response.ok) {
        const updatedMetrics = await response.json()
        setMetrics((prev) => ({
          ...prev,
          ...updatedMetrics,
        }))
      }
    } catch (error) {
      console.error('Share error:', error)
      if (error.name === 'AbortError') return
      toast.error('Error sharing post')
    }
  }

  const getPlaceholderImage = () => {
    return `https://placehold.co/600x800/222222/ffffff?text=${encodeURIComponent(
      data.title || 'No Title'
    )}`
  }

  return (
    <div
      className="relative group bg-base-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
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

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Eye className="w-8 h-8 text-white" />
          </div>

          {/* Title and Category Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="font-semibold text-sm line-clamp-2">{data.title}</h3>
            <p className="text-xs opacity-75 mt-1">{data.category}</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 border-t border-base-300 bg-base-100">
        <div className="flex items-center justify-between">
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
                  (!session?.user || session.user.userRole !== 'PRO'))
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
    </div>
  )
}

export default PostCard
