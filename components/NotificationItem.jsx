// components/NotificationItem.jsx
import { ThumbsUp, Download, Share2, Bell, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const NotificationItem = ({ notification, onMarkRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="w-5 h-5 text-blue-500" />
      case 'download':
        return <Download className="w-5 h-5 text-green-500" />
      case 'share':
        return <Share2 className="w-5 h-5 text-yellow-500" />
      case 'admin':
        return <Bell className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div
      className={`p-4 md:p-5 rounded-lg shadow-md border ${
        notification.read
          ? 'bg-base-300 border-gray-200'
          : 'bg-base-200 border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div>{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="shrink-0 text-blue-600 hover:text-blue-800 text-sm"
          >
            <span className="hidden md:inline">Mark as read</span>
            <Check className="w-5 h-5 md:hidden" />
          </button>
        )}
      </div>

      {notification.image && (
        <div className="mt-3">
          <img
            src={notification.image}
            alt="Notification"
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      )}
      {notification.link && (
        <a
          href={notification.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-sm text-blue-600 hover:underline"
        >
          Learn more →
        </a>
      )}
    </div>
  )
}
