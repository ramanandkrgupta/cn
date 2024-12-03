import { toast } from "sonner";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "@edgestore/react/utils";
import { createHash } from "crypto";
import {
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Cloud } from "@/public/assets";

const UploadDoc = ({
  files,
  setFiles,
  removeFile,
  value,
  onChange,
  onFilesAdded,
}) => {
  // Calculate file hash for duplicate detection
  const calculateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  // Check for duplicate files
  const checkDuplicate = async (hash) => {
    try {
      const response = await fetch(`/api/posts/check-duplicate?hash=${hash}`);
      const data = await response.json();
      return data.isDuplicate;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };

  // Add watermark to PDF
  const addWatermarkToPdf = async (file) => {
    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes, {
        ignoreEncryption: true,
      });
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const watermarkText = "collegenotes.tech";
        const fontSize = 12;
        const textWidth = helveticaFont.widthOfTextAtSize(
          watermarkText,
          fontSize
        );

        // Add watermark in multiple positions without rotation
        const positions = [
          // Top-left
          { x: 10, y: height - fontSize - 10 },
          // Top-right
          { x: width - textWidth - 10, y: height - fontSize - 10 },
          // Bottom-left
          { x: 10, y: 10 },
          // Bottom-right
          { x: width - textWidth - 10, y: 10 },
          // Center
          { x: (width - textWidth) / 2, y: height / 2 },
        ];

        // Add diagonal watermarks
        for (let i = 0; i < height; i += 150) {
          page.drawText(watermarkText, {
            x: 20,
            y: i,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0.75, 0.75, 0.75),
            opacity: 0.3,
          });
        }

        // Add standard positions watermarks
        positions.forEach((pos) => {
          page.drawText(watermarkText, {
            x: pos.x,
            y: pos.y,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0.75, 0.75, 0.75),
            opacity: 0.3,
          });
        });
      });

      const pdfBytes = await pdfDoc.save();
      return new File([pdfBytes], file.name, { type: file.type });
    } catch (error) {
      console.error("Error adding watermark:", error);
      throw new Error(`Error processing ${file.name}: ${error.message}`);
    }
  };

  // Validate file
  const validateFile = async (file) => {
    // Check file type
    if (!["application/pdf"].includes(file.type)) {
      toast.error("Only PDF files are supported");
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return false;
    }

    try {
      // Calculate file hash
      const fileHash = await calculateFileHash(file);

      // Check for duplicates
      const isDuplicate = await checkDuplicate(fileHash);
      if (isDuplicate) {
        toast.error("This file has already been uploaded");
        return false;
      }

      return { isValid: true, hash: fileHash };
    } catch (error) {
      console.error("Error validating file:", error);
      toast.error("Error processing file");
      return false;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 3) {
        toast.error("You can only upload up to three files.");
        return [];
      }

      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            if (files.some((existingFile) => existingFile.name === file.name)) {
              toast.error(`File '${file.name}' is already selected.`);
              return null;
            }

            const validation = await validateFile(file);
            if (!validation) {
              return null;
            }

            // Add watermark to PDF
            const watermarkedFile = await addWatermarkToPdf(file);
            return {
              file: watermarkedFile,
              hash: validation.hash,
            };
          } catch (error) {
            toast.error(
              error.message || `Error processing file '${file.name}'`
            );
            return null;
          }
        })
      );

      const validFiles = processedFiles.filter(Boolean);
      if (validFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      }
      return validFiles;
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const validFiles = await onDrop(acceptedFiles);
      if (validFiles && validFiles.length > 0) {
        const addedFiles = validFiles.map((file) => ({
          file: file.file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
          hash: file.hash,
        }));
        void onFilesAdded?.(addedFiles);
        void onChange?.([...(value ?? []), ...addedFiles]);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
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
