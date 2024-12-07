import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/providers/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notes Mates.in - Notes, Papers, Videos, Groups",
  description: "Notes, Papers, Videos, Groups",
  keywords: "notes mates, notes, papers, videos, groups",
  author: "Ramanand Kumar Gupta",
  // viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon/icon-128x128.png",
  },
  googleSignin: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  script: "https://accounts.google.com/gsi/client",
  async: true,
  defer: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Notes Mates" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta 
          name="google-signin-client_id" 
          content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} 
        />
        <script 
          src="https://accounts.google.com/gsi/client" 
          async defer
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-base-100`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
