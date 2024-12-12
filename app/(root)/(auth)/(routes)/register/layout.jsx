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
  title: "Register | Notes Mates - Join Our Academic Community",
  description: "Create your Notes Mates account to access and share academic resources. Join our growing community of students and educators.",
  keywords: "register, sign up, create account, student registration, academic portal signup, notes mates registration",
  openGraph: {
    title: "Register | Notes Mates - Join Our Academic Community",
    description: "Create your Notes Mates account to access and share academic resources. Join our growing community of students and educators.",
    type: "website",
    url: "https://notesmates.in/register",
    siteName: "Notes Mates",
    images: [
      { url: "/favicon/web-app-manifest-512x512.png" }
    ],
  },
  twitter: {
    card: "summary",
    title: "Register | Notes Mates - Join Our Academic Community",
    description: "Create your Notes Mates account to access and share academic resources. Join our growing community of students and educators.",
    images: [
      { url: "/favicon/web-app-manifest-512x512.png" }
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RegisterLayout({ children }) {
  return <>{children}</>;
}
    