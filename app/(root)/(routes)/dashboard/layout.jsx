"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardNavbar from "./components/DashboardNavbar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protect routes
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  if (!session) {
    router.push("/login");
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