'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { toast } from 'react-hot-toast'

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/v1/members/users/notifications')
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      await fetch('/api/v1/members/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId: notification.id,
        }),
      })

      // Navigate based on notification type
      if (notification.link) {
        router.push(notification.link)
      }
    } catch (error) {
      console.error('Error handling notification:', error)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading notifications...</div>
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
              notification.read ? 'bg-base-200' : 'bg-base-300'
            } hover:bg-base-300`}
          >
            {notification.image ? (
              <img
                src={notification.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            )}
            <div className="flex-1">
              <p className="text-sm">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(notification.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No notifications yet</div>
      )}
    </div>
  )
}

export default NotificationsList