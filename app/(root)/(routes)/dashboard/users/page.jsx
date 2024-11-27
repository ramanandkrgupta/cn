"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [session, router, filterRole, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        role: filterRole,
        page: pagination.page,
        limit: pagination.limit,
      });

      const response = await fetch(`/api/admin/users?${params}`);
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
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch("/api/admin/users", {
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
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
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

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="FREE">Free Users</option>
            <option value="PRO">Pro Users</option>
            <option value="ADMIN">Admins</option>
          </select>
          <button className="btn btn-square btn-ghost">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      {/* <div className="bg-base-200 rounded-lg overflow-hidden"> */}
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
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <MoreVertical className="w-4 h-4" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a
                            onClick={() =>
                              router.push(`/dashboard/users/${user.id}`)
                            }
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            View Details
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={() =>
                              handleRoleChange(
                                user.id,
                                user.userRole === "PRO" ? "FREE" : "PRO"
                              )
                            }
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Toggle PRO
                          </a>
                        </li>
                        <li>
                          <a
                            className="text-error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete User
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        {/* </div> */}

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
    </div>
  );
}
