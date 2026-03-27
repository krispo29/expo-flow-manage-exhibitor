'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, user, isHydrated, expiresAt, logout, clearExpiredSession } =
    useAuthStore()

  useEffect(() => {
    if (!isHydrated) return

    clearExpiredSession()
  }, [clearExpiredSession, isHydrated])

  useEffect(() => {
    if (!isHydrated) return

    const endSession = async () => {
      logout()

      try {
        await logoutAction()
      } finally {
        router.replace('/login')
      }
    }

    if (!isAuthenticated || !user) {
      router.replace('/login')
      return
    }

    if (expiresAt === null) {
      void endSession()
      return
    }

    const remainingMs = expiresAt - Date.now()

    if (remainingMs <= 0) {
      void endSession()
      return
    }

    const timeoutId = window.setTimeout(() => {
      void endSession()
    }, remainingMs)

    return () => window.clearTimeout(timeoutId)
  }, [expiresAt, isAuthenticated, isHydrated, logout, router, user])

  if (
    !isHydrated ||
    !isAuthenticated ||
    !user ||
    (expiresAt !== null && expiresAt <= Date.now())
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
