'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PDFViewer from '@/components/pdf/PDFViewer'
import { ArrowLeft, Heart, Share2, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSession } from "next-auth/react"
import { saveAs } from 'file-saver'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'


const PDFView = ({ params: paramsPromise }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [id, setId] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [documentInfo, setDocumentInfo] = useState(null)
  const [similarPDFs, setSimilarPDFs] = useState([])
  const [activeTab, setActiveTab] = useState('information') // Tabs: 'information' or 'similar'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Sidebar state
  const [hasLiked, setHasLiked] = useState(false)
  const [downloadInProgress, setDownloadInProgress] = useState(false)
  const [metrics, setMetrics] = useState({
    downloads: 0,
    likes: 0,
    shares: 0,
    views: 0,
  })

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
        
        setMetrics({
          downloads: postData.downloads || 0,
          likes: postData.likes || 0,
          shares: postData.shares || 0,
          views: 0,  // Initialize views from post data
        })

        const metricsResponse = await fetch(
          `/api/v1/members/posts/metrics?postId=${id}`
        )
        if (metricsResponse.ok) {
          const { hasLiked } = await metricsResponse.json()
          setHasLiked(hasLiked)
        }

        // Record view and update view count
        const viewResponse = await fetch('/api/v1/members/posts/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: id, metricType: 'views' }),
        })
        
        if (viewResponse.ok) {
          const updatedMetrics = await viewResponse.json();
          if (updatedMetrics.views !== undefined) {
            setMetrics(prev => ({...prev, views: updatedMetrics.views}));
          }
        }

        console.log('Course Name:', course_name, 'Subject Name:', subject_name, 'Semester Code:', semester_code, 'Category:', category)

        if (subject_name) {
          try {
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
      const previousLikedState = hasLiked
      const newLikedState = !hasLiked
      
      setHasLiked(newLikedState)
      setMetrics((prev) => ({
        ...prev,
        likes: newLikedState ? prev.likes + 1 : Math.max(prev.likes - 1, 0),
      }))
      
      const response = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: id,
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
      }
      
      toast.success(newLikedState ? 'Document liked!' : 'Document unliked!')
    } catch (error) {
      console.error('Like/Unlike error:', error)
      toast.error(error.message || 'Error updating like status')
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareTitle = documentInfo?.title || 'Check out this document'
    const shareText = documentInfo?.description || 'Interesting document I found'
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      }
      
      const response = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, metricType: 'shares' }),
      })
      
      if (response.ok) {
        const updatedMetrics = await response.json()
        setMetrics((prev) => ({ ...prev, ...updatedMetrics }))
      }
    } catch (error) {
      console.error('Share error:', error)
      if (error.name === 'AbortError') return
      toast.error('Error sharing document')
    }
  }
   // Function to add user details to the PDF
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
  

  
  // Function to handle file download
  const handleDownload = async (e) => {
    if (e) e.preventDefault(); // Prevent any default behavior
    if (downloadInProgress) return;
    
    try {
      // Check if user is logged in
      if (!session?.user) {
        toast.error('Please login to download files')
        return;
      }
      
      // Check for premium content if applicable
      if (documentInfo?.premium && session.user.role !== 'PRO') {
        toast.error(
          'This is a premium file. You need a premium membership to download it.'
        )
        return;
      }
      
      setDownloadInProgress(true);
      toast.loading('Preparing your download...');
      
      // Get secure file URL
      const response = await fetch('/api/v1/members/posts/secure-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get file access');
      }
      
      const { fileUrl } = await response.json();
      
      try {
        // Process the PDF with user details
        const fileResponse = await fetch(fileUrl);
        const existingPdfBytes = await fileResponse.arrayBuffer();
        
        const modifiedPdfBytes = await addUserDetailsToPdf(
          existingPdfBytes,
          session.user.name,
          session.user.email
        );
        
        const modifiedBlob = new Blob([modifiedPdfBytes], {
          type: 'application/pdf',
        });
        
        // Use saveAs with explicit filename to force download
        saveAs(modifiedBlob, `cn-${documentInfo?.title || 'document'}.pdf`);
      } catch (processingError) {
        console.error('Error processing PDF:', processingError);
        
        // Force download using Blob and saveAs
        try {
          const fileResponse = await fetch(fileUrl);
          const fileBlob = await fileResponse.blob();
          saveAs(fileBlob, `cn-${documentInfo?.title || 'document'}.pdf`);
        } catch (fallbackError) {
          // Last resort fallback - create an anchor with download attribute
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = `cn-${documentInfo?.title || 'document'}.pdf`; // Forces download
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        }
      }
      
      // Record metrics
      const metricsResponse = await fetch('/api/v1/members/posts/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, metricType: 'downloads' }),
      });
      
      if (metricsResponse.ok) {
        const updatedMetrics = await metricsResponse.json();
        setMetrics((prev) => ({ ...prev, ...updatedMetrics }));
      }
      
      toast.dismiss();
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss();
      toast.error(error.message || 'Error downloading file');
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-y-auto md:overflow-hidden">
      {/* Sidebar - full width on mobile, side column on desktop */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'md:w-16 md:h-full' : 'md:w-1/4 md:h-full'
        } w-full bg-base-200 p-4 ${
          sidebarCollapsed ? 'md:max-h-16 max-h-16' : 'overflow-y-auto md:h-full'
        } relative min-h-[60vh] md:min-h-0`}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            aria-label="Go Back"
            className="hover:bg-base-300 rounded-full p-2 transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Toggle Sidebar Button */}
          <button
            aria-label="Toggle Sidebar"
            className="hover:bg-base-300 rounded-full p-2 transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Tabs Section */}
        {!sidebarCollapsed && (
          <div className="mt-2 pb-4">
            <div className="tabs tabs-boxed bg-base-300 mb-4">
              <button
                className={`tab ${activeTab === 'information' ? 'tab-active' : ''} flex-1`}
                onClick={() => setActiveTab('information')}
              >
                Information
              </button>
              <button
                className={`tab ${activeTab === 'similar' ? 'tab-active' : ''} flex-1`}
                onClick={() => setActiveTab('similar')}
              >
                Similar PDFs
              </button>
            </div>
            
            {/* Content Section with Better Mobile Visibility */}
            <div className="max-h-[70vh] md:max-h-none overflow-y-auto pb-2">
              {activeTab === 'information' ? (
                documentInfo ? (
                  <div className="space-y-3 mt-2 mb-4">
                    <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Title</p>
                      <p className="font-medium">{documentInfo.title}</p>
                    </div>
                    
                    <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-sm">{documentInfo.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Subject</p>
                        <p className="font-medium">{documentInfo.subject_name}</p>
                      </div>
                      <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Course</p>
                        <p className="font-medium">{documentInfo.course_name}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Semester</p>
                        <p className="font-medium">{documentInfo.semester_code}</p>
                      </div>
                      <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Category</p>
                        <p className="font-medium">{documentInfo.category}</p>
                      </div>
                    </div>
                    
                    <div className="bg-base-100 p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">File Size</p>
                      <p className="font-medium">{(documentInfo.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">Loading document information...</p>
                  </div>
                )
              ) : (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-4">Similar PDFs</h2>
                  {similarPDFs.length > 0 ? (
                    <div className="md:grid md:grid-cols-1 md:gap-4 w-full flex overflow-x-auto pb-3 space-x-4 md:space-x-0">
                      {similarPDFs.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 min-w-[270px] md:w-full flex-shrink-0"
                          onClick={() => router.push(`/view-doc/pdf/${pdf.id}`)}
                        >
                          <div className="flex w-full">
                            {/* PDF thumbnail */}
                            <div className="w-24 h-32 bg-gray-100 flex-shrink-0 border-r border-gray-200">
                              {pdf.thumbnail_url ? (
                                <img 
                                  src={pdf.thumbnail_url} 
                                  alt={pdf.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <span className="text-3xl font-bold text-gray-300">
                                    {pdf.title?.charAt(0) || 'P'}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* PDF details */}
                            <div className="flex-1 p-3">
                              <div className="flex flex-col h-full">
                                <div>
                                  <h3 className="font-medium text-base line-clamp-1">{pdf.title}</h3>
                                  
                                  <div className="mt-1">
                                    <p className="text-xs text-gray-500">
                                      <span className="font-medium">Subject:</span> {pdf.subject_name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      <span className="font-medium">Course:</span> {pdf.course_name || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Metrics */}
                                <div className="flex items-center justify-start space-x-3 mt-2">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Download className="w-3 h-3 mr-1" />
                                    <span>{typeof pdf.downloads === 'number' ? pdf.downloads : (pdf.metrics?.downloads || 0)}</span>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Heart className="w-3 h-3 mr-1" />
                                    <span>{typeof pdf.likes === 'number' ? pdf.likes : (pdf.metrics?.likes || 0)}</span>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Share2 className="w-3 h-3 mr-1" />
                                    <span>{typeof pdf.shares === 'number' ? pdf.shares : (pdf.metrics?.shares || 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-base-100 rounded-lg p-6 text-center">
                      <p className="text-gray-500">No similar PDFs found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Section - Adjusted height on mobile */}
      <div className="flex-1 flex flex-col h-auto md:h-full">
        {/* Heading Bar */}
        <div className="flex items-center justify-between bg-base-300 p-4 border-b sticky top-0 z-10">
          <h1 className="text-lg font-semibold line-clamp-1">{documentInfo?.title || 'Document'}</h1>
          <div className="flex items-center gap-2">
            <button
              className={`btn btn-sm ${hasLiked ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleLike}
              title={hasLiked ? "Unlike" : "Like"}
            >
              <Heart 
                className="w-4 h-4" 
                fill={hasLiked ? "currentColor" : "none"} 
              />
              <span className="ml-1 hidden sm:inline">{metrics.likes || 0}</span>
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">{metrics.shares || 0}</span>
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={handleDownload}
              disabled={downloadInProgress}
              title="Download"
            >
              {downloadInProgress ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="ml-1 hidden sm:inline">{metrics.downloads || 0}</span>
            </button>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className=" h-full flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">Loading PDF...</div>
            </div>
          ) : error && !pdfUrl ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-error text-center">{error}</div>
            </div>
          ) : (
            <div className="w-full h-auto overflow-y-auto" style={{ minHeight: '100%' }}>
              <PDFViewer url={pdfUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFView
