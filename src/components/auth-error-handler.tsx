'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

import { logoutAction } from "@/app/actions/auth"

export function AuthErrorHandler() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const handleAuthExpired = async () => {
      await logoutAction()
      logout()
      router.push('/login') // Redirect to login
    }

    globalThis.addEventListener('auth:expired', handleAuthExpired)
    return () =>
      globalThis.removeEventListener('auth:expired', handleAuthExpired)
  }, [logout, router])

  return null
}
