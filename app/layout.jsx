import { Inter } from 'next/font/google'
import './globals.css'
import SessionWrapper from "@/components/providers/SessionWrapper";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} min-h-screen bg-base-100`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
} 