import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname
  
  // Define protected and public routes
  const isProtectedRoute = path.startsWith('/exhibitor')
  const isPublicRoute = path === '/login'

  // Extract the access token from cookies
  const token = request.cookies.get('access_token')?.value

  // Redirect to login if accessing a protected route without a token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to exhibitor dashboard if accessing login page with a token
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/exhibitor', request.url))
  }

  // Continue with the request if no redirect is needed
  return NextResponse.next()
}

// Specify the paths where the middleware should run
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
