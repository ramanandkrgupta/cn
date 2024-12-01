// full path /components/admin/components/UploadDoc.jsx
import { toast } from "sonner";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "@edgestore/react/utils";
import {
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Cloud } from "@/public/assets";
import { createHash } from 'crypto';

const UploadDoc = ({
  files,
  setFiles,
  removeFile,
  value,
  onChange,
  onFilesAdded,
}) => {
  const addWatermarkToPdf = async (file) => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const watermarkText = 'https://collegenotes.tech';
      const fontSize = 12;
      const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);

      // Top-left corner
      page.drawText(watermarkText, {
        x: 10,
        y: height - fontSize - 10,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.247, 0.149, 0.29),
        opacity: 0.8,
      });

      // Top-right corner
      page.drawText(watermarkText, {
        x: width - textWidth - 10,
        y: height - fontSize - 10,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.247, 0.149, 0.29),
        opacity: 0.8,
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes], file.name, { type: file.type });
  };

  const calculateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hash = createHash('sha256');
    hash.update(Buffer.from(buffer));
    return hash.digest('hex');
  };

  const checkDuplicate = async (hash) => {
    const response = await fetch(`/api/posts/check-duplicate?hash=${hash}`);
    const data = await response.json();
    return data.isDuplicate;
  };

  const validateFile = async (file) => {
    // Check file type
    if (!["application/pdf"].includes(file.type)) {
      toast.error("Only PDF files are supported");
      return false;
    }

    // Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return false;
    }

    // Calculate file hash
    const fileHash = await calculateFileHash(file);
    
    // Check for duplicates
    const isDuplicate = await checkDuplicate(fileHash);
    if (isDuplicate) {
      toast.error("This file has already been uploaded");
      return false;
    }

    return { isValid: true, hash: fileHash };
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const validation = await validateFile(file);
          if (!validation.isValid) {
            return null;
          }

          // Add watermark
          const watermarkedFile = await addWatermarkToPdf(file);
          
          return {
            file: watermarkedFile,
            hash: validation.hash
          };
        })
      );

      const validFiles = processedFiles.filter(Boolean);
      setFiles(prev => [...prev, ...validFiles]);
      return validFiles;
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const validFiles = await onDrop(acceptedFiles);

      if (validFiles && validFiles.length > 0) {
        const addedFiles = validFiles.map((file) => ({
          file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
        }));
        void onFilesAdded?.(addedFiles);
        void onChange?.([...(value ?? []), ...addedFiles]);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
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