// components/NotificationBell.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'

export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
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
    fetchUnreadCount()
    // Set up polling for new notifications
    // const interval = setInterval(fetchUnreadCount) // Poll every 30 seconds
    // return () => clearInterval(interval)
  }, [])

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
