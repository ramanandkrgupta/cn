"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  PlusCircle,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  FileText,
  Video,
  School,
  GraduationCap,
  Clock,
  TrendingUp,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import SubjectModal from "./components/SubjectModal";
import { courses } from "@/constants";
import debounce from "lodash/debounce";

// First, create a separate SubjectsTable component
const SubjectsTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="bg-base-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Content</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>
                  <div>
                    <div className="font-bold">{subject.subject_name}</div>
                    <div className="text-sm opacity-50">
                      Code: {subject.subject_code}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {subject.course_name}
                  </div>
                </td>
                <td>{subject.semester_code}</td>
                <td>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">
                        {subject._count.posts}
                      </span>
                      <span className="text-xs text-gray-500">posts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span className="font-medium">
                        {subject._count.videos}
                      </span>
                      <span className="text-xs text-gray-500">videos</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    {subject.User?.name || subject.User?.email || "N/A"}
                  </div>
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
                        <a onClick={() => onEdit(subject)}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-error"
                          onClick={() => onDelete(subject.id)}
                        >
                          <Trash className="w-4 h-4" />
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function SubjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalCourses: 0,
    courseDistribution: [],
    totalContent: { posts: 0, videos: 0 },
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  // Sort options
  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)", icon: ArrowUpDown },
    { value: "name-desc", label: "Name (Z-A)", icon: ArrowUpDown },
    { value: "newest", label: "Recently Added", icon: Clock },
    { value: "oldest", label: "Oldest First", icon: Calendar },
    { value: "most-content", label: "Most Content", icon: TrendingUp },
    { value: "least-content", label: "Least Content", icon: TrendingUp },
  ];

  // Define fetchSubjects first
  const fetchSubjects = async (search = searchTerm) => {
    try {
      setTableLoading(true);
      const params = new URLSearchParams({
        search,
        course: filterCourse,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
      });

      const response = await fetch(`/api/v1/admin/subjects?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();
      setSubjects(data.subjects);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setTableLoading(false);
    }
  };

  // Improved debounced search with longer delay
  const debouncedFetch = useCallback(
    debounce((searchValue) => {
      fetchSubjects(searchValue);
    }, 800), // Increased delay to 800ms
    [filterCourse, pagination.page, sortBy]
  );

  // Update search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setTableLoading(true); // Show loading immediately
    if (value === "") {
      fetchSubjects("");
    } else {
      debouncedFetch(value);
    }
  };

  // Clear search and reset
  const handleClearSearch = () => {
    setSearchTerm("");
    fetchSubjects("");
  };

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchSubjects();
  }, [session, router, filterCourse, pagination.page, sortBy]);

  const handleDeleteSubject = async (subjectId) => {
    if (!confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/admin/subjects?subjectId=${subjectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete subject");
      }

      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error(error.message || "Failed to delete subject");
    }
  };

  const handleSubjectSubmit = async (formData) => {
    try {
      const url = editingSubject
        ? "/api/v1/admin/subjects"
        : "/api/v1/admin/subjects";

      const method = editingSubject ? "PUT" : "POST";
      const data = editingSubject
        ? { ...formData, id: editingSubject.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save subject");
      }

      toast.success(editingSubject ? "Subject updated" : "Subject created");
      setIsModalOpen(false);
      setEditingSubject(null);
      fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error(error.message || "Failed to save subject");
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Subject Management
          </h1>
          <p className="text-gray-500">Manage and organize course subjects</p>
        </div>
        <button
          onClick={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary w-full md:w-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Subject
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-medium">Total Subjects</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalSubjects}</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <School className="w-5 h-5 text-secondary" />
            <span className="font-medium">Total Courses</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalCourses}</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-accent" />
            <span className="font-medium">Total Posts</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalContent.posts}</p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-info" />
            <span className="font-medium">Total Videos</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalContent.videos}</p>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects..."
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
        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.link}>
                {course.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table with loading state */}
      {tableLoading ? (
        <div className="w-full flex justify-center items-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <SubjectsTable
          subjects={subjects}
          onEdit={(subject) => {
            setEditingSubject(subject);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteSubject}
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

      {/* Subject Modal */}
      {isModalOpen && (
        <SubjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubject(null);
          }}
          subject={editingSubject}
          onSubmit={handleSubjectSubmit}
        />
      )}
    </div>
  );
}
