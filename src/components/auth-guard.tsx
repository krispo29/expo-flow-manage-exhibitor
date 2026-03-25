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

    if (expiresAt && expiresAt <= Date.now()) {
      void (async () => {
        logout()
        await logoutAction()
        router.replace('/login')
      })()
      return
    }

    if (!isAuthenticated || !user) {
      router.replace('/login')
    }
  }, [clearExpiredSession, expiresAt, isAuthenticated, isHydrated, logout, router, user])

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
