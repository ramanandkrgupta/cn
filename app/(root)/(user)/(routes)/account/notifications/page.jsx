'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Bell } from 'lucide-react'
import { NotificationHeader } from '@/components/NotificationHeader'
import { NotificationGroup } from '@/components/NotificationGroup'
import { SkeletonLoading } from '@/components/SkeletonLoading'

export default function Notifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newNotificationsCount, setNewNotificationsCount] = useState(0)
  const [hasLeftPage, setHasLeftPage] = useState(false)

  // Initial load: only notifications from the past 2 days.
  useEffect(() => {
    fetchNotifications({ isInitial: true })
  }, [])

  // Handle page visibility and unload to mark notifications as read in background.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasLeftPage) {
        setHasLeftPage(true)
        markAllUnreadInBackground()
      }
    }

    const handleBeforeUnload = () => {
      if (!hasLeftPage) {
        setHasLeftPage(true)
        markAllUnreadInBackground()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (!hasLeftPage) markAllUnreadInBackground()
    }
  }, [hasLeftPage, notifications])

  // Fetch notifications with support for pagination.
  // If "isInitial" is true, we load notifications from the past 2 days.
  // If a "before" date is provided, we load notifications older than that.
  const fetchNotifications = async ({ isInitial, before } = {}) => {
    try {
      let url = '/api/v1/members/users/notifications?limit=20'
      if (isInitial) {
        // Get only notifications from the past 2 days for the initial load.
        url += '&recent=true'
      }
      if (before) {
        url += `&before=${encodeURIComponent(before)}`
      }
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()

      // On the initial load, update the unread notifications count.
      if (isInitial) {
        const unreadCount = data.filter((n) => !n.read).length
        setNewNotificationsCount(unreadCount)
      }

      // If fewer notifications than requested were returned, assume there are no more to load.
      if (data.length < 20) {
        setHasMore(false)
      }

      // Append notifications if this is a paginated request; otherwise, replace the list.
      if (before) {
        setNotifications((prev) => [...prev, ...data])
      } else {
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      if (isInitial) setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more notifications when "Show More" is clicked.
  const loadMore = () => {
    if (!notifications.length) return
    setLoadingMore(true)
    // Use the createdAt date of the last (oldest) notification as the cursor.
    const oldestNotification = notifications[notifications.length - 1]
    fetchNotifications({ before: oldestNotification.createdAt })
  }

  // Mark a single notification as read.
  const markAsRead = async (id) => {
    try {
      const response = await fetch('/api/v1/members/users/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        )
        toast.success('Marked as read')
      } else {
        throw new Error('Failed to update notification')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to update notification')
    }
  }

  // Mark all notifications as read using the batch endpoint.
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)
      const ids = unreadNotifications.map((notification) => notification.id)
      if (ids.length === 0) return

      const response = await fetch(
        '/api/v1/members/users/notifications/batch',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationIds: ids }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update notifications')
      }

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      )
      setNewNotificationsCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to update notifications')
    }
  }

  // Mark all unread notifications as read in the background using the batch endpoint.
  const markAllUnreadInBackground = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)
      const ids = unreadNotifications.map((notification) => notification.id)
      if (ids.length === 0) return

      await fetch('/api/v1/members/users/notifications/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: ids }),
      })
    } catch (error) {
      console.error('Error marking notifications as read in background:', error)
    }
  }

  // Group notifications by their creation date.
  const groupNotificationsByDate = (notifications) => {
    const groups = {}
    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt).toDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(notification)
    })

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, notifications]) => ({
        date: new Date(date),
        notifications,
      }))
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <SkeletonLoading />
      </div>
    )
  }

  const groupedNotifications = groupNotificationsByDate(notifications)
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <NotificationHeader
        newNotificationsCount={newNotificationsCount}
        hasUnread={hasUnread}
        onMarkAllRead={markAllAsRead}
        onBack={() => router.back()}
      />

      <div className="space-y-8 mt-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          groupedNotifications.map(({ date, notifications }) => (
            <NotificationGroup
              key={date.toISOString()}
              date={date}
              notifications={notifications}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-orange-500 text-white rounded-full disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  )
}
