import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function addWatermarkToPdf(file) {
  try {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = 10;
      const watermarkText = `Downloaded from Notes Mates - ${new Date().toLocaleDateString()}`;
      const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);

      // Add watermark at bottom-right corner
      page.drawText(watermarkText, {
        x: width - textWidth - 10,
        y: 10,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
      });
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw new Error('Failed to add watermark to PDF');
  }
}

export async function calculateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
