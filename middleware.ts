// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /messages)
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';
  
  // Check if user is authenticated (has JWT token in cookies)
  const token = request.cookies.get('token')?.value || '';
  
  // Redirect logic
  if (!isPublicPath && !token) {
    // If trying to access protected route without token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isPublicPath && token) {
    // If already authenticated and trying to access login/register, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/', '/login', '/register', '/messages/:path*', '/profile/:path*']
};