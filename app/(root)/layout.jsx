"use client";
import { Toaster } from "sonner";
<<<<<<< HEAD
=======

>>>>>>> 3da53c2304039f974d887e3c8aff239f485c902d

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import "../globals.css";
import { EdgeStoreProvider } from "@/libs/edgestore";
import AuthProvider from "@/components/layouts/ProviderLayouts";
import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [meta, setMeta] = useState({
    title: "College Notes",
    description: "Study material web app for students that makes studying easier for students and document management hassle-free for teachers",
  });

  useEffect(() => {
    const { name = "", category = "", sem = "", subId = "" } = router.query || {};
    if (name && category && sem && subId) {
      const customTitle = `${name} - ${category} - Semester ${sem}`;
      const customDescription = `View and download ${category} for ${name}, Semester ${sem}, Subject ID: ${subId}.`;
      setMeta({ title: customTitle, description: customDescription });
    }
  }, [router.query]);

  return (
    <html lang="en">
      <head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="priyadarshini arts and science college malappuram, calicut university study materials, calicut university student portal, calicut university exam result, calicut university syllabus, priyadarshini malappuram, calicut university, Pareeksha Bhavan, study material, studyhub, paschub" />
        <meta name="author" content="Ramanand Kumar Gupta" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon/icon-128x128.png" />
        <link rel="icon" href="/favicon/icon-128x128.png" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon/icon-128x128.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="/favicon/icon-128x128.png" />
      </head>
      <body className="bg-base-100 min-h-screen">
        
          <AuthProvider>
            <EdgeStoreProvider>
              <Toaster richColors closeButton position="top-center" />
              <main className="pb-16">
                {children}
                <Navigation />
              </main>
            </EdgeStoreProvider>
          </AuthProvider>
<<<<<<< HEAD
        
=======
       
>>>>>>> 3da53c2304039f974d887e3c8aff239f485c902d
      </body>
    </html>
  );
}