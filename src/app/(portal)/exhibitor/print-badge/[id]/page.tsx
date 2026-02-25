'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { getExhibitorProfile } from '@/app/actions/exhibitor'
import { ExhibitorBadge } from '@/components/exhibitor/exhibitor-badge'
import { Button } from '@/components/ui/button'
import { Loader2, Printer, ArrowLeft } from 'lucide-react'

interface ExhibitorMember {
  member_uuid: string
  registration_code: string
  title: string
  title_other: string
  first_name: string
  last_name: string
  job_position: string
  mobile_country_code: string
  mobile_number: string
  email: string
  is_active: boolean
  company_name: string
  company_country: string
  company_tel: string
}

interface ExhibitorInfo {
  company_name: string
  country: string
  booth_no: string
}

export default function PrintBadgePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const staffId = params.id as string

  const [exhibitorInfo, setExhibitorInfo] = useState<ExhibitorInfo | null>(null)
  const [staff, setStaff] = useState<ExhibitorMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user) return
      
      const result = await getExhibitorProfile()
      if (result.success && result.data) {
        setExhibitorInfo({
          company_name: result.data.info.company_name,
          country: result.data.info.country,
          booth_no: result.data.info.booth_no,
        })
        const foundStaff = (result.data.members || []).find(
          (m: ExhibitorMember) => m.member_uuid === staffId
        )
        setStaff(foundStaff || null)
      }
      setLoading(false)
    }
    fetchData()
  }, [user, staffId])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!exhibitorInfo || !staff) {
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
        <ExhibitorBadge staff={staff} exhibitor={exhibitorInfo} />
      </div>
    </div>
  )
}
