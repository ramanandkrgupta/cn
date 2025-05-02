"use client";

import { useState, useEffect } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PDFViewer = ({ url }) => {
  const [currentTheme, setCurrentTheme] = useState("dark"); // Default theme
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  // Effect to detect and respond to theme changes
  useEffect(() => {
    // Initial theme detection
    const detectTheme = () => {
      // Check localStorage first (as used in the codebase)
      const savedTheme = localStorage.getItem("theme") || "mydark";
      // Map app theme names to PDF viewer theme names
      setCurrentTheme(savedTheme === "mylight" ? "light" : "dark");
    };
    
    detectTheme();
    
    // Set up a MutationObserver to watch for theme attribute changes on the document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" && 
          mutation.attributeName === "data-theme"
        ) {
          const newTheme = document.documentElement.getAttribute("data-theme");
          setCurrentTheme(newTheme === "mylight" ? "light" : "dark");
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up observer
    return () => observer.disconnect();
  }, []);
  
  // Get toolbar background color based on theme
  const getToolbarStyle = () => {
    return {
      alignItems: "center",
      backgroundColor: currentTheme === "dark" ? "#333333" : "#eeeeee",
      borderBottom: `1px solid ${currentTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      display: "flex",
      justifyContent: "center",
      padding: "4px",
      color: currentTheme === "dark" ? "#ffffff" : "#000000",
    };
  };
  
  // Get viewer container style based on theme
  const getViewerContainerStyle = () => {
    return {
      border: `1px solid ${currentTheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)"}`,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: currentTheme === "dark" ? "#1e1e1e" : "#ffffff",
    };
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        className="rpv-core__viewer"
        style={getViewerContainerStyle()}
      >
        <div style={getToolbarStyle()}>
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={url}
              plugins={[zoomPluginInstance]}
              theme={currentTheme} // Use detected theme
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

{
  /* <PDFViewer url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" /> */
}
