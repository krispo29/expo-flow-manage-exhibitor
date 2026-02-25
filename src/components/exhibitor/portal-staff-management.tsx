'use client'

import { useState, useEffect } from 'react'
import { 
  addExhibitorMember, 
  updateExhibitorMember, 
  toggleExhibitorMemberStatus,
  resendMemberEmailConfirmation 
} from '@/app/actions/exhibitor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2, Printer, AlertTriangle, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { printBadge } from '@/utils/print-badge'

interface ExhibitorInfo {
  exhibitor_uuid: string
  project_uuid: string
  company_name: string
  country?: string
  booth_no: string
  quota: number
  over_quota: number
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

interface PortalStaffManagementProps {
  readonly exhibitorInfo?: ExhibitorInfo | null
  readonly members?: ExhibitorMember[]
  readonly cutoffStatus?: CutoffStatus | null
  readonly onStaffChange?: () => void
}

const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Miss']

export function PortalStaffManagement({ 
  exhibitorInfo, 
  members = [], 
  cutoffStatus,
  onStaffChange 
}: PortalStaffManagementProps) {
  const [memberList, setMemberList] = useState<ExhibitorMember[]>(members)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<ExhibitorMember | null>(null)
  const [isOtherTitle, setIsOtherTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    title_other: '',
    job_position: '',
    email: '',
    mobile_country_code: '66',
    mobile_number: '',
    company_name: '',
    company_country: '',
    company_tel: ''
  })

  // Update member list when props change
  useEffect(() => {
    setMemberList(members)
  }, [members])

  const totalQuota = (exhibitorInfo?.quota || 0) + (exhibitorInfo?.over_quota || 0)
  const staffCount = memberList.length
  const isQuotaFull = staffCount >= totalQuota
  
  const now = new Date()
  const cutoff = cutoffStatus?.cutoff_date ? new Date(cutoffStatus.cutoff_date) : new Date()
  const isPastCutoff = cutoffStatus ? !cutoffStatus.is_editable : false

  function handleOpenDialog(member?: ExhibitorMember) {
    if (isPastCutoff) {
      toast.error('Editing is no longer allowed. The cutoff date has passed.')
      return
    }
    
    if (member) {
      setEditingMember(member)
      const isStandard = TITLES.includes(member.title || '')
      
      let displayTitle = '';
      if (isStandard) {
        displayTitle = member.title;
      } else if (member.title) {
        displayTitle = 'Other';
      }
      
      setFormData({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        title: displayTitle,
        title_other: member.title_other || '',
        job_position: member.job_position || '',
        email: member.email || '',
        mobile_country_code: member.mobile_country_code || '66',
        mobile_number: member.mobile_number || '',
        company_name: member.company_name || '',
        company_country: member.company_country || '',
        company_tel: member.company_tel || ''
      })
      
      if (!isStandard && member.title) {
        setIsOtherTitle(true)
        setCustomTitle(member.title)
      } else {
        setIsOtherTitle(false)
        setCustomTitle('')
      }
    } else {
      if (isQuotaFull) {
        toast.error(`Cannot add more staff. Quota limit reached (${totalQuota}).`)
        return
      }
      setEditingMember(null)
      setFormData({
        first_name: '',
        last_name: '',
        title: '',
        title_other: '',
        job_position: '',
        email: '',
        mobile_country_code: '66',
        mobile_number: '',
        company_name: exhibitorInfo?.company_name || '',
        company_country: '',
        company_tel: ''
      })
      setIsOtherTitle(false)
      setCustomTitle('')
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!exhibitorInfo?.exhibitor_uuid) return
    
    const finalTitle = isOtherTitle ? customTitle : formData.title
    
    const payload = {
      exhibitor_uuid: exhibitorInfo.exhibitor_uuid,
      title: finalTitle,
      title_other: formData.title_other,
      first_name: formData.first_name,
      last_name: formData.last_name,
      job_position: formData.job_position,
      email: formData.email,
      mobile_country_code: formData.mobile_country_code,
      mobile_number: formData.mobile_number,
      company_name: formData.company_name,
      company_country: formData.company_country,
      company_tel: formData.company_tel
    }

    let result
    if (editingMember) {
      result = await updateExhibitorMember({
        ...payload,
        member_uuid: editingMember.member_uuid
      })
    } else {
      result = await addExhibitorMember(payload)
    }

    if (result.success) {
      toast.success(editingMember ? 'Staff updated' : 'Staff added')
      setIsDialogOpen(false)
      onStaffChange?.()
    } else {
      toast.error(result.error || 'Operation failed')
    }
  }

