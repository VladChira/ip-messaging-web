// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check for login and register paths, accounting for the /messenger prefix
  const isLoginPath = path.includes('/login');
  const isRegisterPath = path.includes('/register');
  const isPublicPath = isLoginPath || isRegisterPath;
  
  // Check if user is authenticated (has JWT token in cookies)
  const token = request.cookies.get('token')?.value;
  
  // If trying to access a protected route without token, redirect to login
  if (!isPublicPath && !token) {
    // Determine the login path based on whether we're in the /messenger route
    const loginPath = path.startsWith('/messenger') ? '/messenger/login' : '/login';
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
  
  // If already authenticated and trying to access login/register, redirect to home
  if (isPublicPath && token) {
    // Determine the home path based on whether we're in the /messenger route
    const homePath = path.startsWith('/messenger') ? '/messenger' : '/';
    return NextResponse.redirect(new URL(homePath, request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};