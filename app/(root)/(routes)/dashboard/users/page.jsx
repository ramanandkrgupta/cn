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
const UsersTable = memo(({ users, onRoleChange, onDelete, onView, startIndex }) => {
  return (
    <div className="overflow-x-auto bg-base-100 border border-base-200 rounded-lg">
      <table className="table table-sm w-full">
        <thead className="bg-base-200/50 text-xs uppercase font-mono text-base-content/60">
          <tr>
            <th className="font-normal w-12">#</th>
            <th className="font-normal">User Identity</th>
            <th className="font-normal">Role</th>
            <th className="font-normal">Activity (Posts | DLs)</th>
            <th className="font-normal">Joined</th>
            <th className="font-normal text-right pr-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-base-50 transition-colors border-b border-base-100 last:border-0">
              <th className="font-mono text-xs font-normal opacity-50">{startIndex + index + 1}</th>
              <td>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-base-content">{user.name || "N/A"}</span>
                  <span className="font-mono text-xs text-base-content/50">{user.email}</span>
                </div>
              </td>
              <td>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${user.userRole === "PRO"
                  ? "border-primary text-primary"
                  : user.userRole === "ADMIN"
                    ? "border-secondary text-secondary"
                    : "border-base-300 text-base-content/60"
                  }`}>
                  {user.userRole}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span title="Posts">P: {user._count.posts}</span>
                  <span className="opacity-30">|</span>
                  <span title="Downloads">D: {user._count.downloads}</span>
                </div>
              </td>
              <td>
                <span className="text-xs font-mono opacity-70">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <div className="tooltip tooltip-left" data-tip="View Details">
                    <button
                      onClick={() => onView(user.id)}
                      className="btn btn-ghost btn-xs btn-square hover:bg-base-200"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="tooltip tooltip-left" data-tip={user.userRole === "PRO" ? "Revoke PRO" : "Make PRO"}>
                    <button
                      onClick={() =>
                        onRoleChange(
                          user.id,
                          user.userRole === "PRO" ? "FREE" : "PRO"
                        )
                      }
                      className={`btn btn-ghost btn-xs btn-square ${user.userRole === "PRO"
                        ? "text-primary"
                        : "text-base-content/40 hover:text-primary"
                        }`}
                    >
                      <Shield className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="tooltip tooltip-left" data-tip="Delete User">
                    <button
                      onClick={() => onDelete(user.id)}
                      className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
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
    limit: 20,
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

  // Calculate start index for the table
  const startIndex = (pagination.page - 1) * pagination.limit;

  return (
    <div className="container mx-auto px-0 py-2 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            User Management
          </h1>
          <p className="text-xs md:text-sm text-base-content/60 mt-1">Manage and monitor accounts</p>
        </div>
        <button className="btn btn-primary btn-sm md:btn-md w-full md:w-auto shadow-lg hover:shadow-primary/20">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </button>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 bg-base-100 p-2 mx-2 md:mx-0 rounded-lg border border-base-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="input input-sm input-bordered w-full pl-9 pr-8 bg-base-50 focus:bg-base-100 transition-all font-mono text-xs md:text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-error"
            >
              ×
            </button>
          )}
        </div>

        {/* Mobile: Grid for filters, Desktop: Flex */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
          <select
            className="select select-sm select-bordered bg-base-50 w-full md:w-auto text-xs"
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
            className="select select-sm select-bordered bg-base-50 w-full md:w-auto text-xs"
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
            className="select select-sm select-bordered bg-base-50 w-full md:w-auto text-xs"
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
            className="select select-sm select-bordered bg-base-50 w-full md:w-auto text-xs"
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
        <div className="w-full flex justify-center items-center py-20">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : (
        <UsersTable
          users={users}
          startIndex={startIndex}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteUser}
          onView={(id) => router.push(`/dashboard/users/${id}`)}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-base-100 p-3 rounded-lg border border-base-200 gap-3">
        <div className="text-xs text-base-content/60 hidden md:block">
          <span className="font-semibold text-base-content">{(pagination.page - 1) * pagination.limit + 1}</span> -{" "}
          <span className="font-semibold text-base-content">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
          <span className="font-semibold text-base-content">{pagination.total}</span>
        </div>
        <div className="join w-full justify-center md:w-auto">
          <button
            className="join-item btn btn-sm bg-base-100 flex-1 md:flex-none"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Prev
          </button>
          <button className="join-item btn btn-sm bg-primary text-primary-content pointer-events-none px-4">
            {pagination.page}
          </button>
          <button
            className="join-item btn btn-sm bg-base-100 flex-1 md:flex-none"
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
