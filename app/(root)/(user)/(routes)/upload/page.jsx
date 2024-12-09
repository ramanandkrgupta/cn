"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEdgeStore } from "@/libs/edgestore";
import { calculateFileHash } from "@/libs/file-utils";
import UploadDoc from "@/components/admin/components/UploadDoc";
import DocDetails from "@/components/admin/components/DocDetails";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { edgestore } = useEdgeStore();

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const handleFileSelect = async (selectedFiles) => {
    console.log("Selected files:", selectedFiles); // Debug log
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setShowDetails(true);
    }
  };

  const handleFileUpload = async (fileDetails) => {
    try {
      if (!session?.user) {
        toast.error("Please login to upload files");
        return;
      }

      console.log("Starting file upload with details:", fileDetails); // Debug log

      toast.loading("Uploading files...");

      // Upload files to EdgeStore and calculate hashes
      const uploadPromises = fileDetails.map(async (detail, index) => {
        console.log(`Processing upload for file ${index}:`, detail); // Debug log

        try {
          // Calculate file hash
          const hash = await calculateFileHash(detail.file);
          console.log(`File hash calculated for ${detail.file_name}:`, hash); // Debug log

          // Check for duplicates
          const dupCheck = await fetch(
            `/api/posts/check-duplicate?hash=${hash}`
          );
          const dupData = await dupCheck.json();
          console.log("Duplicate check result:", dupData); // Debug log

          if (dupData.isDuplicate) {
            throw new Error(
              `File '${detail.file_name}' has already been uploaded`
            );
          }

          // Upload to EdgeStore
          console.log(`Starting EdgeStore upload for ${detail.file_name}`); // Debug log
          const res = await edgestore.publicFiles.upload({
            file: detail.file,
            options: {
              temporary: false,
            },
            onProgressChange: (progress) => {
              console.log(`Upload progress for ${detail.file_name}:`, progress);
            },
          });

          console.log("EdgeStore upload response:", res); // Debug log

          const uploadResult = {
            ...res,
            hash,
            filename: detail.file_name,
            url: res.url || res.accessUrl,
            accessUrl: res.accessUrl,
            file: detail.file,
          };

          console.log("EdgeStore raw response:", res);
          console.log("Formatted upload result:", uploadResult);

          return uploadResult;
        } catch (error) {
          console.error(`Upload error for ${detail.file_name}:`, error); // Debug log
          throw new Error(
            `Failed to upload ${detail.file_name}: ${error.message}`
          );
        }
      });

      const uploadRes = await Promise.all(uploadPromises);
      console.log("All upload results:", uploadRes); // Debug log

      // Create post entries
      const formData = new FormData();
      formData.append("fileDetails", JSON.stringify(fileDetails));
      formData.append("userEmail", session.user.email);
      formData.append("uploadRes", JSON.stringify(uploadRes));

      console.log("Sending to API:", {
        fileDetails,
        uploadRes,
      }); // Debug log

      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API error response:", error); // Debug log
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      console.log("API success response:", data); // Debug log

      if (data.success) {
        toast.dismiss();
        toast.success("Files uploaded successfully and pending moderation");
        router.push("/dashboard");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Upload error details:", error); // Debug log
      toast.error(error.message || "Failed to upload files");
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setShowDetails(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to upload files</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Title and description */}
      <div className="flex-col items-center mt-5">
        <h3 className="text-secondary text-3xl font-extrabold text-center">
          Upload document
        </h3>
        <p className="text-secondary mt-2 text-sm font-medium text-center align-bottom mb-2">
          Upload your summaries and other study documents to Notes Mates
        </p>
      </div>

      {/* Upload section */}
      <div className="bg-[#1d232a] p-3 rounded-lg mt-5 border border-orange-400 w-full max-h-[490px] mb-5 overflow-auto">
        {!showDetails ? (
          <UploadDoc
            files={files}
            setFiles={setFiles}
            removeFile={removeFile}
            value={uploadedFiles}
            onChange={setUploadedFiles}
            onFilesAdded={handleFileSelect}
          />
        ) : (
          <DocDetails files={files} onSubmit={handleFileUpload} />
        )}
      </div>

      {/* Navigation buttons */}
      {showDetails && (
        <div className="md:w-full md:flex md:justify-end">
          <button
            onClick={() => setShowDetails(false)}
            className="btn bg-[#1d232a] text-white w-[11rem] text-center border-orange-400 border hover:border-orange-400 right-0 mr-2"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
