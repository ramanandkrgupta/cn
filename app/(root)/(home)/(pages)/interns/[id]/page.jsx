'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Calendar, DollarSign, User, Briefcase, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function InternDetailPage() {
  const params = useParams()
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qrSize, setQrSize] = useState(256)

  useEffect(() => {
    if (params?.id) {
      fetchInternship(params.id)
    }
  }, [params?.id])

  useEffect(() => {
    const updateQrSize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 375) {
          // Very small phones
          setQrSize(140)
        } else if (window.innerWidth < 640) {
          // Small phones
          setQrSize(160)
        } else if (window.innerWidth < 768) {
          // Tablets
          setQrSize(200)
        } else {
          // Desktop
          setQrSize(256)
        }
      }
    }

    updateQrSize()
    window.addEventListener('resize', updateQrSize)
    return () => window.removeEventListener('resize', updateQrSize)
  }, [])

  const fetchInternship = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/public/interns/${id}`)
      if (!response.ok) {
        throw new Error('Internship not found')
      }
      const data = await response.json()
      setInternship(data)
    } catch (error) {
      console.error('Error fetching internship:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()

    // Add ordinal suffix
    const getOrdinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }

    return `${getOrdinal(day)} ${month} ${year}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A'
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const days = diffDays % 30

    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error || !internship) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6">
        <Briefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">
          Internship Not Found
        </h1>
        <p className="text-gray-500 text-sm sm:text-base text-center px-4">
          {error || "The internship you're looking for doesn't exist."}
        </p>
      </div>
    )
  }

  const qrCodeUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-2 sm:py-4 md:py-8 px-2 sm:px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl overflow-hidden mb-3 sm:mb-4 md:mb-8">
          {/* Header with decorative border */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 sm:p-4 md:p-6 lg:p-8 text-white">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                Notes Mates
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg">
                Internship Certificate
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
            {/* Name and Duration Header */}
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 break-words leading-tight">
                {internship.name}
              </h2>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 text-gray-600 mt-2 sm:mt-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg text-center leading-tight">
                    <span className="block sm:inline">
                      {formatDateShort(internship.startDate)}
                    </span>
                    <span className="hidden sm:inline mx-1">-</span>
                    <span className="block sm:inline sm:ml-1">
                      {formatDateShort(internship.endDate)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Text */}
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none mb-4 sm:mb-6 md:mb-8">
              <p className="text-gray-700 leading-relaxed sm:leading-relaxed text-justify text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                This is to certify that{' '}
                <strong className="text-gray-900 font-semibold">
                  {internship.name}
                </strong>{' '}
                has successfully completed their internship as a{' '}
                <strong className="text-gray-900 font-semibold">
                  {internship.role}
                </strong>{' '}
                at Notes Mates.
              </p>
              <p className="text-gray-700 leading-relaxed sm:leading-relaxed text-justify mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                Their tenure lasted from {formatDate(internship.startDate)} to{' '}
                {formatDate(internship.endDate)} (
                {calculateDuration(internship.startDate, internship.endDate)}).
                During this period, they demonstrated exceptional technical and
                analytical abilities, consistently delivering high-quality work
                and contributing valuable insights to our projects.
              </p>
              <p className="text-gray-700 leading-relaxed sm:leading-relaxed text-justify mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                {internship.name} actively contributed to our platform's growth,
                utilizing modern technologies and best practices to ensure
                scalable and efficient solutions. Their commitment to learning,
                collaboration, and problem-solving greatly benefited our team.
              </p>
              <p className="text-gray-700 leading-relaxed sm:leading-relaxed text-justify mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base">
                We appreciate their hard work, dedication, and professionalism
                throughout the internship and wish them continued success in
                their future endeavors.
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200">
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div className="bg-blue-100 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Role
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words leading-tight">
                    {internship.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div className="bg-green-100 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Stipend
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 leading-tight">
                    {formatCurrency(internship.stipendAmount)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div className="bg-purple-100 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Start Date
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words leading-tight">
                    {formatDate(internship.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div className="bg-orange-100 p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    End Date
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words leading-tight">
                    {formatDate(internship.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-3 sm:p-4 md:p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                Verified by Notes Mates
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 break-all px-2 leading-tight">
                Certificate ID: {internship.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
