'use client'

import { useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function ProjectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  // Pages that don't require a projectId
  const isExemptPath = pathname === '/admin/projects' || pathname.startsWith('/admin/exhibitor-portal')

  useEffect(() => {
    if (isExemptPath) return

    // If no project ID is present, redirect to projects page
    if (!projectId) {
      router.push('/admin/projects')
    }
  }, [projectId, isExemptPath, router])

  // Show loader if we need a project but don't have one
  if (!isExemptPath && !projectId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

