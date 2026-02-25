'use server'

import { cookies } from 'next/headers'
import { AxiosError } from 'axios'
import api from '@/lib/api'

export async function exhibitorLoginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  try {
    const body = new URLSearchParams({ username, password })
    const response = await api.post('/auth/exhibitor/signin', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const result = response.data

    if (result.code !== 200 || !result.data?.access_token) {
      return { error: result.message || 'Invalid username or password' }
    }

    const { access_token, exhibitor_uuid, project_uuid } = result.data

    // Store access token in HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.data.expires_in || 604800,
      path: '/',
    })

    // Store user role in cookie for server-side role detection
    cookieStore.set('user_role', 'EXHIBITOR', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.data.expires_in || 604800,
      path: '/',
    })

    // Store project UUID
    cookieStore.set('project_uuid', project_uuid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: result.data.expires_in || 604800,
      path: '/',
    })

    return {
      success: true,
      user: {
        id: exhibitor_uuid,
        username,
        role: 'EXHIBITOR',
        projectUuid: project_uuid,
        exhibitorId: exhibitor_uuid
      },
    }
  } catch (error) {
    console.error('Exhibitor login error:', error)
    const errorMsg = error instanceof AxiosError 
      ? error.response?.data?.message || error.message 
      : 'Unable to connect to server'
    return { error: errorMsg }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('project_uuid')
  cookieStore.delete('user_role')
  return { success: true }
}


