'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PDFViewer from '@/components/pdf/PDFViewer'
import { ArrowLeft, Heart, Share2, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const PDFView = ({ params: paramsPromise }) => {
  const router = useRouter()
  const [id, setId] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [documentInfo, setDocumentInfo] = useState(null)
  const [similarPDFs, setSimilarPDFs] = useState([])
  const [activeTab, setActiveTab] = useState('information') // Tabs: 'information' or 'similar'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Sidebar state

  useEffect(() => {
    paramsPromise.then((params) => {
      setId(params.id)
    })
  }, [paramsPromise])

  useEffect(() => {
    const fetchPDFData = async () => {
      try {
        setLoading(true)

        // Fetch PDF URL and metadata
        const pdfResponse = await fetch('/api/v1/members/posts/secure-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: id }),
        })
        if (!pdfResponse.ok) {
          const errorText = await pdfResponse.text()
          console.error('Failed to fetch PDF URL and metadata:', errorText)
          throw new Error('Failed to fetch PDF URL and metadata')
        }
        const { fileUrl } = await pdfResponse.json()
        setPdfUrl(fileUrl)

        // Fetch post data from the database
        const postResponse = await fetch(`/api/v1/members/posts/${id}`)
        if (!postResponse.ok) {
          const errorText = await postResponse.text()
          console.error('Failed to fetch post data:', errorText)
          throw new Error('Failed to fetch post data')
        }
        const postData = await postResponse.json()
        const { title, description, subject_name, course_name, semester_code, category, file_size } = postData
        setDocumentInfo({ title, description, subject_name, course_name, semester_code, category, file_size })

        // Debugging: Log course_name, subject_name, semester_code, and category
        console.log('Course Name:', course_name, 'Subject Name:', subject_name, 'Semester Code:', semester_code, 'Category:', category)

        // Fetch similar PDFs based on subject name (other parameters are optional)
        if (subject_name) {
          try {
            // Use a safer approach by using the `/api/v1/members/posts/by-subject` endpoint
            // This is assuming you might need to create this endpoint if it doesn't exist
            
            const endpoint = `/api/v1/members/posts/by-subject?subject=${encodeURIComponent(subject_name)}`;
            console.log('Fetching similar PDFs from endpoint:', endpoint);

            const similarResponse = await fetch(endpoint);
            
            if (!similarResponse.ok) {
              const errorText = await similarResponse.text();
              console.error('Failed to fetch similar PDFs with status:', similarResponse.status, errorText);
              throw new Error('Failed to fetch similar PDFs');
            }
            
            const similarData = await similarResponse.json();
            console.log('Similar PDFs Response:', similarData);
            
            // Filter out the current document from similar PDFs list
            const filteredPosts = similarData.filter(post => post.id !== id);
            
            if (filteredPosts.length > 0) {
              setSimilarPDFs(filteredPosts);
            } else {
              setSimilarPDFs([]);
              console.warn('No similar PDFs found after filtering current document.');
            }
          } catch (err) {
            console.error('Error fetching similar PDFs:', err);
            toast.error('Failed to fetch similar documents');
          }
        } else {
          console.warn('Subject name is missing. Skipping similar PDFs fetch.');
          setSimilarPDFs([]);
        }
      } catch (err) {
        console.error('Error fetching PDF data:', err)
        setError(err.message || 'Failed to load data')
        toast.error(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPDFData()
    }
  }, [id])

  const handleLike = async () => {
    try {
      const response = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, metricType: 'likes' }),
      })
      if (!response.ok) throw new Error('Failed to like the document')
      toast.success('Liked the document!')
    } catch (error) {
      console.error('Error liking document:', error)
      toast.error(error.message || 'Failed to like the document')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = documentInfo?.title || 'document.pdf'
      link.click()
    } else {
      toast.error('PDF is not available for download.')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-1/4'
        } bg-base-200 p-4 overflow-y-auto relative`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            aria-label="Go Back"
            className="hover:bg-base-300 rounded-full transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Toggle Sidebar Button */}
          <button
            aria-label="Toggle Sidebar"
            className="hover:bg-base-300 rounded-full transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
        </div>

        {/* Tabs Section */}
        {!sidebarCollapsed && (
          <div>
            <div className="tabs  mt-3 mb-4">
              <button
                className={`tab ${activeTab === 'information' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('information')}
              >
                Information
              </button>
              <button
                className={`tab ${activeTab === 'similar' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('similar')}
              >
                Similar PDFs
              </button>
            </div>
            {activeTab === 'information' ? (
              documentInfo ? (
                <div>
                  <p><strong>Title:</strong> {documentInfo.title}</p>
                  <p><strong>Description:</strong> {documentInfo.description}</p>
                  <p><strong>Subject:</strong> {documentInfo.subject_name}</p>
                  <p><strong>Course:</strong> {documentInfo.course_name}</p>
                  <p><strong>Semester:</strong> {documentInfo.semester_code}</p>
                  <p><strong>Category:</strong> {documentInfo.category}</p>
                  <p><strong>File Size:</strong> {(documentInfo.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <p>Loading document information...</p>
              )
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Similar PDFs</h2>
                {similarPDFs.length > 0 ? (
                  <ul className="space-y-2">
                    {similarPDFs.map((pdf) => (
                      <li
                        key={pdf.id}
                        className="p-2 bg-base-300 rounded-md hover:bg-base-400 cursor-pointer"
                        onClick={() => router.push(`/view-doc/pdf/${pdf.id}`)}
                      >
                        <p className="font-semibold">{pdf.title}</p>
                        <p className="text-sm text-gray-500">{pdf.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No similar PDFs found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PDF Viewer Section */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Heading Bar */}
        <div className="flex items-center justify-between bg-base-300 p-4 border-b">
          <h1 className="text-lg font-semibold">{documentInfo?.title || 'Document'}</h1>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={handleLike}
              title="Like"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* PDF Viewer */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center mt-20">Loading PDF...</div>
          ) : error && !pdfUrl ? (
            <div className="text-error text-center mt-20">{error}</div>
          ) : (
            <PDFViewer url={pdfUrl} />
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFView
