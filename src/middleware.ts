import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getJwtExpirationTimestamp } from '@/lib/jwt'

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('access_token')
  response.cookies.delete('project_uuid')
  response.cookies.delete('user_role')
}

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname
  
  // Define protected and public routes
  const isProtectedRoute = path.startsWith('/exhibitor')
  const isPublicRoute = path === '/login'

  // Extract the access token from cookies
  const token = request.cookies.get('access_token')?.value
  const expiresAt = token ? getJwtExpirationTimestamp(token) : null
  const hasValidToken = Boolean(token) && expiresAt !== null && expiresAt > Date.now()

  // Redirect to login if accessing a protected route without a token
  if (isProtectedRoute && !hasValidToken) {
    const response = NextResponse.redirect(new URL('/login', request.url))

    if (token) {
      clearAuthCookies(response)
    }

    return response
  }

  // Redirect to exhibitor dashboard if accessing login page with a token
  if (isPublicRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/exhibitor', request.url))
  }

  // Continue with the request if no redirect is needed
  const response = NextResponse.next()

  if (token && !hasValidToken) {
    clearAuthCookies(response)
  }

  return response
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
