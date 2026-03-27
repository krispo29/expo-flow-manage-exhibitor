import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAMES, hasPortalSession } from '@/lib/auth-session'

function clearAuthCookies(response: NextResponse) {
  for (const cookieName of AUTH_COOKIE_NAMES) {
    response.cookies.delete(cookieName)
  }
}

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname
  
  // Define protected and public routes
  const isProtectedRoute = path.startsWith('/exhibitor')
  const isPublicRoute = path === '/login'

  // Extract the access token from cookies
  const token = request.cookies.get('access_token')?.value
  const projectUuid = request.cookies.get('project_uuid')?.value
  const hasValidPortalSession = hasPortalSession({ token, projectUuid })
  const hasAnyAuthCookie = AUTH_COOKIE_NAMES.some((cookieName) =>
    Boolean(request.cookies.get(cookieName)?.value)
  )

  // Redirect to login if accessing a protected route without a token
  if (isProtectedRoute && !hasValidPortalSession) {
    const response = NextResponse.redirect(new URL('/login', request.url))

    if (hasAnyAuthCookie) {
      clearAuthCookies(response)
    }

    return response
  }

  // Redirect to exhibitor dashboard if accessing login page with a token
  if (isPublicRoute && hasValidPortalSession) {
    return NextResponse.redirect(new URL('/exhibitor', request.url))
  }

  // Continue with the request if no redirect is needed
  const response = NextResponse.next()

  if (hasAnyAuthCookie && !hasValidPortalSession) {
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
