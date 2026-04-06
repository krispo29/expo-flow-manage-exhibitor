'use client'

import { FormEvent, useMemo, useState } from 'react'
import { addPublicOnsiteExhibitorMember } from '@/app/actions/exhibitor'

import { CountrySelector } from '@/components/CountrySelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { countries } from '@/lib/countries'
import { openBadgePreviewWindow } from '@/lib/badge-template'
import {
  ArrowLeft,
  ArrowRight,
  BadgePlus,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'

const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Miss']
const MAX_MEMBERS = 20

type WizardStep = 'select-count' | 'fill-forms' | 'review' | 'submitting' | 'complete'

type MemberFormData = {
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

type RegisteredMemberResult = {
  index: number
  first_name: string
  last_name: string
  job_position: string
  company_name: string
  company_country: string
  registration_code: string
  success: boolean
  error?: string
}

const EMPTY_MEMBER: MemberFormData = {
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

type PublicOnsiteWizardProps = {
  readonly exhibitorUuid: string
}

export function PublicOnsiteWizard({ exhibitorUuid }: PublicOnsiteWizardProps) {
  const [step, setStep] = useState<WizardStep>('select-count')
  const [memberCount, setMemberCount] = useState(1)

  const [members, setMembers] = useState<MemberFormData[]>([EMPTY_MEMBER])
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0)
  const [otherTitleStates, setOtherTitleStates] = useState<boolean[]>([false])
  const [customTitles, setCustomTitles] = useState<string[]>([''])
  const [results, setResults] = useState<RegisteredMemberResult[]>([])
  const [submittingIndex, setSubmittingIndex] = useState(-1)


  const currentMember = members[currentMemberIndex]
  const progressPercent = ((currentMemberIndex + 1) / memberCount) * 100

  function initializeMembers(count: number) {
    setMembers(Array.from({ length: count }, () => ({ ...EMPTY_MEMBER })))
    setOtherTitleStates(Array.from({ length: count }, () => false))
    setCustomTitles(Array.from({ length: count }, () => ''))
    setCurrentMemberIndex(0)
  }



  function handleContinueFromCount() {
    initializeMembers(memberCount)
    setStep('fill-forms')
  }

  function updateCurrentMember(field: keyof MemberFormData, value: string) {
    setMembers((prev) => {
      const updated = [...prev]
      updated[currentMemberIndex] = { ...updated[currentMemberIndex], [field]: value }
      return updated
    })
  }

  function handleTitleChange(value: string) {
    if (value === 'Other') {
      setOtherTitleStates((prev) => {
        const updated = [...prev]
        updated[currentMemberIndex] = true
        return updated
      })
      updateCurrentMember('title', value)
      return
    }

    setOtherTitleStates((prev) => {
      const updated = [...prev]
      updated[currentMemberIndex] = false
      return updated
    })
    setCustomTitles((prev) => {
      const updated = [...prev]
      updated[currentMemberIndex] = ''
      return updated
    })
    updateCurrentMember('title', value)
  }

  function handleCustomTitleChange(value: string) {
    setCustomTitles((prev) => {
      const updated = [...prev]
      updated[currentMemberIndex] = value
      return updated
    })
  }

  function validateCurrentMember(): boolean {
    const m = members[currentMemberIndex]
    const isOther = otherTitleStates[currentMemberIndex]
    const finalTitle = isOther ? customTitles[currentMemberIndex]?.trim() : m.title

    if (!finalTitle) {
      toast.error('Please select or enter a title')
      return false
    }
    if (!m.first_name.trim()) {
      toast.error('Please enter a first name')
      return false
    }
    if (!m.last_name.trim()) {
      toast.error('Please enter a last name')
      return false
    }
    if (!m.job_position.trim()) {
      toast.error('Please enter a job position')
      return false
    }
    if (!m.email.trim()) {
      toast.error('Please enter an email')
      return false
    }
    if (!m.mobile_number.trim()) {
      toast.error('Please enter a mobile number')
      return false
    }
    if (!m.company_name.trim()) {
      toast.error('Please enter a company name')
      return false
    }
    if (!m.company_country) {
      toast.error('Please select a company country')
      return false
    }
    if (!m.company_tel.trim()) {
      toast.error('Please enter a company telephone')
      return false
    }
    return true
  }

  function handleNextMember() {
    if (!validateCurrentMember()) return

    if (currentMemberIndex < memberCount - 1) {
      setCurrentMemberIndex((prev) => prev + 1)
    } else {
      setStep('review')
    }
  }

  function handlePrevMember() {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex((prev) => prev - 1)
    } else {
      setStep('select-count')
    }
  }

  function handleEditMember(index: number) {
    setCurrentMemberIndex(index)
    setStep('fill-forms')
  }

  function handleRemoveMemberFromReview(index: number) {
    if (members.length <= 1) {
      toast.error('At least one member is required')
      return
    }
    setMembers((prev) => prev.filter((_, i) => i !== index))
    setOtherTitleStates((prev) => prev.filter((_, i) => i !== index))
    setCustomTitles((prev) => prev.filter((_, i) => i !== index))
    setMemberCount((prev) => prev - 1)
  }

  function extractRegistrationCode(payload: unknown): string {
    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload.trim()
    }
    if (!payload || typeof payload !== 'object') return ''
    const record = payload as Record<string, unknown>
    const directCode = [record.registration_code, record.code, record.registrationCode].find(
      (v): v is string => typeof v === 'string' && v.trim().length > 0
    )
    if (directCode) return directCode
    const nested = [record.member, record.data, record.result].find(
      (v): v is Record<string, unknown> => Boolean(v) && typeof v === 'object'
    )
    if (!nested) return ''
    return (
      [nested.registration_code, nested.code, nested.registrationCode].find(
        (v): v is string => typeof v === 'string' && v.trim().length > 0
      ) || ''
    )
  }

  async function handleSubmitAll() {
    setStep('submitting')
    const allResults: RegisteredMemberResult[] = []

    for (let i = 0; i < members.length; i++) {
      setSubmittingIndex(i)
      const m = members[i]
      const isOther = otherTitleStates[i]
      const finalTitle = isOther ? customTitles[i]?.trim() : m.title

      try {
        const result = await addPublicOnsiteExhibitorMember({
          exhibitor_uuid: exhibitorUuid,
          title: finalTitle || m.title,
          title_other: m.title_other.trim(),
          first_name: m.first_name.trim(),
          last_name: m.last_name.trim(),
          job_position: m.job_position.trim(),
          mobile_country_code: m.mobile_country_code.trim(),
          mobile_number: m.mobile_number.trim(),
          email: m.email.trim(),
          company_name: m.company_name.trim(),
          company_country: m.company_country,
          company_tel: m.company_tel.trim(),
        })

        allResults.push({
          index: i,
          first_name: m.first_name.trim(),
          last_name: m.last_name.trim(),
          job_position: m.job_position.trim(),
          company_name: m.company_name.trim(),
          company_country: m.company_country,
          registration_code: result.success ? extractRegistrationCode(result.data) : '',
          success: result.success === true,
          error: result.success ? undefined : (result.error || 'Unknown error'),
        })
      } catch {
        allResults.push({
          index: i,
          first_name: m.first_name.trim(),
          last_name: m.last_name.trim(),
          job_position: m.job_position.trim(),
          company_name: m.company_name.trim(),
          company_country: m.company_country,
          registration_code: '',
          success: false,
          error: 'Network error',
        })
      }
    }

    setResults(allResults)
    setSubmittingIndex(-1)
    setStep('complete')

    const successCount = allResults.filter((r) => r.success).length
    if (successCount === allResults.length) {
      toast.success(`All ${successCount} member(s) registered successfully!`)
    } else {
      toast.warning(`${successCount} of ${allResults.length} member(s) registered successfully`)
    }
  }

  function handleStartOver() {
    setStep('select-count')
    setMemberCount(1)

    setMembers([{ ...EMPTY_MEMBER }])
    setOtherTitleStates([false])
    setCustomTitles([''])
    setCurrentMemberIndex(0)
    setResults([])
    setSubmittingIndex(-1)
  }

  function openAllBadgePreviews() {
    const badges = results
      .filter((r) => r.success && r.registration_code)
      .map((r) => ({
        firstName: r.first_name,
        lastName: r.last_name,
        position: r.job_position,
        companyName: r.company_name,
        countryLabel:
          countries.find((c) => c.code === r.company_country)?.name || r.company_country,
        registrationCode: r.registration_code,
        category: 'EXHIBITOR' as const,
      }))

    if (badges.length > 0) {
      openBadgePreviewWindow(`Preview Badges (${badges.length})`, badges)
    }
  }

  const selectedPhoneCountry = useMemo(
    () =>
      countries.find(
        (c) => c.phoneCode.replace('+', '') === currentMember?.mobile_country_code
      )?.code || '',
    [currentMember?.mobile_country_code]
  )

  // ─── STEP 1: Member Count Selector ─────────────────────────────
  if (step === 'select-count') {
    return (
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="p-6 sm:p-10">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <BadgePlus className="h-3.5 w-3.5" />
              Public Onsite
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              How many members?
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Select the number of exhibitor team members you&apos;d like to register for onsite access.
            </p>
          </div>

          {/* Number selector */}
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-6 py-4">
            <button
              type="button"
              onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-600 transition-colors hover:border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 disabled:hover:border-emerald-100 disabled:hover:bg-emerald-50"
              disabled={memberCount <= 1}
            >
              <Minus className="h-6 w-6" />
            </button>
            
            <div className="flex w-24 flex-col items-center justify-center">
              <span className="text-5xl font-bold text-emerald-700">{memberCount}</span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {memberCount === 1 ? 'person' : 'people'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMemberCount(Math.min(MAX_MEMBERS, memberCount + 1))}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-600 transition-colors hover:border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 disabled:hover:border-emerald-100 disabled:hover:bg-emerald-50"
              disabled={memberCount >= MAX_MEMBERS}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* Summary + Continue */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-500">
              <UserPlus className="h-4 w-4 text-emerald-600" />
              <span>
                Registering{' '}
                <span className="font-bold text-emerald-700">{memberCount}</span>{' '}
                {memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
            <Button
              onClick={handleContinueFromCount}
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-base font-semibold text-white shadow-lg shadow-emerald-800/20 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ─── STEP 2: Fill Forms ────────────────────────────────────────
  if (step === 'fill-forms') {
    const isOther = otherTitleStates[currentMemberIndex] || false
    const currentCustomTitle = customTitles[currentMemberIndex] || ''

    return (
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        {/* Progress header */}
        <div className="border-b border-slate-100 bg-white/60 px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {currentMemberIndex + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Member {currentMemberIndex + 1} of {memberCount}
                </p>
                <p className="text-xs text-slate-500">Fill in the details below</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{Math.round(progressPercent)}%</span>
            </div>
          </div>

          {/* Stepper dots */}
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: memberCount }, (_, i) => {
              const m = members[i]
              const isFilled = m && m.first_name.trim() && m.last_name.trim() && m.email.trim()
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (i < currentMemberIndex || isFilled) {
                      setCurrentMemberIndex(i)
                    }
                  }}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i === currentMemberIndex
                      ? 'bg-emerald-500'
                      : isFilled
                        ? 'cursor-pointer bg-emerald-300 hover:bg-emerald-400'
                        : 'bg-slate-200'
                  }`}
                  title={`Member ${i + 1}`}
                />
              )
            })}
          </div>
        </div>

        <CardContent className="p-5 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {currentMember.first_name && currentMember.last_name
                ? `${currentMember.first_name} ${currentMember.last_name}`
                : `Member ${currentMemberIndex + 1}`}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete the form below to register this exhibitor team member.
            </p>
          </div>

          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              handleNextMember()
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                  <Select value={currentMember.title} onValueChange={handleTitleChange}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white sm:w-[130px]">
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
                  {isOther && (
                    <Input
                      value={currentCustomTitle}
                      onChange={(e) => handleCustomTitleChange(e.target.value)}
                      className="h-11 w-full rounded-xl border-slate-200 bg-white"
                      placeholder="Specify title"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Title Other */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title Other
                </Label>
                <Input
                  value={currentMember.title_other}
                  onChange={(e) => updateCurrentMember('title_other', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  placeholder="Optional"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={currentMember.first_name}
                  onChange={(e) => updateCurrentMember('first_name', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={currentMember.last_name}
                  onChange={(e) => updateCurrentMember('last_name', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  required
                />
              </div>

              {/* Job Position */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Job Position <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={currentMember.job_position}
                  onChange={(e) => updateCurrentMember('job_position', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={currentMember.email}
                  onChange={(e) => updateCurrentMember('email', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
                  <div className="w-full sm:w-[180px] sm:shrink-0">
                    <CountrySelector
                      value={selectedPhoneCountry}
                      onChange={(countryCode) => {
                        const country = countries.find((item) => item.code === countryCode)
                        if (!country) return
                        updateCurrentMember(
                          'mobile_country_code',
                          country.phoneCode.replace('+', '')
                        )
                      }}
                      displayProperty="phoneCode"
                    />
                  </div>
                  <Input
                    value={currentMember.mobile_number}
                    onChange={(e) => updateCurrentMember('mobile_number', e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={currentMember.company_name}
                  onChange={(e) => updateCurrentMember('company_name', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  required
                />
              </div>

              {/* Company Country */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company Country <span className="text-red-500">*</span>
                </Label>
                <CountrySelector
                  value={currentMember.company_country}
                  onChange={(countryCode) => updateCurrentMember('company_country', countryCode)}
                  placeholder="Select country"
                  required
                />
              </div>

              {/* Company Telephone */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Company Telephone <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={currentMember.company_tel}
                  onChange={(e) => updateCurrentMember('company_tel', e.target.value)}
                  className="h-11 rounded-xl border-slate-200 bg-white"
                  required
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevMember}
                className="h-11 rounded-2xl border-slate-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentMemberIndex === 0 ? 'Back to selection' : `Back to Member ${currentMemberIndex}`}
              </Button>

              <Button
                type="submit"
                className="h-11 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 px-6 text-white hover:from-emerald-600 hover:to-teal-600"
              >
                {currentMemberIndex < memberCount - 1 ? (
                  <>
                    Next: Member {currentMemberIndex + 2}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Review all members
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  // ─── STEP 3: Review ────────────────────────────────────────────
  if (step === 'review') {
    return (
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="p-5 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Review & Submit
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Review the details of all {members.length}{' '}
              {members.length === 1 ? 'member' : 'members'} before submitting.
            </p>
          </div>

          <div className="space-y-3">
            {members.map((m, i) => {
              const countryName =
                countries.find((c) => c.code === m.company_country)?.name || m.company_country
              const isOther = otherTitleStates[i]
              const displayTitle = isOther ? customTitles[i] : m.title

              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-700">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {displayTitle} {m.first_name} {m.last_name}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">{m.job_position}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>{m.company_name}</span>
                          <span className="hidden sm:inline">·</span>
                          <span>{countryName}</span>
                          <span className="hidden sm:inline">·</span>
                          <span>{m.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditMember(i)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                        title="Edit member"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMemberFromReview(i)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentMemberIndex(0)
                setStep('fill-forms')
              }}
              className="h-11 rounded-2xl border-slate-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Edit members
            </Button>

            <Button
              type="button"
              onClick={handleSubmitAll}
              className="h-12 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-800/20 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit {members.length} {members.length === 1 ? 'member' : 'members'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ─── STEP 3.5: Submitting ──────────────────────────────────────
  if (step === 'submitting') {
    return (
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="flex flex-col items-center gap-6 px-5 py-12 text-center sm:px-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Registering members...</h2>
            <p className="text-sm text-slate-500">
              Submitting member {submittingIndex + 1} of {members.length}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <Progress
              value={((submittingIndex + 1) / members.length) * 100}
              className="h-2"
              indicatorColor="bg-gradient-to-r from-emerald-500 to-teal-500"
            />
          </div>
          <div className="mt-2 space-y-2">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {i < submittingIndex ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : i === submittingIndex ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
                )}
                <span className={i <= submittingIndex ? 'text-slate-700' : 'text-slate-400'}>
                  {m.first_name} {m.last_name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ─── STEP 4: Complete ──────────────────────────────────────────
  if (step === 'complete') {
    const successResults = results.filter((r) => r.success)
    const failedResults = results.filter((r) => !r.success)

    return (
      <Card className="overflow-hidden border-white/70 bg-white/85 shadow-2xl shadow-slate-950/10 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardContent className="p-5 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Registration Complete
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {successResults.length} of {results.length}{' '}
              {results.length === 1 ? 'member' : 'members'} registered successfully.
            </p>
          </div>

          {/* Failed results warning */}
          {failedResults.length > 0 && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-800">
                {failedResults.length} {failedResults.length === 1 ? 'member' : 'members'} failed
                to register:
              </p>
              <ul className="mt-2 space-y-1">
                {failedResults.map((r) => (
                  <li key={r.index} className="text-sm text-red-700">
                    • {r.first_name} {r.last_name}: {r.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success results */}
          {successResults.length > 0 && (
            <div className="space-y-4">
              {successResults.map((r) => (
                <div
                  key={r.index}
                  className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-xs font-bold text-emerald-800">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {r.first_name} {r.last_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{r.job_position}</span>
                        <span>·</span>
                        <span>{r.company_name}</span>
                      </div>
                    </div>
                  </div>
                  {r.registration_code && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Registration Code
                      </p>
                      <p className="mt-1 font-mono text-base font-bold text-slate-800">
                        {r.registration_code}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Warning notice */}
          {successResults.some((r) => r.registration_code) && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              If you close this page, the registration codes will disappear. Please note them down
              or preview the badges before closing.
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            {successResults.some((r) => r.registration_code) && (
              <Button
                type="button"
                variant="outline"
                onClick={openAllBadgePreviews}
                className="h-11 flex-1 rounded-2xl border-slate-300"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview All Badges
              </Button>
            )}
            <Button
              type="button"
              onClick={handleStartOver}
              className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white hover:from-emerald-600 hover:to-teal-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Register more members
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
