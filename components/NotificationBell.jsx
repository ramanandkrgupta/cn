// components/NotificationBell.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const NotificationBell = () => {
  const { data: session, status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    // Only fetch notifications if the user is authenticated.
    if (!session) return

    try {
      const response = await fetch('/api/v1/members/users/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      const count = data.filter((n) => !n.read).length
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching notification count:', error)
    }
  }

  useEffect(() => {
    // Fetch notifications only when the user is authenticated.
    if (status === 'authenticated') {
      fetchUnreadCount()
    }
  }, [session, status])

  // If the user is not authenticated, don't show the notification bell.
  if (status !== 'authenticated') {
    return null
  }

  return (
    <Link
      href="/account/notifications"
      aria-label="Notifications"
      className="relative"
    >
      <Bell className="w-6 h-6 text-primary" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
