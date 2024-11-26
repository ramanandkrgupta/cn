"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Download, ThumbsUp, Share2, Image } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/users/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch('/api/users/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        toast.success("Marked as read");
      } else {
        throw new Error("Failed to update notification");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(notification =>
          fetch('/api/users/notifications', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationId: notification.id }),
          })
        )
      );

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="w-5 h-5" />;
      case 'download':
        return <Download className="w-5 h-5" />;
      case 'share':
        return <Share2 className="w-5 h-5" />;
      case 'admin':
        return <Bell className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="btn btn-ghost btn-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-lg ${
                notification.read ? 'bg-base-200' : 'bg-base-300'
              }`}
            >
              <div className="text-primary">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                {notification.image && (
                  <div className="mt-2">
                    <Image
                      src={notification.image}
                      alt="Notification image"
                      width={200}
                      height={150}
                      className="rounded-lg"
                    />
                  </div>
                )}
                {notification.link && (
                  <a
                    href={notification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-1 inline-block"
                  >
                    Learn more →
                  </a>
                )}
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="btn btn-ghost btn-xs"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 