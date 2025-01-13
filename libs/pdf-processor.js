import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export async function processPDF(file, metadata) {
  try {
    // Read the PDF file
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Set metadata
    pdfDoc.setTitle(metadata.title || '');
    pdfDoc.setSubject(metadata.subject || '');
    pdfDoc.setAuthor('NoteMates');
    pdfDoc.setCreator('NoteMates');
    
    // Set keywords as an array
    const keywords = [
      metadata.course,
      metadata.semester,
      metadata.category
    ].filter(Boolean); // Remove falsy values
    pdfDoc.setKeywords(keywords);
    
    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Add watermark to each page
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
   

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      

      // Add small watermark at bottom
      page.drawText('Downloaded from www.notesmates.in', {
        x: 30,
        y: 20,
        size: 8,
        font,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.8,
      });

      // Add timestamp
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      page.drawText(`Uploaded on: ${timestamp}`, {
        x: width - 200,
        y: 20,
        size: 5,
        font,
        color: rgb(0.4, 0.4, 0.4),
        opacity: 0.8,
      });
    }
    
    // Save the PDF
    const processedPdfBytes = await pdfDoc.save();
    return processedPdfBytes;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error(`Failed to process PDF file: ${error.message}`);
  }
}
