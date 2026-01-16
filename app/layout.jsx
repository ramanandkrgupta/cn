import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider, UserProvider } from "@/components/providers";
import { Toaster } from "react-hot-toast";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script"

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
  title: "Notes Mates - #1 Website For RGPV Update",
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
        <meta name="apple-mobile-web-app-title" content="Notes Mates" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <Script
          id="gatekeeper-consent"
          strategy="beforeInteractive"
          data-cfasync="false"
          src="https://cmp.gatekeeperconsent.com/min.js"
        />
        <Script
          id="gatekeeper-cmp"
          strategy="beforeInteractive"
          data-cfasync="false"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
        />
        <Script id="ezoic-init" strategy="beforeInteractive">
          {`
             window._ezaq = window._ezaq || [];
             window.ezstandalone = window.ezstandalone || {};
             ezstandalone.cmd = ezstandalone.cmd || [];
          `}
        </Script>
        <Script
          id="ezoic-sa"
          strategy="afterInteractive"
          src="https://www.ezojs.com/ezoic/sa.min.js"
        />

        <meta name="google-adsense-account" content="ca-pub-7004515632237084"></meta>

        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7004515632237084"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

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
