import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;

    if (!token) {
      // If there's no token, redirect to the login page
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token.role === "ADMIN" || token.role === "MANAGER") {
      // Allow access to the routes for ADMIN and MANAGER
      return NextResponse.next();
    } else {
      // Redirect unauthorized users to a forbidden page or a different route
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };