"use client"
import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    console.log("[InstallPrompt] Component mounted. Checking installation status...");

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      console.log("[InstallPrompt] iOS device detected.");
      setIsIos(true);
    } else {
      console.log("[InstallPrompt] Non-iOS device detected.");
    }

    // Check if the app is already installed
    const checkInstallation = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone
      ) {
        console.log("[InstallPrompt] Detected standalone display mode: App is installed.");
        setIsInstalled(true);
      } else {
        console.log("[InstallPrompt] App is not installed (display-mode not standalone).");
      }
    };

    checkInstallation();

    // Handler for beforeinstallprompt event (supported on Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      console.log("[InstallPrompt] beforeinstallprompt event fired:", e);
      e.preventDefault();
      console.log("[InstallPrompt] Default prompt prevented. Storing the deferred prompt event.");
      setDeferredPrompt(e);
    };

    // Handler for appinstalled event
    const handleAppInstalled = (e) => {
      console.log("[InstallPrompt] appinstalled event fired:", e);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // If after 10 seconds the deferred prompt is still null, log it
    const timeoutId = setTimeout(() => {
      if (!deferredPrompt && !isIos) {
        console.log("[InstallPrompt] After 10 seconds, no deferred prompt event was captured.");
      }
    }, 10000);

    return () => {
      console.log("[InstallPrompt] Cleaning up event listeners.");
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timeoutId);
    };
  }, [deferredPrompt, isIos]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log("[InstallPrompt] No deferred prompt available. Cannot initiate installation.");
      return;
    }
    console.log("[InstallPrompt] User clicked install button. Prompting installation...");
    deferredPrompt.prompt();

    try {
      const choiceResult = await deferredPrompt.userChoice;
      console.log("[InstallPrompt] User choice result:", choiceResult);
      if (choiceResult.outcome === "accepted") {
        console.log("[InstallPrompt] User accepted the install prompt.");
        setIsInstalled(true);
      } else {
        console.log("[InstallPrompt] User dismissed the install prompt.");
      }
    } catch (error) {
      console.error("[InstallPrompt] Error during install prompt:", error);
    }
    // Clear the deferred prompt after use
    setDeferredPrompt(null);
  };

  // If the app is installed, do not render any prompt.
  if (isInstalled) {
    console.log("[InstallPrompt] App installed. Not rendering prompt.");
    return null;
  }

  // For iOS devices, the beforeinstallprompt event is never fired.
  // Show custom instructions instead.
  if (isIos && !deferredPrompt) {
    console.log("[InstallPrompt] Rendering custom iOS install instructions.");
    return (
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          backgroundColor: "#2563EB",
          color: "#fff",
          padding: "10px",
          borderRadius: "8px",
          zIndex: 1000,
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          To install, tap the share icon and select "Add to Home Screen".
        </p>
      </div>
    );
  }

  // For other devices: render the install button only when the deferred prompt is available.
  if (!deferredPrompt) {
    console.log("[InstallPrompt] No deferred prompt available and not iOS. Not rendering button.");
    return null;
  }

  console.log("[InstallPrompt] Rendering install button. deferredPrompt is available.");
  return (
    <button
      onClick={handleInstall}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        backgroundColor: "#2563EB",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      Install App
    </button>
  );
};

export default InstallPrompt;
