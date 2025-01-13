import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';
import { Cloud } from "@/public/assets";
import { DocumentCheckIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import { processPDF } from "@/libs/pdf-processor";
import DocDetails from './DocDetails';
import Stepper from '../ui/Stepper';
import UploadDoneModel from '../ui/UploadDoneModel';

const MAX_FILE_SIZE = 1000 * 1024 * 1024; // 1000MB
const ALLOWED_FILE_TYPES = ['application/pdf'];

const UploadDoc = ({
  files,
  setFiles,
  removeFile,
  value = [],
  onChange,
  onFilesAdded,
}) => {
  const [showDocDetails, setShowDocDetails] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    current: 0,
    uploading: false
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isUploadDone, setIsUploadDone] = useState(false);

  const steps = ["Select Files", "Upload Files", "Generate Thumbnails", "Complete"];

  // Validate file
  const validateFile = async (file) => {
    try {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size should be less than 1000MB");
        return false;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Only PDF files are allowed");
        return false;
      }

      // Check if already selected
      const isDuplicate = selectedFiles.some(
        existingFile => existingFile.name === file.name
      );
      if (isDuplicate) {
        toast.error("This file is already selected");
        return false;
      }

      // Check total files limit
      if (selectedFiles.length >= 3) {
        toast.error("Maximum 3 files can be uploaded at once");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating file:', error);
      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (isUploading) {
      toast.error("Please wait for current upload to finish");
      return;
    }

    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error("Only PDF files are allowed");
      return;
    }

    try {
      // Validate each file
      for (const file of pdfFiles) {
        const isValid = await validateFile(file);
        if (!isValid) return;
      }

      // Create file objects with IDs
      const filesWithIds = pdfFiles.map(file => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        originalName: file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      }));

      setSelectedFiles(filesWithIds);
      setShowDocDetails(true);
    } catch (error) {
      console.error('Error handling files:', error);
      toast.error("Error handling files");
    }
  }, [isUploading]);

  const uploadFile = async (file, details, updateToast) => {
    try {
      // Process PDF with watermark and metadata
      const processedPdfBytes = await processPDF(file, {
        title: details.title || file.name,
        course: details.course || '',
        semester: details.semester || '',
        subject: details.subject?.subject_name || '',
        category: details.category || ''
      });
      
      // Convert processed PDF bytes to File object
      const processedFile = new File(
        [processedPdfBytes], 
        details.originalName || file.name,
        { type: 'application/pdf' }
      );

      // Show toast for getting signed URL
      const signedUrlToastId = toast.loading('Getting signed URL...');
      setActiveStep(1);

      // Request signed URL from the backend
      const response = await fetch("/api/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: processedFile.name,
          fileType: processedFile.type,
        }),
      });

      if (!response.ok) {
        toast.dismiss(signedUrlToastId);
        throw new Error("Failed to get signed URL");
      }

      const { url, key } = await response.json();
      toast.dismiss(signedUrlToastId);

      // Show toast for uploading file
      const uploadToastId = toast.loading(`Uploading file: ${file.name}`);
      setActiveStep(2);

      // Upload the file directly to Cloudflare R2
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": processedFile.type,
        },
        body: processedFile,
      });

      if (!uploadResponse.ok) {
        toast.dismiss(uploadToastId);
        throw new Error("Upload failed");
      }
      toast.dismiss(uploadToastId);

      // Show toast for generating thumbnail
      const thumbnailToastId = toast.loading('Generating thumbnail...');
      setActiveStep(3);

      // Generate thumbnail
      let thumbnailUrl = '/images/placeholders/pdf-placeholder.png';
      try {
        const thumbnailResponse = await fetch('/api/generate-thumbnail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`, key: details.id })
        });

        if (thumbnailResponse.ok) {
          const thumbnailResult = await thumbnailResponse.json();
          thumbnailUrl = thumbnailResult.thumbnailUrl;
        }
      } catch (thumbnailError) {
        console.error('Thumbnail generation error:', thumbnailError);
      }
      toast.dismiss(thumbnailToastId);

      return {
        url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
        thumbnailUrl,
        key
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (fileDetails) => {
    if (isUploading) {
      toast.error("Upload already in progress");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus({
        total: fileDetails.length,
        current: 0,
        uploading: true
      });

      // Process files sequentially
      const uploadResults = [];
      for (let i = 0; i < fileDetails.length; i++) {
        const detail = fileDetails[i];
        const fileObj = selectedFiles.find(f => f.id === detail.id);
        
        if (!fileObj) {
          console.error("File not found:", detail.id);
          continue;
        }

        setUploadStatus(prev => ({
          ...prev,
          current: i + 1
        }));

        const startTime = Date.now();

        // Upload file and get response
        const uploadResponse = await uploadFile(fileObj.file, {
          ...detail,
          course_name: detail.course,
          semester_code: detail.semester,
          subject_name: detail.subject?.subject_name,
          subject_code: detail.subject?.subject_code,
          originalName: fileObj.originalName
        }, (progress) => {
          const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
          const speed = (progress.loaded / elapsedTime / 1024).toFixed(2); // KB/s
          const estimatedTime = ((progress.total - progress.loaded) / (progress.loaded / elapsedTime)).toFixed(2); // in seconds

          toast.update(uploadToastId, {
            render: `Uploading file ${i + 1}/${fileDetails.length}: ${fileObj.name} (${(progress.loaded / 1024).toFixed(2)} KB / ${(progress.total / 1024).toFixed(2)} KB) - Speed: ${speed} KB/s - Estimated time: ${estimatedTime}s`,
            type: "loading",
            isLoading: true,
            autoClose: false,
            closeOnClick: false,
            draggable: false,
          });
        });

        uploadResults.push({
          ...uploadResponse,
          id: fileObj.id,
          name: fileObj.name,
          size: fileObj.size
        });
      }

      // Save all file details
      const saveResponse = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: uploadResults,
          fileDetails: fileDetails
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save file details');
      }

      toast.success("All files uploaded successfully!");
      setSelectedFiles([]);
      setShowDocDetails(false);
      setUploadStatus({
        total: 0,
        current: 0,
        uploading: false
      });
      setActiveStep(4);
      setIsUploadDone(true);

      // Update parent component if needed
      if (onChange) onChange(uploadResults);
      if (onFilesAdded) onFilesAdded(uploadResults);
      
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
      setUploadStatus(prev => ({
        ...prev,
        uploading: false
      }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    disabled: isUploading
  });

  return (
    <div className="w-full">
      <Stepper steps={steps} activeStep={activeStep} />
      {!showDocDetails ? (
        <div className="w-full">
          <div
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            {...getRootProps()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Cloud className="h-12 w-12 text-gray-400" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-400">PDF (MAX. 10MB)</p>
              <p className="text-sm md:text-xs text-gray-400">
                Please note that you are allowed to upload a maximum of 3 files.
              </p>
              <input {...getInputProps()} />
            </div>
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
              {selectedFiles.map((file) => (
                <div key={file.id} className="text-sm text-gray-400">
                  {file.originalName}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <DocDetails
          files={selectedFiles}
          onSubmit={handleSubmit}
          isSubmitting={isUploading}
        />
      )}
      <UploadDoneModel isOpen={isUploadDone} setIsOpen={setIsUploadDone} />
    </div>
  );
};

export default UploadDoc;
