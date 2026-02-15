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
import { Loader2, Building2, Save, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { PortalStaffManagement } from '@/components/exhibitor/portal-staff-management'

export default function ExhibitorPortalPage() {
  const { user } = useAuthStore()
  const [exhibitor, setExhibitor] = useState<(Exhibitor & { staff: Staff[] }) | null>(null)
  const [cutoffDate, setCutoffDate] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Editable contact fields - expanded to all fields
  const [editForm, setEditForm] = useState({
    companyName: '',
    registrationId: '',
    boothNumber: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
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
        companyName: result.exhibitor.companyName || '',
        registrationId: result.exhibitor.registrationId || '',
        boothNumber: result.exhibitor.boothNumber || '',
        address: result.exhibitor.address || '',
        city: result.exhibitor.city || '',
        province: result.exhibitor.province || '',
        country: result.exhibitor.country || '',
        postalCode: result.exhibitor.postalCode || '',
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
      toast.success('Company information updated')
      setIsEditing(false)
      fetchData()
    } else {
      toast.error('Failed to update company information')
    }
  }

  function handleCancel() {
    if (exhibitor) {
      setEditForm({
        companyName: exhibitor.companyName || '',
        registrationId: exhibitor.registrationId || '',
        boothNumber: exhibitor.boothNumber || '',
        address: exhibitor.address || '',
        city: exhibitor.city || '',
        province: exhibitor.province || '',
        country: exhibitor.country || '',
        postalCode: exhibitor.postalCode || '',
        contactName: exhibitor.contactName || '',
        email: exhibitor.email || '',
        phone: exhibitor.phone || '',
        fax: exhibitor.fax || '',
        website: exhibitor.website || '',
      })
    }
    setIsEditing(false)
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Building2 className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Update your company details below.' : 'View your company details. Click Edit to make changes.'}
            </CardDescription>
          </div>
          {!isPastCutoff && !isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Info
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Field Section: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Basic Details</h3>
              <div className="space-y-2">
                <Label htmlFor="registrationId">Registration ID</Label>
                {isEditing ? (
                  <Input id="registrationId" value={editForm.registrationId} onChange={e => setEditForm({...editForm, registrationId: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm font-mono">{exhibitor.registrationId || '—'}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                {isEditing ? (
                  <Input id="companyName" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm font-medium">{exhibitor.companyName}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="boothNumber">Booth No.</Label>
                {isEditing ? (
                  <Input id="boothNumber" value={editForm.boothNumber} onChange={e => setEditForm({...editForm, boothNumber: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.boothNumber}</div>
                )}
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
                {isEditing ? (
                  <Input id="address" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.address || '—'}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input id="city" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.city || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  {isEditing ? (
                    <Input id="province" value={editForm.province} onChange={e => setEditForm({...editForm, province: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.province || '—'}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Input id="country" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.country || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  {isEditing ? (
                    <Input id="postalCode" value={editForm.postalCode} onChange={e => setEditForm({...editForm, postalCode: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.postalCode || '—'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Field Section: Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">Contact Info</h3>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                {isEditing ? (
                  <Input id="contactName" value={editForm.contactName} onChange={e => setEditForm({...editForm, contactName: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.contactName || '—'}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input id="email" type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitor.email || '—'}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / Web</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    <Input placeholder="Website" value={editForm.website} onChange={e => setEditForm({...editForm, website: e.target.value})} />
                  </div>
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    <div>{exhibitor.phone || '—'}</div>
                    <div className="text-xs text-primary mt-1">{exhibitor.website || ''}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveContact} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          )}
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
