'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export function ProjectGuard({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    // If not logged in, go to login
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  return <>{children}</>
}

