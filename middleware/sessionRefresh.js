import { NextResponse } from 'next/server';

export async function middleware(request) {
    if (request.nextUrl.pathname === '/api/auth/session') {
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/api/auth/session',
}; 