"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader"; // Changed from Navbar to Header

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect if we're sure about the session status
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check for admin role if on admin routes
    if (pathname.startsWith("/dashboard") && session.user.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [session, status, router, pathname]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col border-r border-base-200 bg-base-100 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* We reuse the existing sidebar logic but might want to refactor its internal styling later if needed, 
            for now we pass specific props or wrapper styles to make it fit the Nexus theme */}
        <DashboardSidebar
          user={session.user}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-base-content/20 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 h-full w-72 bg-base-100 shadow-2xl"
          >
            <DashboardSidebar user={session.user} collapsed={false} />
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full">
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-base-200/30 p-2 md:p-8">
          <div className="container mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
