import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/api/v1/members/users/profile')) {
    const hasSecret = !!process.env.NEXTAUTH_SECRET;
    console.log(`MIDDLEWARE_DEBUG: Path=${path}, HasSecret=${hasSecret}`);
    console.log("MIDDLEWARE_DEBUG: Cookies:", request.cookies.getAll().map(c => c.name).join(', '));

    // Attempt with explicit cookie name
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log(`MIDDLEWARE_DEBUG: TokenExists=${!!token}`);

    if (token) console.log("MIDDLEWARE_DEBUG: Token Role=", token.role);
  } else {
    // For other paths, standard check
    // (We perform the check inside conditional for debug path to avoid duplicate calls, 
    // but for the rest of middleware logic 'token' variable is needed globally?
    // The original code calculated 'token' at top level. 
    // Let's revert to top level but with explicit name if needed, or just handle debug path separate)
  }

  // To minimize disruption, let's keep the global token check but add the explicit options
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle session endpoint
  if (path === '/api/auth/session') {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }

  // Skip middleware for AI training endpoint
  if (path === '/api/v1/admin/ai/train') {
    return NextResponse.next();
  }

  // Redirect logged-in users away from the login page
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // Admin routes protection (except AI training)
  if (path.startsWith('/api/v1/admin') && path !== '/api/v1/admin/ai/train') {
    if (!token || token.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  // Member routes protection
  if (path.startsWith('/api/v1/members')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Include session endpoint
    '/api/auth/session',
    // Include all API routes except AI training
    '/api/v1/admin/((?!ai/train).)*',
    '/api/v1/members/:path*',
    '/login',
    '/account',
    '/dashboard',
  ]
};