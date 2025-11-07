'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveAs } from 'file-saver'

export default function InternshipsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [internships, setInternships] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    stipendAmount: '',
    role: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchInternships()
  }, [session, router, pagination.page])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      })

      const response = await fetch(`/api/v1/admin/internships?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch internships')
      }

      const data = await response.json()
      setInternships(data.internships)
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages,
        page: data.pagination.page,
      }))
    } catch (error) {
      console.error('Error fetching internships:', error)
      toast.error('Failed to load internships')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/v1/admin/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create internship')
      }

      const data = await response.json()
      toast.success('Internship created successfully!')
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        stipendAmount: '',
        role: '',
      })
      setShowForm(false)
      fetchInternships()
    } catch (error) {
      console.error('Error creating internship:', error)
      toast.error(error.message || 'Failed to create internship')
    } finally {
      setSubmitting(false)
    }
  }

  const downloadQRCode = (internship) => {
    if (!internship.qrCodeUrl) {
      toast.error('QR code not available')
      return
    }

    // Convert data URL to blob
    fetch(internship.qrCodeUrl)
      .then((res) => res.blob())
      .then((blob) => {
        saveAs(
          blob,
          `internship-qr-${internship.name.replace(/\s+/g, '-')}-${
            internship.id
          }.png`
        )
        toast.success('QR code downloaded successfully!')
      })
      .catch((error) => {
        console.error('Error downloading QR code:', error)
        toast.error('Failed to download QR code')
      })
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Internship Management</h1>
          <p className="text-gray-500">
            Manage internships and generate QR codes
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Internship
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Internship</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Intern Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter intern name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Full Stack Developer"
                  className="input input-bordered"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Stipend Amount (₹) *</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter stipend amount"
                  className="input input-bordered"
                  value={formData.stipendAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stipendAmount: e.target.value,
                    })
                  }
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Internship
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    name: '',
                    startDate: '',
                    endDate: '',
                    stipendAmount: '',
                    role: '',
                  })
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Internships List */}
      <div className="bg-base-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            All Internships ({pagination.total})
          </h2>

          {internships.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No internships found</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Create First Internship
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Duration</th>
                    <th>Stipend</th>
                    <th>QR Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {internships.map((internship) => (
                    <tr key={internship.id}>
                      <td>
                        <div className="font-semibold">{internship.name}</div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(internship.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline">
                          {internship.role}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{formatDate(internship.startDate)}</div>
                          <div className="text-gray-500">to</div>
                          <div>{formatDate(internship.endDate)}</div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {formatCurrency(internship.stipendAmount)}
                        </div>
                      </td>
                      <td>
                        {internship.qrCodeUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 bg-white p-2 rounded">
                              <img
                                src={internship.qrCodeUrl}
                                alt="QR Code"
                                className="w-full h-full"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => downloadQRCode(internship)}
                          className="btn btn-sm btn-primary"
                          disabled={!internship.qrCodeUrl}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                className="btn btn-sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
                }
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn btn-sm"
                disabled={pagination.page === pagination.pages}
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
