'use server'

import { cookies } from 'next/headers'
import api from '@/lib/api'
import { isTokenExpiredError } from '@/lib/auth-helpers'
import { AUTH_COOKIE_NAMES, hasPortalSession } from '@/lib/auth-session'
import { getCountryName } from '@/lib/countries'

type PortalAuthHeaders = {
  'X-Project-UUID': string
  Authorization: string
}

async function clearAuthCookies() {
  const cookieStore = await cookies()

  for (const cookieName of AUTH_COOKIE_NAMES) {
    cookieStore.delete(cookieName)
  }
}

// Helper function to get headers with auth (uses cookie-based project_uuid)
async function getPortalAuthHeaders(): Promise<PortalAuthHeaders | null> {
  const cookieStore = await cookies()
  const projectUuid = cookieStore.get('project_uuid')?.value
  const token = cookieStore.get('access_token')?.value

  if (!token || !projectUuid || !hasPortalSession({ token, projectUuid })) {
    await clearAuthCookies()
    return null
  }

  return {
    'X-Project-UUID': projectUuid,
    Authorization: `Bearer ${token}`,
  }
}

// GET /v1/exhibitor/profile (Portal - Exhibitor's own profile)
export async function getExhibitorProfile() {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const response = await api.get('/v1/exhibitor/profile', { headers })
    
    // Calculate is_quota_full
    const info = response.data.data.info
    const members = response.data.data.members || []
    const totalQuota = (info.quota || 0) + (info.over_quota || 0)
    const isQuotaFull = members.length >= totalQuota
    
    return { 
      success: true, 
      data: {
        ...response.data.data,
        info: {
          ...info,
          is_quota_full: isQuotaFull
        }
      }
    }
  } catch (error: any) {
    console.error('Error fetching exhibitor profile:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to fetch profile'
    return { success: false, error: errMsg }
  }
}

// PUT /v1/exhibitor/profile (Portal - Update Exhibitor's own profile)
export async function updateExhibitorProfile(data: {
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
}) {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const response = await api.put('/v1/exhibitor/profile', data, { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error updating exhibitor profile:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to update profile'
    return { success: false, error: errMsg }
  }
}

// GET /v1/exhibitor/cutoff-status (Portal - Get Cutoff Status)
export async function getExhibitorCutoffStatus() {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const response = await api.get('/v1/exhibitor/cutoff-status', { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error fetching cutoff status:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to fetch cutoff status'
    return { success: false, error: errMsg }
  }
}

// POST /v1/exhibitors/members (Portal - Add Member)
export async function addExhibitorMember(data: {
  exhibitor_uuid: string
  title: string
  title_other: string
  first_name: string
  last_name: string
  job_position: string
  mobile_country_code: string
  mobile_number: string
  email: string
  company_name: string
  company_country: string
  company_tel: string
}) {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const payload = normalizeMemberCompanyCountry(data)
    const response = await api.post('/v1/exhibitor/members', payload, { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error adding member:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to add member'
    return { success: false, error: errMsg }
  }
}

export type PublicOnsiteExhibitorMemberPayload = {
  exhibitor_uuid: string
  title: string
  title_other: string
  first_name: string
  last_name: string
  job_position: string
  mobile_country_code: string
  mobile_number: string
  email: string
  company_name: string
  company_country: string
  company_tel: string
}

function normalizePublicOnsiteMemberResponse(data: unknown) {
  if (Array.isArray(data)) {
    return data
  }

  return data == null ? [] : [data]
}

function normalizeMemberCompanyCountry<T extends { company_country: string }>(data: T): T {
  const companyCountry = data.company_country.trim()

  return {
    ...data,
    company_country: companyCountry ? getCountryName(companyCountry) : companyCountry,
  }
}

// POST /exhibitors/members (Public Onsite - Add Member)
export async function addPublicOnsiteExhibitorMember(
  data: PublicOnsiteExhibitorMemberPayload | PublicOnsiteExhibitorMemberPayload[]
): Promise<
  | {
      success: true
      data: unknown[]
    }
  | {
      success: false
      error: string
    }
> {
  try {
    const payload = (Array.isArray(data) ? data : [data]).map(normalizeMemberCompanyCountry)
    const response = await api.post('/exhibitors/members', payload)

    return {
      success: true,
      data: normalizePublicOnsiteMemberResponse(response.data?.data ?? response.data),
    }
  } catch (error: any) {
    console.error('Error adding public onsite member:', error)
    const errMsg =
      error.response?.data?.message || error.response?.data?.error || 'Failed to add member'
    return { success: false, error: errMsg }
  }
}

// PUT /v1/exhibitors/members/ (Portal - Update Member)
export async function updateExhibitorMember(data: {
  exhibitor_uuid: string
  member_uuid: string
  title: string
  title_other: string
  first_name: string
  last_name: string
  job_position: string
  mobile_country_code: string
  mobile_number: string
  email: string
  company_name: string
  company_country: string
  company_tel: string
}) {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const payload = normalizeMemberCompanyCountry(data)
    const response = await api.put('/v1/exhibitor/members/', payload, { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error updating member:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to update member'
    return { success: false, error: errMsg }
  }
}

// PATCH /v1/exhibitor/members/toggle_status (Portal - Toggle Member Status)
export async function toggleExhibitorMemberStatus(memberUuid: string) {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const response = await api.patch('/v1/exhibitor/members/toggle_status', {
      member_uuid: memberUuid
    }, { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error toggling member status:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to toggle member status'
    return { success: false, error: errMsg }
  }
}

// POST /v1/exhibitors/members/resend_email_comfirmation (Portal - Resend Email Confirmation)
export async function resendMemberEmailConfirmation(data: { member_uuid: string, email: string }) {
  try {
    const headers = await getPortalAuthHeaders()

    if (!headers) {
      return { success: false, error: 'key incorrect' }
    }

    const response = await api.post('/v1/exhibitor/members/resend_email_comfirmation', [
      {
        member_uuid: data.member_uuid,
        email: data.email
      }
    ], { headers })
    
    return { 
      success: true, 
      data: response.data.data
    }
  } catch (error: any) {
    console.error('Error resending email confirmation:', error)
    if (isTokenExpiredError(error)) {
      await clearAuthCookies()
      return { success: false, error: 'key incorrect' }
    }
    const errMsg = error.response?.data?.message || 'Failed to resend email confirmation'
    return { success: false, error: errMsg }
  }
}
