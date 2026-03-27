interface JwtPayload {
  exp?: unknown
}

function decodeBase64Url(value: string): string {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4
  const base64Value = `${normalizedValue}${'='.repeat(paddingLength)}`

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(base64Value)
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64Value, 'base64').toString('utf8')
  }

  throw new Error('Base64 decoder is not available')
}

export function getJwtExpirationTimestamp(token: string): number | null {
  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return null
    }

    const parsedPayload = JSON.parse(decodeBase64Url(payload)) as JwtPayload

    if (typeof parsedPayload.exp !== 'number' || !Number.isFinite(parsedPayload.exp)) {
      return null
    }

    return parsedPayload.exp * 1000
  } catch {
    return null
  }
}
