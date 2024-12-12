import toast from "react-hot-toast";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "@edgestore/react/utils";
import { v4 as uuidv4 } from 'uuid';
import { Cloud } from "@/public/assets";
import { DocumentCheckIcon, DocumentTextIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "lucide-react";

const UploadDoc = ({
  files,
  setFiles,
  removeFile,
  value,
  onChange,
  onFilesAdded,
}) => {
  const createId = () => uuidv4();

  // Validate file
  const validateFile = async (file) => {
    // Check file type
    if (!["application/pdf"].includes(file.type)) {
      toast.error("Only PDF files are supported");
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 100000 * 1024 * 1024) {
      toast.error("File size should be less than 100000 MB");
      return false;
    }

    try {
      // Calculate file hash
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Check for duplicates
      const response = await fetch(
        `/api/v1/members/posts/check-duplicate?hash=${hashHex}`
      );
      const data = await response.json();
      
      if (data.isDuplicate) {
        toast.error("This file has already been uploaded");
        return false;
      }

      return { isValid: true, hash: hashHex };
    } catch (error) {
      console.error("Error validating file:", error);
      toast.error("Error processing file");
      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      toast.loading('Validating files...', { id: 'prepare-files' });
      
      const processedFiles = await Promise.all(acceptedFiles.map(async (file) => {
        const fileId = createId();

        // Only validate file type, size and check for duplicates
        const validationResult = await validateFile(file);
        if (!validationResult) return null;

        return {
          file,
          id: fileId,
          hash: validationResult.hash,
          originalName: file.name.replace(/\.[^/.]+$/, '')
        };
      }));

      toast.dismiss('prepare-files');

      const validFiles = processedFiles.filter(Boolean);
      if (validFiles.length > 0) {
        setFiles(validFiles);
        onFilesAdded(validFiles);
        toast.success(`${validFiles.length} files ready for details`);
      }
    } catch (error) {
      console.error('Error validating files:', error);
      toast.error('Error validating files');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 3
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
        {...getRootProps()}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Cloud />
          <p className="mb-2 text-sm text-gray-400 hidden md:flex">
            <span className="font-semibold">Click to upload</span>&nbsp;or&nbsp;
            <span className="font-semibold">Drag & Drop files</span>
          </p>
          <a className="btn bg-black md:hidden flex mb-2 text-white">
            Browse my files
          </a>
          <p className="text-sm md:text-xs text-gray-400">
            Supported file : pdf, doc, docx, pptx
          </p>
          <p className="text-sm md:text-xs text-gray-400">
            Please note that you are allowed to upload a maximum of 3 files.
          </p>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...getInputProps()}
          />
        </div>
      </div>
      {value?.map((file, index) => (
        <div
          key={index}
          className="flex h-16 w-full max-w-[100vw] flex-col justify-center rounded border border-gray-300 px-4 py-2 mt-2"
        >
          <div className="flex items-center gap-2 text-white">
            <DocumentTextIcon className="text-gray-400 w-6 h-6 shrink" />
            <div className="min-w-0 text-sm">
              <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {file.file.name}
              </div>
              <div className="text-xs text-gray-400">
                {formatFileSize(file.file.size)}
              </div>
            </div>
            <div className="grow" />
            <div className="flex w-12 justify-end text-xs cursor-pointer">
              {file.progress === "PENDING" ? (
                <button
                  className="rounded-md p-1 transition-colors duration-200 text-gray-400 hover:text-white w-5"
                  onClick={() => removeFile(index)}
                >
                  <TrashIcon className="shrink-0 w-5" />
                </button>
              ) : file.progress === "ERROR" ? (
                <ExclamationCircleIcon className="shrink-0 text-red-400 w-6" />
              ) : file.progress !== "COMPLETE" ? (
                <div className="cursor-wait">{Math.round(file.progress)}%</div>
              ) : (
                <DocumentCheckIcon className="shrink-0 text-gray-400 w-6" />
              )}
            </div>
          </div>
          {typeof file.progress === "number" && (
            <div className="relative h-0">
              <div className="absolute top-1 h-1 w-full overflow-clip rounded-full bg-gray-700 ">
                <div
                  className="h-full transition-all duration-300 ease-in-out bg-white"
                  style={{
                    width: file.progress ? `${file.progress}%` : "0%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadDoc;
