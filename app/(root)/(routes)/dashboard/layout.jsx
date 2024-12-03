"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardNavbar from "./components/DashboardNavbar";

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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar - Desktop */}
      <div className={`hidden lg:block relative ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <DashboardSidebar 
          user={session.user} 
          collapsed={sidebarCollapsed} 
        />
      </div>

      {/* Sidebar - Mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-base-100">
            <DashboardSidebar user={session.user} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar 
          onMenuClick={() => setMobileSidebarOpen(true)}
          title="Admin Panel"
        />
        
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 