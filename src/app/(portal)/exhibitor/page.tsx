'use client'

import { useState, useEffect, useCallback } from 'react'
import { getExhibitorProfile, updateExhibitorProfile, getExhibitorCutoffStatus } from '@/app/actions/exhibitor'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Save, Lock, Mail, Phone, Globe, MapPin, Ticket, Hash, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { PortalStaffManagement } from '@/components/exhibitor/portal-staff-management'
import { CountrySelector } from '@/components/CountrySelector'
import { countries } from '@/lib/countries'

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
  is_quota_full?: boolean
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
  const [exhibitorInfo, setExhibitorInfo] = useState<ExhibitorInfo | null>(null)
  const [members, setMembers] = useState<ExhibitorMember[]>([])
  const [cutoffStatus, setCutoffStatus] = useState<CutoffStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
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
      if (profileResult.error === 'key incorrect') {
        globalThis.dispatchEvent(new Event('auth:expired'))
      } else {
        toast.error(profileResult.error || 'Failed to load exhibitor data')
      }
    }

    if (cutoffResult.success && cutoffResult.data) {
      setCutoffStatus(cutoffResult.data)
    } else if (cutoffResult.error === 'key incorrect') {
      globalThis.dispatchEvent(new Event('auth:expired'))
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
      if (result.error === 'key incorrect') {
        globalThis.dispatchEvent(new Event('auth:expired'))
      } else {
        toast.error(result.error || 'Failed to update company information')
      }
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!exhibitorInfo) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No Exhibitor Account Found</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">Your account is not linked to any exhibitor company. Contact your event organizer for assistance.</p>
        </div>
      </div>
    )
  }

  const isPastCutoff = cutoffStatus ? !cutoffStatus.is_editable : false
  const totalQuota = (exhibitorInfo.quota || 0) + (exhibitorInfo.over_quota || 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{exhibitorInfo.company_name}</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">#{exhibitorInfo.exhibitor_sequence}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span>Booth {exhibitorInfo.booth_no}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPastCutoff ? (
              <Badge variant="destructive" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold">
                <Lock className="h-3 w-3" />
                Editing Locked
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30">
                Editing Open
              </Badge>
            )}
            {cutoffStatus?.cutoff_date && (
              <span className="text-xs text-muted-foreground">
                until {new Date(cutoffStatus.cutoff_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        <StatsCard
          icon={<Hash className="h-5 w-5" />}
          label="Username"
          value={exhibitorInfo.username || '—'}
          iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          icon={<MapPin className="h-5 w-5" />}
          label="Booth Number"
          value={exhibitorInfo.booth_no || '—'}
          iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          icon={<Ticket className="h-5 w-5" />}
          label="Staff Quota"
          value={`${members.length} / ${totalQuota}`}
          iconBg="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          extra={exhibitorInfo.over_quota > 0 ? (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
              +{exhibitorInfo.over_quota} bonus
            </span>
          ) : undefined}
        />
      </div>

      {/* Company Information Card */}
      <Card className="overflow-hidden animate-fade-in-up delay-200">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Building2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              Company Information
            </CardTitle>
            <CardDescription className="text-xs">
              {isEditing ? 'Update your company details below.' : 'Your company profile and contact details.'}
            </CardDescription>
          </div>
          {!isPastCutoff && !isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 rounded-lg text-xs h-8">
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          )}
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1.5 rounded-lg text-xs h-8 text-muted-foreground">
              <X className="h-3 w-3" />
              Cancel
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Details */}
            <FieldSection icon={<Building2 className="h-3.5 w-3.5" />} title="Basic Details">
              <FieldItem label="Company Name" value={exhibitorInfo.company_name} editValue={editForm.company_name} editing={isEditing} onChange={v => setEditForm({...editForm, company_name: v})} />
              <FieldItem label="Booth No." value={exhibitorInfo.booth_no} editValue={editForm.booth_no} editing={isEditing} onChange={v => setEditForm({...editForm, booth_no: v})} />
              <div className="grid grid-cols-2 gap-3">
                <FieldItem label="Quota" value={exhibitorInfo.quota?.toString()} editValue={editForm.quota?.toString()} editing={isEditing} onChange={v => setEditForm({...editForm, quota: Number.parseInt(v) || 0})} type="number" />
                <FieldItem label="Over Quota" value={exhibitorInfo.over_quota?.toString()} editValue={editForm.over_quota?.toString()} editing={isEditing} onChange={v => setEditForm({...editForm, over_quota: Number.parseInt(v) || 0})} type="number" />
              </div>
            </FieldSection>

            {/* Address */}
            <FieldSection icon={<MapPin className="h-3.5 w-3.5" />} title="Address">
              <FieldItem label="Address" value={exhibitorInfo.address} editValue={editForm.address} editing={isEditing} onChange={v => setEditForm({...editForm, address: v})} />
              <div className="grid grid-cols-2 gap-3">
                <FieldItem label="City" value={exhibitorInfo.city} editValue={editForm.city} editing={isEditing} onChange={v => setEditForm({...editForm, city: v})} />
                <FieldItem label="Province" value={exhibitorInfo.province} editValue={editForm.province} editing={isEditing} onChange={v => setEditForm({...editForm, province: v})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {isEditing ? (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">Country</Label>
                    <CountrySelector 
                      value={editForm.country}
                      onChange={v => setEditForm({...editForm, country: v})}
                    />
                  </div>
                ) : (
                  <FieldItem 
                    label="Country" 
                    value={countries.find(c => c.code === exhibitorInfo.country)?.name || exhibitorInfo.country} 
                    editing={false} 
                  />
                )}
                <FieldItem label="Postal Code" value={exhibitorInfo.postal_code} editValue={editForm.postal_code} editing={isEditing} onChange={v => setEditForm({...editForm, postal_code: v})} />
              </div>
            </FieldSection>

            {/* Contact Info */}
            <FieldSection icon={<Mail className="h-3.5 w-3.5" />} title="Contact Info">
              <FieldItem label="Contact Person" value={exhibitorInfo.contact_person} editValue={editForm.contact_person} editing={isEditing} onChange={v => setEditForm({...editForm, contact_person: v})} />
              <FieldItem label="Email" value={exhibitorInfo.contact_email} editValue={editForm.contact_email} editing={isEditing} onChange={v => setEditForm({...editForm, contact_email: v})} type="email" />
              <div className="grid grid-cols-2 gap-3">
                <FieldItem label="Phone" value={exhibitorInfo.tel} editValue={editForm.tel} editing={isEditing} onChange={v => setEditForm({...editForm, tel: v})} icon={<Phone className="h-3 w-3 text-muted-foreground" />} />
                <FieldItem label="Fax" value={exhibitorInfo.fax} editValue={editForm.fax} editing={isEditing} onChange={v => setEditForm({...editForm, fax: v})} />
              </div>
              <FieldItem
                label="Website"
                value={exhibitorInfo.website}
                editValue={editForm.website}
                editing={isEditing}
                onChange={v => setEditForm({...editForm, website: v})}
                icon={<Globe className="h-3 w-3 text-muted-foreground" />}
                isLink
              />
            </FieldSection>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end gap-3 border-t pt-5">
              <Button variant="ghost" onClick={handleCancel} disabled={saving} className="rounded-lg">
                Cancel
              </Button>
              <Button onClick={handleSaveContact} disabled={saving} className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2 shadow-md shadow-emerald-600/20">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Management */}
      <div className="animate-fade-in-up delay-300">
        <PortalStaffManagement 
          exhibitorInfo={exhibitorInfo}
          members={members}
          cutoffStatus={cutoffStatus}
          onStaffChange={fetchData}
        />
      </div>
    </div>
  )
}

