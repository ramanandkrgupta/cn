"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Send,
  Users,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });

  // Form state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    image: "",
    link: "",
    type: "info", // info, success, warning, error
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchNotifications();
    fetchUsers();
  }, [session, router, pagination.page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      const response = await fetch(`/api/v1/admin/notifications?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/v1/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUsers.length || !notification.message) {
      toast.error("Please select users and enter a message");
      return;
    }

    try {
      const response = await fetch("/api/v1/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          ...notification,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      toast.success("Notification sent successfully");
      setNotification({ message: "", image: "", link: "", type: "info" });
      setSelectedUsers([]);
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/admin/notifications?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications Management
        </h1>
        <p className="text-gray-500">Send and manage notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="bg-base-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            <div>
              <label className="label">Message</label>
              <textarea
                value={notification.message}
                onChange={(e) =>
                  setNotification({ ...notification, message: e.target.value })
                }
                className="textarea textarea-bordered w-full h-32"
                placeholder="Enter notification message..."
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="label">Notification Type</label>
              <select
                value={notification.type}
                onChange={(e) =>
                  setNotification({ ...notification, type: e.target.value })
                }
                className="select select-bordered w-full"
              >
                <option value="info">Information</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="label">Image URL (Optional)</label>
              <div className="input-group">
                <input
                  type="url"
                  value={notification.image}
                  onChange={(e) =>
                    setNotification({ ...notification, image: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="btn btn-square"
                  onClick={() =>
                    setNotification({ ...notification, image: "" })
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Link URL */}
            <div>
              <label className="label">Link URL (Optional)</label>
              <div className="input-group">
                <input
                  type="url"
                  value={notification.link}
                  onChange={(e) =>
                    setNotification({ ...notification, link: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="https://example.com"
                />
                <button
                  type="button"
                  className="btn btn-square"
                  onClick={() => setNotification({ ...notification, link: "" })}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User Selection */}
            <div>
              <label className="label">Select Recipients</label>
              <div className="bg-base-100 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUsers(users.map((u) => u.id))}
                    className="btn btn-sm"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUsers([])}
                    className="btn btn-sm"
                  >
                    Clear All
                  </button>
                </div>
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center p-2 hover:bg-base-200 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                      className="checkbox checkbox-sm mr-2"
                    />
                    <span>{user.name || user.email}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({user.userRole})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedUsers.length || !notification.message}
              className="btn btn-primary w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </button>
          </form>
        </div>

        {/* Notifications List */}
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-base-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {notif.type === "info" && (
                      <Info className="w-5 h-5 text-blue-500" />
                    )}
                    {notif.type === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {notif.type === "warning" && (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    {notif.type === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{notif.message}</p>
                      <p className="text-sm text-gray-500">
                        Sent to: {notif.user.name || notif.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {notif.image && (
                  <img
                    src={notif.image}
                    alt="Notification image"
                    className="mt-2 rounded-lg max-w-xs"
                  />
                )}
                {notif.link && (
                  <a
                    href={notif.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                  >
                    View Link →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} notifications
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn btn-sm ${
                    pagination.page === i + 1 ? "btn-active" : ""
                  }`}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: i + 1 }))
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                disabled={pagination.page === pagination.pages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
