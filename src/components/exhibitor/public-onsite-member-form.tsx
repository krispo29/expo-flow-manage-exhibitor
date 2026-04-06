'use client'

import { FormEvent, useMemo, useState } from 'react'
import { addPublicOnsiteExhibitorMember } from '@/app/actions/exhibitor'
import { ConfirmationBadge } from '@/components/confirmation-badge'
import { CountrySelector } from '@/components/CountrySelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { countries } from '@/lib/countries'
import { openBadgePreviewWindow, openBadgePrintWindow } from '@/lib/badge-template'
import { ArrowRight, BadgePlus, CheckCircle2, ExternalLink, Loader2, Printer } from 'lucide-react'
import { toast } from 'sonner'

const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Miss']

type PublicOnsiteMemberFormProps = {
  readonly exhibitorUuid: string
}

type FormState = {
  first_name: string
  last_name: string
  title: string
  title_other: string
  job_position: string
  email: string
  mobile_country_code: string
  mobile_number: string
  company_name: string
  company_country: string
  company_tel: string
}

type RegisteredMemberPreview = {
  first_name: string
  last_name: string
  job_position: string
  company_name: string
  company_country: string
  registration_code: string
}

const INITIAL_FORM_STATE: FormState = {
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
  company_tel: '',
}

export function PublicOnsiteMemberForm({ exhibitorUuid }: PublicOnsiteMemberFormProps) {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE)
  const [isOtherTitle, setIsOtherTitle] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredMember, setRegisteredMember] = useState<RegisteredMemberPreview | null>(null)

  const selectedPhoneCountry = useMemo(
    () => countries.find((country) => country.phoneCode.replace('+', '') === formData.mobile_country_code)?.code || '',
    [formData.mobile_country_code]
  )

  function resetForm() {
    setFormData(INITIAL_FORM_STATE)
    setIsOtherTitle(false)
    setCustomTitle('')
  }

  function fillMockData() {
    setIsOtherTitle(false)
    setCustomTitle('')
    setFormData({
      first_name: 'Test',
      last_name: 'Member',
      title: 'Mr.',
      title_other: '',
      job_position: 'Sales Manager',
      email: `test.member.${Date.now()}@example.com`,
      mobile_country_code: '66',
      mobile_number: '812345678',
      company_name: 'Mockup Exhibitor Co., Ltd.',
      company_country: 'TH',
      company_tel: '022222222',
    })
    toast.success('Mockup data filled')
  }

  function extractRegistrationCode(payload: unknown): string {
    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload.trim()
    }

    if (!payload || typeof payload !== 'object') {
      return ''
    }

    const record = payload as Record<string, unknown>
    const directCode = [record.registration_code, record.code, record.registrationCode].find(
      (value): value is string => typeof value === 'string' && value.trim().length > 0
    )

    if (directCode) {
      return directCode
    }

    const nestedRecord = [record.member, record.data, record.result].find(
      (value): value is Record<string, unknown> => Boolean(value) && typeof value === 'object'
    )

    if (!nestedRecord) {
      return ''
    }

    return [nestedRecord.registration_code, nestedRecord.code, nestedRecord.registrationCode].find(
      (value): value is string => typeof value === 'string' && value.trim().length > 0
    ) || ''
  }

  function openRegisteredBadgePreview() {
    if (!registeredMember) {
      return
    }

    openBadgePreviewWindow(`Preview Badge - ${registeredMember.registration_code}`, [
      {
        firstName: registeredMember.first_name,
        lastName: registeredMember.last_name,
        position: registeredMember.job_position,
        companyName: registeredMember.company_name,
        countryLabel: countries.find((country) => country.code === registeredMember.company_country)?.name || registeredMember.company_country,
        registrationCode: registeredMember.registration_code,
        category: 'EXHIBITOR',
      },
    ])
  }

  function openRegisteredBadgePrint() {
    if (!registeredMember) {
      return
    }

    openBadgePrintWindow(`Print Badge - ${registeredMember.registration_code}`, [
      {
        firstName: registeredMember.first_name,
        lastName: registeredMember.last_name,
        position: registeredMember.job_position,
        companyName: registeredMember.company_name,
        countryLabel: countries.find((country) => country.code === registeredMember.company_country)?.name || registeredMember.company_country,
        registrationCode: registeredMember.registration_code,
        category: 'EXHIBITOR',
      },
    ])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const finalTitle = isOtherTitle ? customTitle.trim() : formData.title

    if (!finalTitle) {
      toast.error('Please select or enter a title')
      return
    }

    setIsSubmitting(true)

    const result = await addPublicOnsiteExhibitorMember({
      exhibitor_uuid: exhibitorUuid,
      title: finalTitle,
      title_other: formData.title_other.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      job_position: formData.job_position.trim(),
      mobile_country_code: formData.mobile_country_code.trim(),
      mobile_number: formData.mobile_number.trim(),
      email: formData.email.trim(),
      company_name: formData.company_name.trim(),
      company_country: formData.company_country,
      company_tel: formData.company_tel.trim(),
    })

    setIsSubmitting(false)

    if (!result.success) {
      toast.error(result.error || 'Failed to add member')
      return
    }

    const registrationCode = extractRegistrationCode(result.data)
    const submittedMember = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      job_position: formData.job_position.trim(),
      company_name: formData.company_name.trim(),
      company_country: formData.company_country,
      registration_code: registrationCode,
    }

    setRegisteredMember(submittedMember)
    setIsSuccess(true)
    resetForm()
    toast.success('Member registered successfully')
  }

  if (isSuccess) {
    return (
      <Card className="border-emerald-200/80 bg-white/90 shadow-2xl shadow-emerald-950/10 backdrop-blur">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Registration submitted</h2>
            <p className="text-sm text-slate-600">
              Your onsite member information has been sent successfully.
            </p>
          </div>

          {registeredMember?.registration_code ? (
            <>
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Registration Code
                </p>
                <p className="mt-2 font-mono text-lg font-bold text-slate-800">
                  {registeredMember.registration_code}
                </p>
              </div>

              <div className="w-full overflow-auto rounded-[2rem] border border-slate-200 bg-slate-100/70 px-4 py-6">
                <ConfirmationBadge
                  firstName={registeredMember.first_name}
                  lastName={registeredMember.last_name}
                  companyName={registeredMember.company_name}
                  countryCode={registeredMember.company_country}
                  registrationCode={registeredMember.registration_code}
                  category="EXHIBITOR"
                  position={registeredMember.job_position}
                />
              </div>

              <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm leading-6 text-amber-900">
                If you close this page, the QR code will disappear. Please do not close this page until it has been scanned.
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openRegisteredBadgePreview}
                  className="h-11 flex-1 rounded-2xl border-slate-300"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview Window
                </Button>
                <Button
                  type="button"
                  onClick={openRegisteredBadgePrint}
                  className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white hover:from-emerald-600 hover:to-teal-600"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Badge
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Registration completed, but no badge code was found in the response.
            </div>
          )}

          <Button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="h-11 rounded-2xl bg-emerald-700 px-5 text-white hover:bg-emerald-600"
          >
            Add another member
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
      <CardContent className="p-6 sm:p-8">
        <div className="mb-8 space-y-3">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <BadgePlus className="h-3.5 w-3.5" />
              Public Onsite
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">Add Member</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Complete the form below to register an exhibitor team member for onsite access.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Title <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.title}
                  onValueChange={(value) => {
                    if (value === 'Other') {
                      setIsOtherTitle(true)
                      setFormData((current) => ({ ...current, title: value }))
                      return
                    }

                    setIsOtherTitle(false)
                    setCustomTitle('')
                    setFormData((current) => ({ ...current, title: value }))
                  }}
                >
                  <SelectTrigger className="h-11 w-[130px] rounded-xl border-slate-200 bg-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {TITLES.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {isOtherTitle && (
                  <Input
                    value={customTitle}
                    onChange={(event) => setCustomTitle(event.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    placeholder="Specify title"
                    required
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_other" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Title Other
              </Label>
              <Input
                id="title_other"
                value={formData.title_other}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, title_other: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, first_name: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, last_name: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_position" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Job Position <span className="text-red-500">*</span>
              </Label>
              <Input
                id="job_position"
                value={formData.job_position}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, job_position: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mobile_number" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="sm:w-[180px] sm:shrink-0">
                  <CountrySelector
                    value={selectedPhoneCountry}
                    onChange={(countryCode) => {
                      const country = countries.find((item) => item.code === countryCode)
                      if (!country) return

                      setFormData((current) => ({
                        ...current,
                        mobile_country_code: country.phoneCode.replace('+', ''),
                      }))
                    }}
                    displayProperty="phoneCode"
                  />
                </div>
                <Input
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, mobile_number: event.target.value }))
                  }
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company_name: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company Country <span className="text-red-500">*</span>
              </Label>
              <CountrySelector
                value={formData.company_country}
                onChange={(countryCode) =>
                  setFormData((current) => ({ ...current, company_country: countryCode }))
                }
                placeholder="Select country"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company_tel" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company Telephone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company_tel"
                value={formData.company_tel}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company_tel: event.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 bg-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Please verify the details carefully before submitting.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={fillMockData}
                disabled={isSubmitting}
                className="h-11 rounded-2xl border-slate-300"
              >
                Fill Mockup Data
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 px-5 text-white hover:from-emerald-600 hover:to-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit member
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
