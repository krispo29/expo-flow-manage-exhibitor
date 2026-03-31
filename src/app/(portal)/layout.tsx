import { AuthGuard } from "@/components/auth-guard"
import { AuthErrorHandler } from "@/components/auth-error-handler"
import { PortalNavbar } from "@/components/portal-navbar"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { hasPortalSession } from "@/lib/auth-session"

export default async function PortalLayout({ children }: { readonly children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  const projectUuid = cookieStore.get('project_uuid')?.value

  if (!hasPortalSession({ token, projectUuid })) {
    redirect('/login')
  }

  return (
    <AuthGuard>
      <AuthErrorHandler />
      <div className="min-h-screen bg-background flex flex-col">
        <PortalNavbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
