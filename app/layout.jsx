import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, UserProvider } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#13131b' }
  ]
}

export const metadata = {
  title: "Notes Mates.in - Notes, Papers, Videos, Groups",
  description: "Notes, Papers, Videos, Groups",
  keywords: "notes mates, notes, papers, videos, groups",
  author: "Ramanand Kumar Gupta",
  icons: {
    icon: [
      { url: '/favicon/icon.svg' }
    ],
    apple: [
      { url: '/favicon/web-app-manifest-192x192.png' }
    ],
    shortcut: ['/favicon/icon.svg'],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: "Notes Mates.in - Notes, Papers, Videos, Groups",
    description: "Notes, Papers, Videos, Groups",
    url: "https://notesmates.in",
    siteName: "Notes Mates.in",
    images: [
      { url: "/icons/icon.png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notes Mates.in - Notes, Papers, Videos, Groups",
    description: "Notes, Papers, Videos, Groups",
    images: [
      { url: "/icons/icon.png" },
    ],
  },
  robots: "index, follow",
  category: "education",
  creator: "Ramanand Kumar Gupta",
  publisher: "Ramanand Kumar Gupta",
  language: "en-US",
  verification: {
    google: "google-site-verification:1234567890",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Notes Mates",
  },
  formatDetection: {
    telephone: false,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" href="/favicon/icon.svg" />
        <link rel="apple-touch-icon" href="/favicon/web-app-manifest-192x192.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <Toaster />
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
