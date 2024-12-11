import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

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

  const token = await getToken({ req: request });

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
    '/api/v1/members/:path*'
  ]
}; 