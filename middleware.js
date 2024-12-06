import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Skip middleware for auth-related paths
    if (req.nextUrl.pathname.startsWith('/api/auth/') || 
        req.nextUrl.pathname.startsWith('/login') || 
        req.nextUrl.pathname.startsWith('/register') ||
        req.nextUrl.pathname.includes('callback')) {
      return NextResponse.next();
    }

    const { token } = req.nextauth;

    // No token means redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow access to account page for authenticated users
    if (req.nextUrl.pathname.startsWith('/account')) {
      return NextResponse.next();
    }

    // Handle dashboard access
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (token.role === "ADMIN" || token.role === "MANAGER") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/account", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow auth-related paths
        if (req.nextUrl.pathname.startsWith('/api/auth/') ||
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.includes('callback')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/api/((?!auth/).)*',
    '/((?!api/auth/callback|api/auth/signin|api/auth/session|api/auth/csrf|login|register|_next|favicon|assets|images).*)',
  ]
};