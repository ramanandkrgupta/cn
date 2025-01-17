'use client'

import { useState, useEffect } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import NotificationsList from './NotificationsList'

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/v1/members/users/notifications/unread-count', {
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setUnreadCount(data.count)
    } catch (error) {
      console.error('Error fetching notification count:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-4">
            <NotificationsList onNotificationRead={fetchUnreadCount} />
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell