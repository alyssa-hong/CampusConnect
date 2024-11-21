import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });
console.log('Token:', token);  // Debug token value

  const isAuthenticated = !!token?.id; // Token contains user information if authenticated

  // Define protected and excluded routes
  const protectedRoutes = ['/home', '/edit-item'];
  const excludedRoutes = ['/login', '/'];

  // If the user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log('User not authenticated, redirecting to login page');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to routes that don't require authentication (like login page)
  if (excludedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/edit-item', '/profile'], // Match protected routes
};
