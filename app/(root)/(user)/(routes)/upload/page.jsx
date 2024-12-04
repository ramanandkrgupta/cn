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

      toast.loading("Uploading files...");

      // Upload files to EdgeStore and calculate hashes
      const uploadPromises = files.map(async (file) => {
        try {
          // Calculate file hash
          const hash = await calculateFileHash(file.file);

          // Check for duplicates
          const dupCheck = await fetch(
            `/api/posts/check-duplicate?hash=${hash}`
          );
          const dupData = await dupCheck.json();

          if (dupData.isDuplicate) {
            throw new Error(
              `File '${file.file.name}' has already been uploaded`
            );
          }

          // Upload to EdgeStore
          const res = await edgestore.publicFiles.upload({
            file: file.file,
            options: {
              temporary: false,
            },
            onProgressChange: (progress) => {
              console.log("Upload progress:", progress);
            },
          });

          return {
            ...res,
            hash,
            filename: file.file.name,
          };
        } catch (error) {
          console.error("File upload error:", error);
          throw new Error(
            `Failed to upload ${file.file.name}: ${error.message}`
          );
        }
      });

      const uploadRes = await Promise.all(uploadPromises);

      // Create post entries
      const formData = new FormData();
      formData.append("fileDetails", JSON.stringify(fileDetails));
      formData.append("userEmail", session.user.email);
      formData.append("uploadRes", JSON.stringify(uploadRes));

      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();

      if (data.success) {
        toast.dismiss();
        toast.success("Files uploaded successfully and pending moderation");
        router.push("/dashboard");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Upload error:", error);
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
