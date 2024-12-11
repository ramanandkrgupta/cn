import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, UserProvider } from "@/components/providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notes Mates.in - Notes, Papers, Videos, Groups",
  description: "Notes, Papers, Videos, Groups",
  keywords: "notes mates, notes, papers, videos, groups",
  author: "Ramanand Kumar Gupta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
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
