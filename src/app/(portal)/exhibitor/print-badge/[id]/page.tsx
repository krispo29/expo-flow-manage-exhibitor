'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { getExhibitorForPortal } from '@/app/actions/exhibitor'
import { Exhibitor, Staff } from '@/lib/mock-service'
import { ExhibitorBadge } from '@/components/exhibitor/exhibitor-badge'
import { Button } from '@/components/ui/button'
import { Loader2, Printer, ArrowLeft } from 'lucide-react'

export default function PrintBadgePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const staffId = params.id as string

  const [exhibitor, setExhibitor] = useState<Exhibitor | null>(null)
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user?.exhibitorId) return
      
      const result = await getExhibitorForPortal(user.exhibitorId)
      if (result.success && result.exhibitor) {
        setExhibitor(result.exhibitor)
        const foundStaff = result.exhibitor.staff.find((s: Staff) => s.id === staffId)
        setStaff(foundStaff || null)
      }
      setLoading(false)
    }
    fetchData()
  }, [user?.exhibitorId, staffId])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!exhibitor || !staff) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Staff member not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Print Controls (hidden on print) */}
      <div className="mb-6 flex items-center gap-4 print:hidden px-1">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => globalThis.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print Badge
        </Button>
      </div>

      {/* Badge Preview / Print Area */}
      <div className="print-area">
        <ExhibitorBadge staff={staff} exhibitor={exhibitor} />
      </div>
    </div>
  )
}
