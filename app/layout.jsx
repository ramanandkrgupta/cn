import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, UserProvider } from "@/components/providers";
import { Toaster } from "react-hot-toast";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

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
  title: "Notes Mates",
  description: "A Note Sharing Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="mydark">
      <head>
        <link rel="icon" href="/favicon/icon.svg" />
        <link rel="apple-touch-icon" href="/favicon/icon.svg" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google-adsense-account" content="ca-pub-7004515632237084"></meta>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004515632237084"
     crossorigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <Toaster />
            {children}
             <Analytics />
            <SpeedInsights /> 
          </UserProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
