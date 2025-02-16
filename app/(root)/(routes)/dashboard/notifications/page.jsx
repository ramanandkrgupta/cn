'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // Main states for notifications and pagination
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })

  // Form state for sending notifications
  const [selectedUsers, setSelectedUsers] = useState([])
  const [notification, setNotification] = useState({
    message: '',
    image: '',
    link: '',
    type: 'info', // info, success, warning, error
  })

  // Users list & search/filter states for recipient selection
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // "all", "ADMIN", "FREE", "PRO"
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    limit: 10,
  })

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null })

  // ---------------------------
  // Effects & API calls
  // ---------------------------
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchNotifications()
    fetchUsers() // Fetch recipients based on search/filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, router, pagination.page, searchQuery, roleFilter, showAllUsers])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      })
      const response = await fetch(`/api/v1/admin/notifications?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      const data = await response.json()
      setNotifications(data.notifications)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  // Fetch users with search & role filter.
  // When "Show All" is false, only fetch the first 10; otherwise, fetch all matching users.
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const limit = showAllUsers ? 1000 : usersPagination.limit // if show all, get a high limit
      const params = new URLSearchParams({
        search: searchQuery,
        role: roleFilter,
        page: '1',
        limit: String(limit),
      })
      const response = await fetch(`/api/v1/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setUsersPagination({
          total: data.pagination.total,
          limit: usersPagination.limit,
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUsers.length || !notification.message) {
      toast.error('Please select users and enter a message')
      return
    }
    try {
      const response = await fetch('/api/v1/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          ...notification,
        }),
      })
      if (!response.ok) throw new Error('Failed to send notification')
      toast.success('Notification sent successfully')
      // Clear the form
      setNotification({ message: '', image: '', link: '', type: 'info' })
      setSelectedUsers([])
      fetchNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
      toast.error('Failed to send notification')
    }
  }

  // Instead of browser confirm(), show custom modal.
  const handleConfirmDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/admin/notifications?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete notification')
      toast.success('Notification deleted successfully')
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  // Group notifications by message, type, image, link so that if the same notification was sent to multiple users, we display a summary.
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const key = `${notif.message}-${notif.type}-${notif.image || ''}-${
      notif.link || ''
    }`
    if (!acc[key]) {
      acc[key] = { ...notif, count: 1 }
    } else {
      acc[key].count++
    }
    return acc
  }, {})
  const notificationsGroups = Object.values(groupedNotifications)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-orange-500">
            <Bell className="w-6 h-6" />
            Notifications Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Send and manage notifications
          </p>
        </header>

        {/* Main Grid: Form & Notifications List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Notification Form */}
          <div className="bg-gray-900 rounded-lg border border-orange-500 p-4">
            <h2 className="text-lg font-bold text-orange-500 mb-3">
              Send Notification
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Message Field */}
              <div>
                <label className="block text-xs sm:text-sm mb-1">Message</label>
                <textarea
                  value={notification.message}
                  onChange={(e) =>
                    setNotification({
                      ...notification,
                      message: e.target.value,
                    })
                  }
                  className="w-full h-20 resize-none bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm"
                  placeholder="Enter notification message..."
                  required
                />
              </div>

              {/* Notification Type */}
              <div>
                <label className="block text-xs sm:text-sm mb-1">Type</label>
                <select
                  value={notification.type}
                  onChange={(e) =>
                    setNotification({ ...notification, type: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm"
                >
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs sm:text-sm mb-1">
                  Image URL (Optional)
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={notification.image}
                    onChange={(e) =>
                      setNotification({
                        ...notification,
                        image: e.target.value,
                      })
                    }
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l px-2 py-1 text-xs sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNotification({ ...notification, image: '' })
                    }
                    className="bg-gray-800 border border-gray-700 rounded-r px-2 py-1 text-xs sm:text-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs sm:text-sm mb-1">
                  Link URL (Optional)
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={notification.link}
                    onChange={(e) =>
                      setNotification({ ...notification, link: e.target.value })
                    }
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l px-2 py-1 text-xs sm:text-sm"
                    placeholder="https://example.com"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNotification({ ...notification, link: '' })
                    }
                    className="bg-gray-800 border border-gray-700 rounded-r px-2 py-1 text-xs sm:text-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Recipients Search & Filters */}
              <div>
                <label className="block text-xs sm:text-sm mb-1">
                  Search Recipients
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm"
                    placeholder="Search by name or email..."
                  />
                  <button
                    type="button"
                    onClick={fetchUsers}
                    className="btn btn-xs bg-orange-500 text-black"
                  >
                    Search
                  </button>
                </div>
                <label className="block text-xs sm:text-sm mb-1">
                  Filter by Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm mb-2"
                >
                  <option value="all">All</option>
                  <option value="ADMIN">Admin</option>
                  <option value="FREE">Free User</option>
                  <option value="PRO">Pro User</option>
                </select>
                {/* Users List */}
                <div className="bg-gray-800 rounded p-2 max-h-48 overflow-y-auto">
                  {users.slice(0, usersPagination.limit).map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center p-1 hover:bg-gray-700 rounded text-[7px]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id])
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id)
                            )
                          }
                        }}
                        className="checkbox checkbox-xs mr-2"
                      />
                      <span>
                        {user.name || user.email}{' '}
                        <span className="text-[6px] text-gray-400">
                          ({user.userRole})
                        </span>
                      </span>
                    </label>
                  ))}
                  {usersPagination.total > usersPagination.limit && (
                    <div className="text-[7px] text-gray-400 mt-1">
                      And {usersPagination.total - usersPagination.limit}{' '}
                      more...
                      <button
                        type="button"
                        onClick={() => setShowAllUsers(true)}
                        className="btn btn-xs ml-2 bg-orange-500 text-black"
                      >
                        Show All
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      // When selecting all, fetch all matching users
                      try {
                        const params = new URLSearchParams({
                          search: searchQuery,
                          role: roleFilter,
                          page: '1',
                          limit: '1000',
                        })
                        const response = await fetch(
                          `/api/v1/admin/users?${params}`
                        )
                        if (response.ok) {
                          const data = await response.json()
                          const allIds = data.users.map((u) => u.id)
                          setSelectedUsers(allIds)
                        }
                      } catch (error) {
                        console.error('Error selecting all:', error)
                      }
                    }}
                    className="btn btn-xs bg-orange-500 text-black"
                  >
                    Select All Matching
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedUsers.length || !notification.message}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 rounded text-xs sm:text-sm"
              >
                <Send className="w-4 h-4 inline mr-1" />
                Send Notification
              </button>
            </form>
          </div>

          {/* Recent Notifications */}
          <div className="bg-gray-900 rounded-lg border border-orange-500 p-4 flex flex-col">
            <h2 className="text-base sm:text-lg font-bold mb-3 text-orange-500">
              Recent Notifications
            </h2>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {notificationsGroups.map((group, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {group.type === 'info' && (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                      {group.type === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {group.type === 'warning' && (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      {group.type === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <div className="flex flex-col">
                        <p className="font-medium text-[7px] sm:text-sm break-words">
                          {group.message}
                        </p>
                        {group.count > 1 ? (
                          <p className="text-[6px] sm:text-xs text-gray-400">
                            Sent to {group.count} users
                          </p>
                        ) : (
                          <p className="text-[6px] sm:text-xs text-gray-400 break-words">
                            {new Date(group.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteModal({ show: true, id: group.id })
                      }
                      className="btn btn-ghost btn-xs text-red-500 self-start"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {group.image && (
                    <img
                      src={group.image}
                      alt="Notification"
                      className="mt-2 rounded w-full object-contain"
                    />
                  )}
                  {group.link && (
                    <a
                      href={group.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-[7px] sm:text-xs mt-2 inline-block"
                    >
                      View Link →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Bar */}
            <div className="mt-4 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                <button
                  className="btn btn-xs"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-xs ${
                      pagination.page === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: i + 1 }))
                    }
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-xs"
                  disabled={pagination.page === pagination.pages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 border border-orange-500 rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold text-orange-500 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Are you sure you want to delete this notification?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="btn btn-sm btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteModal.id)
                  setDeleteModal({ show: false, id: null })
                }}
                className="btn btn-sm btn-error text-xs"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
