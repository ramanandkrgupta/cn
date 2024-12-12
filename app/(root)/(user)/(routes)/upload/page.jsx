"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEdgeStore } from "@/libs/edgestore";
import UploadDoc from "@/components/admin/components/UploadDoc";
import DocDetails from "@/components/admin/components/DocDetails";
import { processPDF } from "@/libs/pdf-processor";
import logoImg from "@/public/icons/icon.png";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { edgestore } = useEdgeStore();

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const handleFileSelect = async (selectedFiles) => {
    console.log("Selected files:", selectedFiles);
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

      console.log("Starting file upload with details:", fileDetails);
      toast.loading('Starting upload process...', { id: 'upload-process' });

      const uploadPromises = fileDetails.map(async (detail, index) => {
        const totalFiles = fileDetails.length;
        toast.loading(`Processing file ${index + 1} of ${totalFiles}: ${detail.file.name}...`, 
          { id: `upload-${detail.id}` });

        try {
          let fileToUpload = detail.file;

          // Process PDF with metadata
          if (detail.file.type === 'application/pdf') {
            const logoResponse = await fetch(logoImg.src);
            if (!logoResponse.ok) throw new Error('Failed to fetch logo');
            
            const logoData = await logoResponse.arrayBuffer();
            
            toast.loading(`Adding metadata and template to ${detail.file.name}...`, { id: `process-${detail.id}` });
            
            const processedPDF = await processPDF(detail.file, {
              logoData,
              title: detail.title,
              course: detail.course_name,
              semester: detail.semester_code,
              subject: detail.subject_name,
              category: detail.category
            });

            fileToUpload = new File([processedPDF], detail.file.name, { type: 'application/pdf' });
            toast.success(`PDF processed successfully`, { id: `process-${detail.id}` });
          }

          // Upload the processed file
          toast.loading(`Uploading ${detail.file.name}...`, { id: `upload-${detail.id}` });
          const res = await edgestore.publicFiles.upload({
            file: fileToUpload,
            options: {
              temporary: false,
            },
            onProgressChange: (progress) => {
              toast.loading(
                `Uploading ${detail.file.name}: ${Math.round(progress)}%`,
                { id: `upload-${detail.id}` }
              );
            },
          });

          toast.success(`${detail.file.name} uploaded successfully`, { id: `upload-${detail.id}` });
          return { ...res, hash: detail.hash };
        } catch (error) {
          toast.error(`Failed to process/upload ${detail.file.name}`, { id: `upload-${detail.id}` });
          throw error;
        }
      });

      const uploadRes = await Promise.all(uploadPromises);
      toast.success('All files uploaded successfully', { id: 'upload-process' });

      // Create post entries
      const formData = new FormData();
      
      const detailsForAPI = fileDetails.map((detail, index) => ({
        ...detail,
        course_name: detail.course,
        semester_code: detail.semester,
        subject_name: detail.subject.subject_name,
        subject_code: detail.subject.subject_code,
        file_name: detail.file.name,
        fileHash: detail.hash,
        file_url: uploadRes[index].url
      }));

      formData.append("fileDetails", JSON.stringify(detailsForAPI));
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
