import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hasPortalSession } from '@/lib/auth-session'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const projectUuid = cookieStore.get('project_uuid')?.value

  if (hasPortalSession({ token, projectUuid })) {
    redirect('/exhibitor')
  }

  redirect('/login')
}