  async function handleToggleStatus(member: ExhibitorMember) {
    if (isPastCutoff) {
      toast.error('Editing is no longer allowed. The cutoff date has passed.')
      return
    }
    if (!exhibitorInfo?.exhibitor_uuid) return
    
    const result = await toggleExhibitorMemberStatus(
      exhibitorInfo.exhibitor_uuid,
      member.member_uuid
    )
    
    if (result.success) {
      toast.success(`Staff ${member.is_active ? 'deactivated' : 'activated'} successfully`)
      onStaffChange?.()
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  async function handleResendEmail(memberUuid: string) {
    const result = await resendMemberEmailConfirmation([memberUuid])
    
    if (result.success) {
      toast.success('Email confirmation sent')
    } else {
      toast.error(result.error || 'Failed to send email')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1 max-w-sm">
          <CardTitle className="flex items-center gap-2">
            Staff Members
            {isPastCutoff && (
              <Badge variant="destructive" className="gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            )}
          </CardTitle>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">Registration Quota</span>
              <span className="font-bold">
                {staffCount} / {totalQuota}
                {(exhibitorInfo?.over_quota || 0) > 0 && (
                  <span className="text-muted-foreground font-normal ml-1">(+{exhibitorInfo?.over_quota} bonus)</span>
                )}
              </span>
            </div>
            <Progress 
              value={totalQuota > 0 ? (staffCount / totalQuota) * 100 : 0} 
              className="h-2"
              // Optional: Add a subtle indicator if quota is full
              indicatorColor={isQuotaFull ? "bg-red-500" : "bg-primary"}
            />
            {isQuotaFull && (
              <p className="text-xs text-red-500 font-medium">Quota limit reached</p>
            )}
          </div>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          size="sm" 
          disabled={isPastCutoff || isQuotaFull}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </CardHeader>
      <CardContent>
        {isPastCutoff && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The editing deadline has passed ({cutoff.toLocaleDateString()}). Staff information can no longer be modified.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : memberList.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <p className="text-lg font-medium">No staff members added yet</p>
            <p className="text-sm mt-1">Click &ldquo;Add Staff&rdquo; to register your team members</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Badge ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberList.map((member) => (
                <TableRow key={member.member_uuid}>
                  <TableCell className="font-mono text-sm">{member.registration_code}</TableCell>
                  <TableCell>{member.title}</TableCell>
                  <TableCell className="font-medium">{member.first_name} {member.last_name}</TableCell>
                  <TableCell>{member.job_position}</TableCell>
                  <TableCell>
                    <div className="text-sm">{member.email}</div>
                    <div className="text-xs text-muted-foreground">+{member.mobile_country_code} {member.mobile_number}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? 'default' : 'secondary'}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          printBadge({
                            firstName: member.first_name || '',
                            lastName: member.last_name || '',
                            companyName: member.company_name || exhibitorInfo?.company_name || '',
                            country: member.company_country || exhibitorInfo?.country || 'THAILAND',
                            registrationCode: member.registration_code,
                            category: 'EXHIBITOR',
                          })
                        }}
                        title="Print Badge"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleResendEmail(member.member_uuid)}
                        title="Resend Email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenDialog(member)}
                        disabled={isPastCutoff}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleStatus(member)}
                        disabled={isPastCutoff}
                        title={member.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update the details for this staff member below.' : `Fill in the details to register a new staff member. You have ${totalQuota - staffCount} slots remaining.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase text-muted-foreground">Title <span className="text-red-500">*</span></Label>
                <div className="col-span-3 flex gap-2">
                  <Select 
                    value={formData.title} 
                    onValueChange={(value) => {
                      if (value === 'Other') {
                        setIsOtherTitle(true)
                        setFormData({...formData, title: 'Other'})
                      } else {
                        setIsOtherTitle(false)
                        setFormData({...formData, title: value})
                        setCustomTitle('')
                      }
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {isOtherTitle && (
                    <Input 
                      placeholder="Specify title" 
                      value={customTitle} 
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="flex-1"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-xs font-semibold uppercase text-muted-foreground">First Name <span className="text-red-500">*</span></Label>
                <Input id="first_name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="bg-muted/50 focus:bg-background" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-xs font-semibold uppercase text-muted-foreground">Last Name <span className="text-red-500">*</span></Label>
                <Input id="last_name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="bg-muted/50 focus:bg-background" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_position" className="text-xs font-semibold uppercase text-muted-foreground">Position</Label>
                <Input id="job_position" value={formData.job_position} onChange={e => setFormData({...formData, job_position: e.target.value})} className="bg-muted/50 focus:bg-background" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-muted/50 focus:bg-background" placeholder="email@example.com" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mobile" className="text-xs font-semibold uppercase text-muted-foreground">Mobile Number</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.mobile_country_code}
                    onValueChange={(value) => setFormData({...formData, mobile_country_code: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="66">+66</SelectItem>
                      <SelectItem value="63">+63</SelectItem>
                      <SelectItem value="65">+65</SelectItem>
                      <SelectItem value="60">+60</SelectItem>
                      <SelectItem value="62">+62</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="mobile" 
                    value={formData.mobile_number} 
                    onChange={e => setFormData({...formData, mobile_number: e.target.value})} 
                    className="flex-1 bg-muted/50 focus:bg-background"
                    placeholder="Enter mobile number without leading zero"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-xs font-semibold uppercase text-muted-foreground">Company Name</Label>
                <Input id="company_name" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="bg-muted/50 focus:bg-background" placeholder={exhibitorInfo?.company_name || 'Company Name'} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_tel" className="text-xs font-semibold uppercase text-muted-foreground">Company Telephone</Label>
                <Input id="company_tel" value={formData.company_tel} onChange={e => setFormData({...formData, company_tel: e.target.value})} className="bg-muted/50 focus:bg-background" placeholder="e.g. +66 2 123 4567" />
              </div>
            </div>
            <DialogFooter className="mt-6 border-t pt-4">
              <Button type="submit">{editingMember ? 'Save Changes' : 'Add Staff'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
