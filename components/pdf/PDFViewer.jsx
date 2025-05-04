"use client";

import { useState, useEffect } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";

// Import styles
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

const PDFViewer = ({ url }) => {
  const [currentTheme, setCurrentTheme] = useState("dark"); // Default theme
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
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

  return (
    <div
      className="rpv-core__viewer"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          display: "flex",
          padding: "4px",
        }}
      >
        <Toolbar>
          {(props) => {
            const {
              CurrentPageInput,
              EnterFullScreen,
              GoToNextPage,
              GoToPreviousPage,
              NumberOfPages,
              ShowSearchPopover,
              Zoom,
              ZoomIn,
              ZoomOut,
            } = props;
            return (
              <>
                <div style={{ padding: "0px 2px" }}>
                  <ShowSearchPopover />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <ZoomOut />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <Zoom />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <ZoomIn />
                </div>
                <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                  <GoToPreviousPage />
                </div>
                <div style={{ padding: "0px 2px", width: "4rem" }}>
                  <CurrentPageInput />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  / <NumberOfPages />
                </div>
                <div style={{ padding: "0px 2px" }}>
                  <GoToNextPage />
                </div>
                <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                  <EnterFullScreen />
                </div>
              </>
            );
          }}
        </Toolbar>
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
            plugins={[toolbarPluginInstance]}
            theme={currentTheme} // Use detected theme
          />
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;
