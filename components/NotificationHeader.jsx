// components/NotificationHeader.jsx
import { Bell, CheckCheck } from 'lucide-react'
import {
  Download,
  ThumbsUp,
  Share2,
  Check,
  ArrowLeft,
} from 'lucide-react'
export const NotificationHeader = ({
  newNotificationsCount,
  hasUnread,
  onMarkAllRead,
  onBack,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={onBack} aria-label="Go Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Notifications</h1>
        </div>
        {hasUnread && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <CheckCheck className="w-5 h-5" />
            <span className="hidden md:inline">Mark all as read</span>
          </button>
        )}
      </div>
      {newNotificationsCount > 0 && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          {newNotificationsCount} new notification
          {newNotificationsCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

