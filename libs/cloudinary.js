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
      transformation: [
        { width: 300, height: 400, crop: "fill" },
        { quality: "auto:good" },
        { page: 1 }
      ],
      resource_type: "auto",
    };

    console.log("Cloudinary upload options:", options);

    const result = await cloudinary.uploader.upload(pdfUrl, options);
    console.log("Cloudinary upload result:", result);

    return result.secure_url;
  } catch (error) {
    console.error('Detailed error in thumbnail generation:', {
      error,
      message: error.message,
      stack: error.stack
    });
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