// components/NotificationGroup.jsx
import { format } from 'date-fns'
import { NotificationItem } from './NotificationItem'
export const NotificationGroup = ({ date, notifications, onMarkRead }) => {
  const formatGroupTitle = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return format(date, 'dd MMM yyyy')
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 px-2">
        {formatGroupTitle(date)}
      </h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </div>
    </div>
  )
}


