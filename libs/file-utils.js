import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";

// Update the actual link and token if required
const EDGE_STORE_FILE_URL = `https://files.edgestore.dev/lcy0ck7ashxumizl/publicFiles/_public/`;
const EDGE_STORE_TOKEN = "GQasb2OVjjMCqa8pSVxaPD3FJMxAcHPj"; 

export async function getFileWithWatermark(fileId, user, isPremium) {
  try {
    // Construct full URL using file ID
    // const fileUrl = `${EDGE_STORE_FILE_URL}${fileId}`;

    // // Set up headers if required
    // const headers = {
    //   "Content-Type": "application/pdf",
    // };
    // if (EDGE_STORE_TOKEN) {
    //   headers.Authorization = `Bearer ${EDGE_STORE_TOKEN}`;
    // }
    const fileUrl = "https://files.edgestore.dev/lcy0ck7ashxumizl/publicFiles/_public/c4d14c5a-aa3b-4123-a582-f77ef89d8ce1.pdf"

    // Fetch file from EdgeStore
    const response = await axios.get(fileUrl, {
      headers: headers,
      responseType: "arraybuffer",
    });

    const pdfBytes = response.data;

    // If premium file, apply watermark
    if (isPremium) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const watermarkText = `Downloaded by ${user.name} (${user.email})`;

      pages.forEach((page) => {
        page.drawText(watermarkText, {
          x: 50,
          y: 50,
          size: 12,
          color: rgb(0.7, 0.7, 0.7),
          opacity: 0.5,
        });
      });

      // Return the modified PDF as bytes
      return await pdfDoc.save();
    }

    // If no watermark is needed, return the original file
    return pdfBytes;
  } catch (error) {
    console.error("Error fetching or watermarking file:", error);
    throw new Error("Unable to download or process the file. Please check access permissions or file ID.");
  }
}