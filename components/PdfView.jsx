"use client";
import { useSearchParams } from 'next/navigation';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfView = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');

  return (
    <div style={{ height: '100vh' }}>
      {fileUrl ? (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <div
            style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '100%',
            }}
          >
            <Viewer fileUrl={decodeURIComponent(fileUrl)} />
          </div>
        </Worker>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PdfView;