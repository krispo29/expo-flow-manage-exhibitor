'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { getExhibitorForPortal } from '@/app/actions/exhibitor'
import { Exhibitor, Staff } from '@/lib/mock-service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { PortalStaffManagement } from '@/components/exhibitor/portal-staff-management'

/**
 * EXHIBITOR-2 PAGE (PRESENTATION MODE)
 * This page is forced to be in a LOCKED state (isPastCutoff = true)
 * to demonstrate post-deadline behavior for presentation.
 */
export default function ExhibitorPortalPresentationPage() {
  const { user } = useAuthStore()
  const [exhibitor, setExhibitor] = useState<(Exhibitor & { staff: Staff[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  
  // FORCE LOCKED STATE for presentation purposes
  const displayCutoffDate = '2020-01-01T00:00:00.000Z'

  const fetchData = useCallback(async () => {
    if (!user?.exhibitorId) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    const result = await getExhibitorForPortal(user.exhibitorId)
    if (result.success && result.exhibitor) {
      setExhibitor(result.exhibitor)
    } else {
      toast.error('Failed to load exhibitor data')
    }
    setLoading(false)
  }, [user?.exhibitorId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!exhibitor) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No Exhibitor Account Found</h2>
          <p className="text-muted-foreground mt-2">Your account is not linked to any exhibitor company.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Presentation Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3">
        <Lock className="h-5 w-5 text-amber-600" />
        <div>
          <h3 className="text-amber-800 font-semibold">Presentation Mode (Locked)</h3>
          <p className="text-amber-700 text-sm">This page simulates the portal after the deadline has passed. All editing is disabled.</p>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exhibitor.companyName}</h1>
          <p className="text-muted-foreground mt-1">
            Exhibitor — Booth {exhibitor.boothNumber}
          </p>
        </div>
        <Badge variant="destructive" className="gap-1 text-sm px-3 py-1">
          <Lock className="h-3.5 w-3.5" />
          Editing Locked
        </Badge>
      </div>

      {/* Company Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
            <CardDescription>
              View your company details. Editing is disabled because the deadline has passed.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Field Section: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Basic Details</h3>
              <div className="space-y-2">
                <Label htmlFor="registrationId">Registration ID</Label>
                <div className="p-2 bg-muted rounded-md text-sm font-mono">{exhibitor.registrationId || '—'}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="p-2 bg-muted rounded-md text-sm font-medium">{exhibitor.companyName}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="boothNumber">Booth No.</Label>
                <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.boothNumber}</div>
              </div>
              <div className="space-y-2">
                <Label>Quota</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {exhibitor.quota} 
                  {exhibitor.overQuota > 0 && (
                    <span className="text-muted-foreground"> + {exhibitor.overQuota} over quota</span>
                  )}
                </div>
              </div>
            </div>

            {/* Field Section: Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Address Details</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.address || '—'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.city || '—'}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.province || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.country || '—'}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.postalCode || '—'}</div>
                </div>
              </div>
            </div>

            {/* Field Section: Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Contact Info</h3>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.contactName || '—'}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.email || '—'}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / Web</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  <div>{exhibitor.phone || '—'}</div>
                  <div className="text-xs text-primary mt-1">{exhibitor.website || ''}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Management */}
      <PortalStaffManagement 
        exhibitor={exhibitor}
        cutoffDate={displayCutoffDate} // Force late date
        onStaffChange={fetchData}
      />
    </div>
  )
}
