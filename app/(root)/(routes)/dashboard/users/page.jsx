"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import {
  Users,
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Shield,
  Ban,
  FileText,
  Download,
  Clock,
  Calendar,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

// Add these constants at the top of the file, after the imports
const ROLES = [
  { value: "all", label: "All Roles" },
  { value: "FREE", label: "Free Users" },
  { value: "PRO", label: "Pro Users" },
  { value: "ADMIN", label: "Admins" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Members", icon: Clock },
  { value: "oldest", label: "Oldest Members", icon: Calendar },
  { value: "most-posts", label: "Most Posts", icon: FileText },
  { value: "most-downloads", label: "Most Downloads", icon: Download },
  { value: "reputation", label: "Highest Reputation", icon: Star },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
];

const VERIFICATION_OPTIONS = [
  { value: "all", label: "All Verification" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
];

// First, create a separate UsersTable component
const UsersTable = memo(({ users, onRoleChange, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>User</th>
            <th>Role</th>
            <th>Activity</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover">
              <th>1</th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span className="text-xl">
                        {user.name?.[0] || user.email[0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.name || "N/A"}</div>
                    <div className="text-sm opacity-50">{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <div
                  className={`badge ${
                    user.userRole === "PRO"
                      ? "badge-primary"
                      : user.userRole === "ADMIN"
                      ? "badge-secondary"
                      : "badge-ghost"
                  }`}
                >
                  {user.userRole}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{user._count.posts}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{user._count.downloads}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu menu-sm z-[100] p-2 shadow-lg bg-base-100 rounded-box w-48"
                  >
                    <li>
                      <button
                        onClick={() => onView(user.id)}
                        className="flex items-center px-4 py-2 hover:bg-base-200 rounded-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          onRoleChange(
                            user.id,
                            user.userRole === "PRO" ? "FREE" : "PRO"
                          )
                        }
                        className="flex items-center px-4 py-2 hover:bg-base-200 rounded-lg"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Toggle PRO
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="flex items-center px-4 py-2 hover:bg-base-200 rounded-lg text-error"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete User
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

UsersTable.displayName = "UsersTable";

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [tableLoading, setTableLoading] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [status, setStatus] = useState("all");
  const [verificationStatus, setVerificationStatus] = useState("all");

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [session, router, filterRole, pagination.page, sortBy]);

  // Improved debounced search
  const debouncedFetch = useCallback(
    debounce((searchValue) => {
      fetchUsers(searchValue);
    }, 800),
    [filterRole, pagination.page, sortBy]
  );

  // Update search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setTableLoading(true);
    if (value === "") {
      fetchUsers("");
    } else {
      debouncedFetch(value);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    fetchUsers("");
  };

  // Define fetchUsers first
  const fetchUsers = async (search = searchTerm) => {
    try {
      setTableLoading(true);
      const params = new URLSearchParams({
        search,
        role: filterRole,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
      });

      const response = await fetch(`/api/v1/admin/users?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch("/api/v1/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Add these handler functions
  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (e) => {
    setStatus(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleVerificationFilter = (e) => {
    setVerificationStatus(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            User Management
          </h1>
          <p className="text-gray-500">Manage and monitor user accounts</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </button>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-10 pr-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="select select-bordered"
            value={filterRole}
            onChange={handleRoleFilter}
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={status}
            onChange={handleStatusFilter}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={verificationStatus}
            onChange={handleVerificationFilter}
          >
            {VERIFICATION_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={sortBy}
            onChange={handleSort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table with loading state */}
      {tableLoading ? (
        <div className="w-full flex justify-center items-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <UsersTable
          users={users}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteUser}
          onView={(id) => router.push(`/dashboard/users/${id}`)}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <div className="text-sm text-gray-500">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} entries
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
  );
}
