'use client'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

const PDFViewer = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          theme="dark" // Optional: Set theme to dark or light
        />
      </Worker>
    </div>
  )
}

export default PDFViewer

{/* <PDFViewer url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" /> */}
