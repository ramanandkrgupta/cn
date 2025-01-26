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
  const [newNotificationsCount, setNewNotificationsCount] = useState(0)
  const [hasLeftPage, setHasLeftPage] = useState(false)

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Handle page visibility and unload
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

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/v1/members/users/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      const unreadCount = data.filter((n) => !n.read).length

      setNewNotificationsCount(unreadCount)
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

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

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)
      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch('/api/v1/members/users/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: notification.id }),
          })
        )
      )

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

  const markAllUnreadInBackground = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)
      if (unreadNotifications.length === 0) return

      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch('/api/v1/members/users/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: notification.id }),
          })
        )
      )
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const groupNotificationsByDate = () => {
    const groups = {}
    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
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

  const groupedNotifications = groupNotificationsByDate()
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
    </div>
  )
}
