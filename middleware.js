import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    console.log("Protected Route Access:", req.nextUrl.pathname);

    // No token means redirect to login for protected routes
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Handle dashboard access (admin/manager only)
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (token.role === "ADMIN" || token.role === "MANAGER") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/account", req.url));
    }

    // Allow access to account page for all authenticated users
    if (req.nextUrl.pathname.startsWith('/account')) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only check token for protected routes
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/account')) {
          return !!token;
        }
        // Allow access to all other routes
        return true;
      },
    },
  }
);

// Update matcher to only include protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/api/protected/:path*', // For protected API routes
  ]
};