import { getJwtExpirationTimestamp } from '@/lib/jwt'

export const AUTH_COOKIE_NAMES = ['access_token', 'project_uuid', 'user_role'] as const

interface PortalSessionInput {
  token?: string | null
  projectUuid?: string | null
}

export function hasValidAuthToken(token?: string | null): boolean {
  if (!token) {
    return false
  }

  const expiresAt = getJwtExpirationTimestamp(token)
  return expiresAt !== null && expiresAt > Date.now()
}

export function hasPortalSession({
  token,
  projectUuid,
}: PortalSessionInput): boolean {
  return hasValidAuthToken(token) && Boolean(projectUuid)
}
