'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { getExhibitorForPortal, updateExhibitor } from '@/app/actions/exhibitor'
import { Exhibitor, Staff } from '@/lib/mock-service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { Loader2, Building2, Save, AlertTriangle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { PortalStaffManagement } from '@/components/exhibitor/portal-staff-management'

export default function ExhibitorPortalPage() {
  const { user } = useAuthStore()
  const [exhibitor, setExhibitor] = useState<(Exhibitor & { staff: Staff[] }) | null>(null)
  const [cutoffDate, setCutoffDate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Editable contact fields
  const [editForm, setEditForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    fax: '',
    website: '',
  })
  
  const isPastCutoff = cutoffDate ? new Date() > new Date(cutoffDate) : false

  const fetchData = useCallback(async () => {
    if (!user?.exhibitorId) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    const result = await getExhibitorForPortal(user.exhibitorId)
    if (result.success && result.exhibitor) {
      setExhibitor(result.exhibitor)
      setCutoffDate(result.cutoffDate || '')
      setEditForm({
        contactName: result.exhibitor.contactName || '',
        email: result.exhibitor.email || '',
        phone: result.exhibitor.phone || '',
        fax: result.exhibitor.fax || '',
        website: result.exhibitor.website || '',
      })
    } else {
      toast.error('Failed to load exhibitor data')
    }
    setLoading(false)
  }, [user?.exhibitorId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSaveContact() {
    if (!exhibitor || isPastCutoff) return
    
    setSaving(true)
    const result = await updateExhibitor(exhibitor.id, editForm)
    setSaving(false)
    
    if (result.success) {
      toast.success('Contact information updated')
      fetchData()
    } else {
      toast.error('Failed to update contact information')
    }
  }

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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exhibitor.companyName}</h1>
          <p className="text-muted-foreground mt-1">
            Exhibitor Portal — Booth {exhibitor.boothNumber}
          </p>
        </div>
        {isPastCutoff ? (
          <Badge variant="destructive" className="gap-1 text-sm px-3 py-1">
            <Lock className="h-3.5 w-3.5" />
            Editing Locked
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-sm px-3 py-1 text-green-700 border-green-300 bg-green-50">
            Editing Open until {new Date(cutoffDate).toLocaleDateString()}
          </Badge>
        )}
      </div>

      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Company details configured by the administrator. Contact information can be edited.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Read-only Admin Fields */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Registration Details (Read-only)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Registration ID</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm font-mono">
                  {exhibitor.registrationId || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Company Name</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm font-medium">
                  {exhibitor.companyName}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Booth No.</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.boothNumber}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Address</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.address || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">City</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.city || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Province</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.province || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Country</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.country || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Postal Code</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.postalCode || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quota</Label>
                <div className="mt-1 p-2 bg-muted rounded-md text-sm">
                  {exhibitor.quota} 
                  {exhibitor.overQuota > 0 && (
                    <span className="text-muted-foreground"> + {exhibitor.overQuota} over quota</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Editable Contact Fields */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Contact Information (Editable)
            </h3>
            {isPastCutoff && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The editing deadline has passed. Contact information can no longer be modified.
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input 
                  id="contactName" 
                  value={editForm.contactName} 
                  onChange={(e) => setEditForm({...editForm, contactName: e.target.value})}
                  disabled={isPastCutoff}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  disabled={isPastCutoff}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telephone</Label>
                <Input 
                  id="phone" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  disabled={isPastCutoff}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input 
                  id="fax" 
                  value={editForm.fax} 
                  onChange={(e) => setEditForm({...editForm, fax: e.target.value})}
                  disabled={isPastCutoff}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={editForm.website} 
                  onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                  disabled={isPastCutoff}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleSaveContact} 
                disabled={isPastCutoff || saving}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Contact Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Management */}
      <PortalStaffManagement 
        exhibitor={exhibitor}
        cutoffDate={cutoffDate}
        onStaffChange={fetchData}
      />
    </div>
  )
}
