import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from './r2-config';

export async function uploadFileToR2(file, key) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw error;
  }
}

export async function getFileFromR2(key) {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}

export async function deleteFileFromR2(key) {
  // Implement delete functionality through API route if needed
  console.warn('Delete functionality not implemented');
}
