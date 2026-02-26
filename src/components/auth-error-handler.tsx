'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthErrorHandler() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const handleAuthExpired = () => {
      logout() // Clear Zustand state & localStorage
      router.push('/login') // Redirect to login
    }

    globalThis.addEventListener('auth:expired', handleAuthExpired)
    return () =>
      globalThis.removeEventListener('auth:expired', handleAuthExpired)
  }, [logout, router])

  return null
}
