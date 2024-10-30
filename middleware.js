import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;

    if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Token found:", token);

    if (token.role === "ADMIN" || token.role === "MANAGER") {
      console.log("Authorized role:", token.role);
      return NextResponse.next();
    } else {
      console.log("Unauthorized role:", token.role);
      return NextResponse.redirect(new URL("/account", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/api/"] };