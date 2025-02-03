import { generatePDFThumbnail } from './cloudinary';

export const generateThumbnail = async (fileUrl, postId) => {
  try {
    console.log("Starting thumbnail generation process:", { fileUrl, postId });

    if (!fileUrl) {
      console.error("No file URL provided for thumbnail generation");
      return 'https://res.cloudinary.com/dk6p24i8q/image/upload/e_improve:outdoor/thumbnails/preview';
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
    return 'https://res.cloudinary.com/dk6p24i8q/image/upload/e_improve:outdoor/thumbnails/preview';
  }
};

export default generateThumbnail;