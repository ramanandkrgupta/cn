import { generatePDFThumbnail } from './cloudinary';

export const generateThumbnail = async (fileUrl, postId) => {
  try {
    console.log("Starting thumbnail generation process:", { fileUrl, postId });

    if (!fileUrl) {
      console.error("No file URL provided for thumbnail generation");
      return '/images/placeholders/pdf-placeholder.png';
    }

    // Generate thumbnail URL using Cloudinary
    console.log("Calling generatePDFThumbnail...");
    const thumbnailUrl = await generatePDFThumbnail(fileUrl, postId);
    console.log("Thumbnail generation successful:", thumbnailUrl);

    return thumbnailUrl;
  } catch (error) {
    console.error('Error in thumbnail generation:', {
      error,
      message: error.message,
      stack: error.stack
    });
    // Return a default thumbnail if generation fails
    return '/images/placeholders/pdf-placeholder.png';
  }
};

export default generateThumbnail; 