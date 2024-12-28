import { v2 as cloudinary } from 'cloudinary';

// Add debug logging for configuration
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("Cloudinary configuration:", {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? "present" : "missing",
  api_secret: config.api_secret ? "present" : "missing"
});

cloudinary.config(config);

// Upload file to Cloudinary
export const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, {
        folder: folder,
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "pdf", "webp"],
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Generate PDF thumbnail
export const generatePDFThumbnail = async (pdfUrl, postId) => {
  try {
    console.log("Starting PDF thumbnail generation:", { pdfUrl, postId });

    // Validate URL
    if (!pdfUrl.startsWith('http')) {
      throw new Error('Invalid PDF URL provided');
    }

    const options = {
      folder: 'thumbnails',
      format: 'webp',
      public_id: `post-${postId}`,
      pages: true,
      transformation: [
        { width: 600, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
        { page: 1 },
        { density: 300 },
      ],
    };

    // Use the upload API to generate a thumbnail
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(pdfUrl, options, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Thumbnail generation successful:', result);
          resolve(result);
        }
      });
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    throw error;
  }
};

// Upload and process avatar
export const uploadAvatar = async (file, userId) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'avatars',
      public_id: `user-${userId}`,
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export default cloudinary; 