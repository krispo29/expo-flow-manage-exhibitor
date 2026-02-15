'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStaffByExhibitorId, createStaff, updateStaff, deleteStaff, checkDuplicateEmail, sendConfirmationEmail } from '@/app/actions/staff'
import { Staff, Exhibitor } from '@/lib/mock-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Plus, Pencil, Trash2, Loader2, Printer, AlertTriangle, Lock, CheckCircle, Mail } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface PortalStaffManagementProps {
  readonly exhibitor: Exhibitor & { staff: Staff[] }
  readonly cutoffDate: string
  readonly onStaffChange?: () => void
}

export function PortalStaffManagement({ exhibitor, cutoffDate, onStaffChange }: PortalStaffManagementProps) {
  const [staffList, setStaffList] = useState<Staff[]>(exhibitor.staff || [])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isOtherTitle, setIsOtherTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    position: '',
    email: '',
    mobile: ''
  })

  const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Miss']
  
  const totalQuota = exhibitor.quota + exhibitor.overQuota
  const staffCount = staffList.length
  const isQuotaFull = staffCount >= totalQuota
  
  const now = new Date()
  const cutoff = new Date(cutoffDate)
  const isPastCutoff = now > cutoff

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    const result = await getStaffByExhibitorId(exhibitor.id)
    if (result.success && result.staff) {
      setStaffList(result.staff)
    }
    setLoading(false)
  }, [exhibitor.id])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  function handleOpenDialog(staff?: Staff) {
    if (isPastCutoff) {
      toast.error('Editing is no longer allowed. The cutoff date has passed.')
      return
    }
    
    if (staff) {
      setEditingStaff(staff)
      const isStandard = TITLES.includes(staff.title || '')
      
      let displayTitle = '';
      if (isStandard) {
        displayTitle = staff.title;
      } else if (staff.title) {
        displayTitle = 'Other';
      }
      
      setFormData({
        firstName: staff.firstName || '',
        lastName: staff.lastName || '',
        title: displayTitle,
        position: staff.position || '',
        email: staff.email || '',
        mobile: staff.mobile || ''
      })
      
      if (!isStandard && staff.title) {
        setIsOtherTitle(true)
        setCustomTitle(staff.title)
      } else {
        setIsOtherTitle(false)
        setCustomTitle('')
      }
    } else {
      if (isQuotaFull) {
        toast.error(`Cannot add more staff. Quota limit reached (${totalQuota}).`)
        return
      }
      setEditingStaff(null)
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        position: '',
        email: '',
        mobile: ''
      })
      setIsOtherTitle(false)
      setCustomTitle('')
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const finalTitle = isOtherTitle ? customTitle : formData.title
    
    // Check for duplicate email
    if (formData.email) {
      const dupResult = await checkDuplicateEmail(
        exhibitor.id, 
        formData.email, 
        editingStaff?.id
      )
      if (dupResult.success && dupResult.isDuplicate) {
        toast.warning('Warning: This email is already used by another staff member. It is recommended to use a unique email for each staff.', {
          duration: 5000,
        })
        // Important: We still allow saving — just warn
      }
    }
    
    const payload = {
      title: finalTitle,
      firstName: formData.firstName,
      lastName: formData.lastName,
      position: formData.position,
      email: formData.email,
      mobile: formData.mobile,
    }

    let result
    if (editingStaff) {
      result = await updateStaff(editingStaff.id, payload)
    } else {
      result = await createStaff({
        ...payload,
        exhibitorId: exhibitor.id,
      })
    }

    if (result.success) {
      toast.success(editingStaff ? 'Staff updated' : 'Staff added')
      setIsDialogOpen(false)
      
      // Send confirmation email only on first creation (not edit)
      if (!editingStaff && result.staff) {
        const confirmResult = await sendConfirmationEmail(result.staff.id)
        if (confirmResult.success) {
          toast.success('Confirmation email sent to ' + formData.email, { duration: 4000 })
        }
      }
      
      fetchStaff()
      onStaffChange?.()
    } else {
      toast.error(result.error || 'Operation failed')
    }
  }

  async function handleDelete(id: string) {
    if (isPastCutoff) {
      toast.error('Editing is no longer allowed. The cutoff date has passed.')
      return
    }
    
    toast("Delete this staff member?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const result = await deleteStaff(id)
          if (result.success) {
            toast.success('Staff deleted')
            setStaffList(staffList.filter(s => s.id !== id))
            onStaffChange?.()
          } else {
            toast.error('Failed to delete staff')
          }
        },
      },
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Staff Members
            {isPastCutoff && (
              <Badge variant="destructive" className="gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="mt-1">
            <span className="font-medium">
              {staffCount} / {exhibitor.quota} 
            </span>
            {exhibitor.overQuota > 0 && (
              <span className="text-muted-foreground"> + {exhibitor.overQuota} over quota</span>
            )}
            {' '}staff registered
            {isQuotaFull && (
              <Badge variant="secondary" className="ml-2 text-xs">Quota Full</Badge>
            )}
          </CardDescription>
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
        ) : staffList.length === 0 ? (
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
                <TableHead>Email Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-mono text-sm">{staff.id}</TableCell>
                  <TableCell>{staff.title}</TableCell>
                  <TableCell className="font-medium">{staff.firstName} {staff.lastName}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>
                    <div className="text-sm">{staff.email}</div>
                    <div className="text-xs text-muted-foreground">{staff.mobile}</div>
                  </TableCell>
                  <TableCell>
                    {staff.emailSent ? (
                      <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
                        <CheckCircle className="h-3 w-3" />
                        Sent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-200 bg-orange-50">
                        <Mail className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Print Badge">
                        <Link href={`/exhibitor/print-badge/${staff.id}`}>
                          <Printer className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenDialog(staff)}
                        disabled={isPastCutoff}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(staff.id)}
                        disabled={isPastCutoff}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
            <DialogDescription>
              {editingStaff ? 'Update staff details.' : `Add a new staff member. (${staffCount}/${totalQuota} slots used)`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Position</Label>
                <Input id="position" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile" className="text-right">Mobile</Label>
                <Input id="mobile" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingStaff ? 'Save Changes' : 'Add Staff'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
