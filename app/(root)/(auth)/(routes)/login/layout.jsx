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
  title: "Login | Notes Mates - Access Your Academic Resources",
  description: "Login to Notes Mates to access your academic notes, papers, videos, and join student groups. Get started with your educational journey today.",
  keywords: "login, student login, academic portal login, notes mates login, educational resources",
  openGraph: {
    title: "Login | Notes Mates - Access Your Academic Resources",
    description: "Access your academic notes, papers, videos, and join student groups. Get started with your educational journey today.",
    type: "website",
    url: "https://notesmates.in/login",
    siteName: "Notes Mates",
    images: [
      { url: "/favicon/web-app-manifest-512x512.png" }
    ],
  },
  twitter: {
    card: "summary",
    title: "Login | Notes Mates - Access Your Academic Resources",
    description: "Access your academic notes, papers, videos, and join student groups. Get started with your educational journey today.",
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

export default function LoginLayout({ children }) {
  return <>{children}</>;
}
