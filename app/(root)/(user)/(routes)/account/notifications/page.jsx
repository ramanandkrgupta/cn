"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Bell,
  Download,
  ThumbsUp,
  Share2,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse space-y-6">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-600 rounded"></div>
        <div className="h-8 w-48 bg-gray-600 rounded"></div>
      </div>
      <div className="w-32 h-8 bg-gray-600 rounded"></div>
    </div>

    {/* Notifications Skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-base-200 p-5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="w-24 h-8 bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/v1/members/users/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch("/api/v1/members/users/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
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
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((notification) =>
          fetch("/api/v1/members/users/notifications", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationId: notification.id }),
          })
        )
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="w-5 h-5 text-blue-500" />;
      case "download":
        return <Download className="w-5 h-5 text-green-500" />;
      case "share":
        return <Share2 className="w-5 h-5 text-yellow-500" />;
      case "admin":
        return <Bell className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} aria-label="Go Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Notifications</h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <CheckCheck className="w-5 h-5" />
            <span className="hidden md:inline">Mark all as read</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 md:p-5 rounded-lg shadow-md border ${
                notification.read
                  ? "bg-base-300 border-gray-200"
                  : "bg-base-200 border-gray-300"
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
                    onClick={() => markAsRead(notification.id)}
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
          ))
        )}
      </div>
    </div>
  );
}
