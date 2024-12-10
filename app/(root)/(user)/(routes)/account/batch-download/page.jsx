"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Download, FileCheck, Loader } from "lucide-react";
import { toast } from "sonner";

export default function BatchDownload() {
  const { data: session } = useSession();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select files to download");
      return;
    }

    setDownloading(true);
    try {
      // API call to download multiple files
      const response = await fetch("/api/v1/members/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "study-materials.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Files downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download files");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Batch Download</h1>
      
      {/* File Selection */}
      <div className="grid gap-4 mb-6">
        {/* Add file selection UI */}
      </div>

      {/* Download Button */}
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
  );
} 