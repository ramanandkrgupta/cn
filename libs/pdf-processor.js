import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PDF_TEMPLATE_URL } from '@/libs/constants';

export const processPDF = async (file, options = {}) => {
  try {
    // Load the template and user's PDF
    const templateResponse = await fetch(PDF_TEMPLATE_URL);
    if (!templateResponse.ok) {
      throw new Error('Failed to load template');
    }
    const templateBytes = await templateResponse.arrayBuffer();
    const templateDoc = await PDFDocument.load(templateBytes);
    
    const existingPdfBytes = await file.arrayBuffer();
    const userPdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Create new PDF
    const finalPdf = await PDFDocument.create();
    const helveticaFont = await finalPdf.embedFont(StandardFonts.Helvetica);

    // 1. First Page - Post Metadata
    const firstPage = finalPdf.addPage();
    const { width, height } = firstPage.getSize();

    // Add website name at top
    firstPage.drawText('NoteMates.in', {
      x: width/2 - 100,
      y: height - 100,
      size: 36,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2)
    });

    // Add post title
    firstPage.drawText(options.title || 'Untitled Document', {
      x: 50,
      y: height - 200,
      size: 24,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.1)
    });

    // Add metadata
    const metadata = [
      `Course: ${options.course || ''}`,
      `Semester: ${options.semester || ''}`,
      `Subject: ${options.subject || ''}`,
      `Category: ${options.category || ''}`
    ].filter(text => text.split(': ')[1]);

    metadata.forEach((text, index) => {
      firstPage.drawText(text, {
        x: 50,
        y: height - 250 - (index * 30),
        size: 14,
        font: helveticaFont,
        color: rgb(0.3, 0.3, 0.3)
      });
    });

    // Add logo if available
    if (options.logoData) {
      const logoImage = await finalPdf.embedPng(options.logoData);
      firstPage.drawImage(logoImage, {
        x: width - 150,
        y: height - 150,
        width: 100,
        height: 100,
        opacity: 0.8
      });
    }

    // 2. Add template page (promotional content)
    const [templatePage] = await finalPdf.copyPages(templateDoc, [0]);
    finalPdf.addPage(templatePage);

    // 3. Copy all pages from user's PDF and add watermark
    const userPages = await finalPdf.copyPages(userPdfDoc, userPdfDoc.getPageIndices());
    
    // Process pages sequentially instead of using forEach
    for (const page of userPages) {
      finalPdf.addPage(page);
      const { width, height } = page.getSize();

      // Add diagonal watermark
      page.drawText('NoteMates.in', {
        x: width/2 - 100,
        y: height/2,
        size: 60,
        font: helveticaFont,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.1,
        rotate: {
          type: 'degrees',
          angle: -45,
        }
      });

      // Add small logo and URL at bottom
      if (options.logoData) {
        const logoImage = await finalPdf.embedPng(options.logoData);
        page.drawImage(logoImage, {
          x: width - 50,
          y: 20,
          width: 30,
          height: 30,
          opacity: 0.3
        });

        page.drawText('https://www.notesmates.in', {
          x: 20,
          y: 20,
          size: 10,
          font: helveticaFont,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 1
        });
      }
    }

    return await finalPdf.save();
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}; 