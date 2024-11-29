"use client";
import { Toaster } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/shared/admin/Sidebar";
import AdminHeader from "@/components/shared/admin/Header";
import { Navigation } from "@/components/navigation";
import { EdgeStoreProvider } from "@/libs/edgestore";

export default function RootLayout({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protect routes
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <EdgeStoreProvider>
      <html lang="en">
        <head>
          <title>college notes.tech</title>
          <meta name="description" content="description" />
          <meta
            name="keywords"
            content="priyadarshini arts and science college malappuram, calicut university study materials, calicut university student portal, calicut university exam result, calicut university syllabus, priyadarshini malappuram, calicut university, Pareeksha Bhavan, study material, studyhub, paschub"
          />
          <meta name="author" content="Ramanand Kumar Gupta" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon/icon-128x128.png" />
          <link rel="icon" href="/favicon/icon-128x128.png" />
        </head>
        <body className="bg-base-100 min-h-screen">
          <Toaster richColors closeButton position="top-center" />
          <main className="pb-16">
            {children}
            <Navigation />
          </main>
        </body>
      </html>
    </EdgeStoreProvider>
  );
}
