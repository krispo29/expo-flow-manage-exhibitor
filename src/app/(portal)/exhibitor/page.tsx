'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { getExhibitorProfile, updateExhibitorProfile, getExhibitorCutoffStatus } from '@/app/actions/exhibitor'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Save, Lock, Mail, Phone, Globe, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { PortalStaffManagement } from '@/components/exhibitor/portal-staff-management'

interface ExhibitorInfo {
  exhibitor_uuid: string
  project_uuid: string
  event_uuid: string
  username: string
  company_name: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  tel: string
  fax: string
  contact_person: string
  contact_email: string
  website: string
  booth_no: string
  quota: number
  over_quota: number
  is_active: boolean
  is_credential_email_sent: boolean
  created_at: string
  updated_at: string
  last_login: string
  exhibitor_sequence: number
}

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

interface CutoffStatus {
  is_editable: boolean
  cutoff_date: string
}

export default function ExhibitorPortalPage() {
  const { user } = useAuthStore()
  const [exhibitorInfo, setExhibitorInfo] = useState<ExhibitorInfo | null>(null)
  const [members, setMembers] = useState<ExhibitorMember[]>([])
  const [cutoffStatus, setCutoffStatus] = useState<CutoffStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Editable contact fields
  const [editForm, setEditForm] = useState({
    company_name: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postal_code: '',
    tel: '',
    fax: '',
    contact_person: '',
    contact_email: '',
    website: '',
    booth_no: '',
    quota: 0,
    over_quota: 0,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    
    // Fetch profile and cutoff status in parallel
    const [profileResult, cutoffResult] = await Promise.all([
      getExhibitorProfile(),
      getExhibitorCutoffStatus()
    ])

    if (profileResult.success && profileResult.data) {
      const data = profileResult.data
      setExhibitorInfo(data.info)
      setMembers(data.members || [])
      setEditForm({
        company_name: data.info.company_name || '',
        address: data.info.address || '',
        city: data.info.city || '',
        province: data.info.province || '',
        country: data.info.country || '',
        postal_code: data.info.postal_code || '',
        tel: data.info.tel || '',
        fax: data.info.fax || '',
        contact_person: data.info.contact_person || '',
        contact_email: data.info.contact_email || '',
        website: data.info.website || '',
        booth_no: data.info.booth_no || '',
        quota: data.info.quota || 0,
        over_quota: data.info.over_quota || 0,
      })
    } else {
      toast.error(profileResult.error || 'Failed to load exhibitor data')
    }

    if (cutoffResult.success && cutoffResult.data) {
      setCutoffStatus(cutoffResult.data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSaveContact() {
    if (!exhibitorInfo || !cutoffStatus?.is_editable) return
    
    setSaving(true)
    const result = await updateExhibitorProfile(editForm)
    setSaving(false)
    
    if (result.success) {
      toast.success('Company information updated')
      setIsEditing(false)
      fetchData()
    } else {
      toast.error(result.error || 'Failed to update company information')
    }
  }

  function handleCancel() {
    if (exhibitorInfo) {
      setEditForm({
        company_name: exhibitorInfo.company_name || '',
        address: exhibitorInfo.address || '',
        city: exhibitorInfo.city || '',
        province: exhibitorInfo.province || '',
        country: exhibitorInfo.country || '',
        postal_code: exhibitorInfo.postal_code || '',
        tel: exhibitorInfo.tel || '',
        fax: exhibitorInfo.fax || '',
        contact_person: exhibitorInfo.contact_person || '',
        contact_email: exhibitorInfo.contact_email || '',
        website: exhibitorInfo.website || '',
        booth_no: exhibitorInfo.booth_no || '',
        quota: exhibitorInfo.quota || 0,
        over_quota: exhibitorInfo.over_quota || 0,
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

  if (!exhibitorInfo) {
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

  const isPastCutoff = cutoffStatus ? !cutoffStatus.is_editable : false

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exhibitorInfo.company_name}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="font-mono text-sm">#{exhibitorInfo.exhibitor_sequence}</span>
            <span>•</span>
            <span>Booth {exhibitorInfo.booth_no}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isPastCutoff ? (
            <Badge variant="destructive" className="gap-1 text-sm px-3 py-1">
              <Lock className="h-3.5 w-3.5" />
              Editing Locked
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-sm px-3 py-1 text-green-700 border-green-300 bg-green-50">
              Editing Open
            </Badge>
          )}
          {cutoffStatus?.cutoff_date && (
            <span className="text-sm text-muted-foreground">
              until {new Date(cutoffStatus.cutoff_date).toLocaleDateString()}
            </span>
          )}
        </div>
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
                <Label htmlFor="username">Registration ID</Label>
                <div className="p-2 bg-muted rounded-md text-sm font-mono">{exhibitorInfo.username || '—'}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                {isEditing ? (
                  <Input id="company_name" value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm font-medium">{exhibitorInfo.company_name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="booth_no">Booth No.</Label>
                {isEditing ? (
                  <Input id="booth_no" value={editForm.booth_no} onChange={e => setEditForm({...editForm, booth_no: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.booth_no}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Quota</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {exhibitorInfo.quota} 
                  {exhibitorInfo.over_quota > 0 && (
                    <span className="text-muted-foreground"> + {exhibitorInfo.over_quota} over quota</span>
                  )}
                </div>
              </div>
            </div>

            {/* Field Section: Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input id="address" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.address || '—'}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input id="city" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.city || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  {isEditing ? (
                    <Input id="province" value={editForm.province} onChange={e => setEditForm({...editForm, province: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.province || '—'}</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Input id="country" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.country || '—'}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  {isEditing ? (
                    <Input id="postal_code" value={editForm.postal_code} onChange={e => setEditForm({...editForm, postal_code: e.target.value})} />
                  ) : (
                    <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.postal_code || '—'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Field Section: Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Info
              </h3>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                {isEditing ? (
                  <Input id="contact_person" value={editForm.contact_person} onChange={e => setEditForm({...editForm, contact_person: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.contact_person || '—'}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                {isEditing ? (
                  <Input id="contact_email" type="email" value={editForm.contact_email} onChange={e => setEditForm({...editForm, contact_email: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">{exhibitorInfo.contact_email || '—'}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Phone / Fax</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input id="tel" placeholder="Phone" value={editForm.tel} onChange={e => setEditForm({...editForm, tel: e.target.value})} />
                    <Input placeholder="Fax" value={editForm.fax} onChange={e => setEditForm({...editForm, fax: e.target.value})} />
                  </div>
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {exhibitorInfo.tel || '—'}
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">{exhibitorInfo.fax || ''}</div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input id="website" value={editForm.website} onChange={e => setEditForm({...editForm, website: e.target.value})} />
                ) : (
                  <div className="p-2 bg-muted rounded-md text-sm flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    {exhibitorInfo.website || '—'}
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
        exhibitorInfo={exhibitorInfo}
        members={members}
        cutoffStatus={cutoffStatus}
        onStaffChange={fetchData}
      />
    </div>
  )
}
