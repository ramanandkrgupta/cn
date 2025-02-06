import toast from 'react-hot-toast'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import { Cloud } from '@/public/assets'
import { DocumentTextIcon } from '@heroicons/react/20/solid'
import { processPDF } from '@/libs/pdf-processor'
import DocDetails from './DocDetails'
import Stepper from '../ui/Stepper'
import UploadDoneModel from '../ui/UploadDoneModel'

const MAX_FILE_SIZE = 1000 * 1024 * 1024 // 1000MB
const ALLOWED_FILE_TYPES = ['application/pdf']

/**
 * A simple component for showing a file's upload progress.
 */
const UploadToast = ({ fileName, progress }) => {
  // Ensure we always have a valid total to avoid division by zero.
  const totalBytes = progress.total || 1
  const percent = progress.percent || 0
  const loadedMB = (progress.loaded / (1024 * 1024)).toFixed(2)
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2)

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4">
      <div className="flex-shrink-0">
        <DocumentTextIcon
          className="h-6 w-6 text-blue-500"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">{fileName}</p>
        <p className="mt-1 text-sm text-gray-500">Uploading...</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {loadedMB} MB / {totalMB} MB ({percent}%)
        </p>
      </div>
    </div>
  )
}

const UploadDoc = ({
  files,
  setFiles,
  removeFile,
  value = [],
  onChange,
  onFilesAdded,
}) => {
  const [showDocDetails, setShowDocDetails] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isUploadDone, setIsUploadDone] = useState(false)

  const steps = [
    'Select Files',
    'Upload Files',
    'Generate Thumbnails',
    'Complete',
  ]

  // Validate file
  const validateFile = async (file) => {
    try {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 1000MB')
        return false
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Only PDF files are allowed')
        return false
      }
      const isDuplicate = selectedFiles.some(
        (existingFile) => existingFile.name === file.name
      )
      if (isDuplicate) {
        toast.error('This file is already selected')
        return false
      }
      if (selectedFiles.length >= 3) {
        toast.error('Maximum 3 files can be uploaded at once')
        return false
      }
      return true
    } catch (error) {
      console.error('Error validating file:', error)
      return false
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (isUploading) {
        toast.error('Please wait for current upload to finish')
        return
      }

      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === 'application/pdf'
      )

      if (pdfFiles.length !== acceptedFiles.length) {
        toast.error('Only PDF files are allowed')
        return
      }

      try {
        for (const file of pdfFiles) {
          const isValid = await validateFile(file)
          if (!isValid) return
        }

        // Create file objects with unique IDs
        const filesWithIds = pdfFiles.map((file) => ({
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          originalName: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
        }))

        setSelectedFiles(filesWithIds)
        setShowDocDetails(true)
      } catch (error) {
        console.error('Error handling files:', error)
        toast.error('Error handling files')
      }
    },
    [isUploading, selectedFiles]
  )

  /**
   * Upload file using XHR so we can track progress.
   * Each progress event updates the toast with the same ID (the file's ID)
   * so that its content changes.
   */
  const uploadFile = async (file, details, fileId) => {
    try {
      // Process the PDF (watermark, metadata, etc.)
      const processedPdfBytes = await processPDF(file, {
        title: details.title || file.name,
        course: details.course || '',
        semester: details.semester || '',
        subject: details.subject?.subject_name || '',
        category: details.category || '',
      })

      const processedFile = new File(
        [processedPdfBytes],
        details.originalName || file.name,
        { type: 'application/pdf' }
      )

      // Request a signed URL from the backend.
      const signedUrlToastId = toast.loading('Getting signed URL...')
      setActiveStep(1)

      const response = await fetch('/api/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: processedFile.name,
          fileType: processedFile.type,
          subject: details.subject?.subject_name,
          course: details.course,
        }),
      })

      if (!response.ok) {
        toast.dismiss(signedUrlToastId)
        throw new Error('Failed to get signed URL')
      }

      const { url, key } = await response.json()
      toast.dismiss(signedUrlToastId)

      // Use XHR to upload the file so we can track progress.
      setActiveStep(2)
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', processedFile.type)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = {
              loaded: event.loaded,
              total: event.total,
              percent: Math.round((event.loaded / event.total) * 100),
            }

            // Here we update the toast content for this file.
            toast.custom(
              (t) => <UploadToast fileName={file.name} progress={progress} />,
              { id: fileId, duration: Infinity }
            )
          }
        }

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // Generate thumbnail
            setActiveStep(3)
            const thumbnailToastId = toast.loading('Generating thumbnail...')
            let thumbnailUrl = '/images/placeholders/pdf-placeholder.png'
            try {
              const thumbnailResponse = await fetch('/api/generate-thumbnail', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
                  key: details.id,
                }),
              })
              if (thumbnailResponse.ok) {
                const thumbnailResult = await thumbnailResponse.json()
                thumbnailUrl = thumbnailResult.thumbnailUrl
              }
            } catch (thumbnailError) {
              console.error('Thumbnail generation error:', thumbnailError)
            }
            toast.dismiss(thumbnailToastId)

            resolve({
              url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
              thumbnailUrl,
              key,
            })
          } else {
            reject(new Error('Upload failed'))
          }
        }

        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(processedFile)
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleSubmit = async (fileDetails) => {
    if (isUploading) {
      toast.error('Upload already in progress')
      return
    }
    try {
      setIsUploading(true)
      // Process files sequentially
      const uploadResults = []
      for (let i = 0; i < fileDetails.length; i++) {
        const detail = fileDetails[i]
        const fileObj = selectedFiles.find((f) => f.id === detail.id)
        if (!fileObj) {
          console.error('File not found:', detail.id)
          continue
        }
        setActiveStep(0)
        // Create (or update) the toast with initial progress
        toast.custom(
          (t) => (
            <UploadToast
              fileName={fileObj.name}
              progress={{ loaded: 0, total: fileObj.size, percent: 0 }}
            />
          ),
          { id: fileObj.id, duration: Infinity }
        )

        // Upload the file (the onprogress callback will update the toast)
        const uploadResponse = await uploadFile(
          fileObj.file,
          {
            ...detail,
            course_name: detail.course,
            semester_code: detail.semester,
            subject_name: detail.subject?.subject_name,
            subject_code: detail.subject?.subject_code,
            originalName: fileObj.originalName,
          },
          fileObj.id
        )
        // Dismiss the toast for this file once done.
        toast.dismiss(fileObj.id)

        uploadResults.push({
          ...uploadResponse,
          id: fileObj.id,
          name: fileObj.name,
          size: fileObj.size,
        })
      }

      // Save file details on the backend.
      const saveResponse = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: uploadResults,
          fileDetails: fileDetails,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save file details')
      }

      toast.success('All files uploaded successfully!')
      setSelectedFiles([])
      setShowDocDetails(false)
      setActiveStep(4)
      setIsUploadDone(true)

      if (onChange) onChange(uploadResults)
      if (onFilesAdded) onFilesAdded(uploadResults)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error(error.message || 'Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
    disabled: isUploading,
  })

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
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">PDF (MAX. 100MB)</p>
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
  )
}

export default UploadDoc
