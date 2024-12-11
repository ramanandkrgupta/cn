"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEdgeStore } from "@/libs/edgestore";
import UploadDoc from "@/components/admin/components/UploadDoc";
import DocDetails from "@/components/admin/components/DocDetails";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { edgestore } = useEdgeStore();

  const handleFileUpload = async (fileDetails) => {
    try {
      if (!session?.user) {
        toast.error("Please login to upload files");
        return;
      }

      // Show upload progress
      toast.loading("Uploading files...");

      // Upload files to EdgeStore
      const uploadPromises = files.map(async (file) => {
        try {
          const res = await edgestore.publicFiles.upload({
            file: file.file,
            options: {
              temporary: false,
            },
            onProgressChange: (progress) => {
              // You can use this to show upload progress
              console.log("Upload progress:", progress);
            },
          });
          return res;
        } catch (error) {
          console.error("File upload error:", error);
          throw new Error(`Failed to upload ${file.file.name}`);
        }
      });

      const uploadRes = await Promise.all(uploadPromises);

      // Create FormData for post creation
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
        toast.success("Files uploaded successfully");
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
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to upload files</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>

      {/* File Upload Section */}
      <div className="mb-8">
        <UploadDoc
          files={files}
          setFiles={setFiles}
          removeFile={removeFile}
          value={uploadedFiles}
          onChange={setUploadedFiles}
          onFilesAdded={setUploadedFiles}
        />
      </div>

      {/* Document Details Section */}
      {files.length > 0 && (
        <DocDetails files={files} onSubmit={handleFileUpload} />
      )}
    </div>
  );
}
