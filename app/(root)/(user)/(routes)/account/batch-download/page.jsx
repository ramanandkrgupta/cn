"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Download, FileCheck, Loader, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingState } from "@/components/ui/LoadingState";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";

export default function BatchDownload() {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    subject: "all",
  });
  const router = useRouter();
  const [processingFiles, setProcessingFiles] = useState(new Set());

  // Fetch available files
  useEffect(() => {
    if (session?.user?.role !== "PRO") {
      router.push("/account/plans");
      toast.error("Batch download is a PRO feature");
      return;
    }
    fetchFiles();
  }, [session]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/v1/members/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filters.type === "all" || file.type === filters.type;
    const matchesSubject =
      filters.subject === "all" || file.subject_code === filters.subject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const handleDownloadAll = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select files to download");
      return;
    }

    setDownloading(true);
    const toastId = toast.loading("Preparing files for download...");

    try {
      const response = await fetch("/api/v1/members/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Get filename from header
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `study-materials-${Date.now()}.zip`;

      // Download using blob
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      // Use saveAs directly
      saveAs(blob, filename);
      toast.success("Files downloaded successfully!", { id: toastId });
      setSelectedFiles([]); // Reset selection after download
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download files", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  if (loading) return <LoadingState message="Loading available files..." />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batch Download</h1>
        <button
          onClick={handleDownloadAll}
          disabled={downloading || !selectedFiles.length}
          className="btn btn-primary"
        >
          {downloading ? (
            <>
              <Loader className="animate-spin mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2" />
              Download Selected ({selectedFiles.length})
            </>
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="select select-bordered"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">DOC</option>
        </select>
        <select
          value={filters.subject}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, subject: e.target.value }))
          }
          className="select select-bordered"
        >
          <option value="all">All Subjects</option>
          {/* Add subject options dynamically */}
        </select>
      </div>

      {/* File Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-base-200 p-4 rounded-lg cursor-pointer transition-all
              ${selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""}
              ${processingFiles.has(file.id) ? "opacity-50" : ""}
              hover:bg-base-300`}
            onClick={() =>
              !processingFiles.has(file.id) && toggleFileSelection(file.id)
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{file.title}</h3>
                <p className="text-sm text-gray-500">{file.subject_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-base-300 px-2 py-1 rounded">
                    {file.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{file.size}</span>
                </div>
              </div>
              {processingFiles.has(file.id) ? (
                <Loader className="animate-spin text-primary" />
              ) : (
                selectedFiles.includes(file.id) && (
                  <FileCheck className="text-primary" />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No files match your search criteria</p>
        </div>
      )}
    </div>
  );
}