/* ─── Sub-components ───────────────────────────────────────── */

function StatsCard({ icon, label, value, iconBg, extra }: Readonly<{
  icon: React.ReactNode
  label: string
  value: string
  iconBg: string
  extra?: React.ReactNode
}>) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-border transition-colors duration-200">
      <CardContent className="flex items-center p-5 gap-4">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold tracking-tight truncate">{value}</p>
            {extra}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FieldSection({ icon, title, children }: Readonly<{
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}>) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-3 rounded-xl border border-border/50 p-4 bg-muted/20">
        {children}
      </div>
    </div>
  )
}

function FieldItem({ label, value, editValue, editing, onChange, type, icon, isLink }: Readonly<{
  label: string
  value?: string
  editValue?: string
  editing: boolean
  onChange?: (v: string) => void
  type?: string
  icon?: React.ReactNode
  isLink?: boolean
}>) {
  if (editing) {
    return (
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">{label}</Label>
        <Input
          value={editValue || ''}
          onChange={e => onChange?.(e.target.value)}
          type={type || 'text'}
          className="h-9 text-sm bg-background rounded-lg border-border/60"
        />
      </div>
    )
  }

  const displayValue = value || '—'
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground uppercase font-medium tracking-wide">{label}</Label>
      <div className="text-sm font-medium flex items-center gap-1.5">
        {icon}
        {isLink && value ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline truncate"
          >
            {value}
          </a>
        ) : (
          <span className="truncate">{displayValue}</span>
        )}
      </div>
    </div>
  )
}
