import { AuthGuard } from "@/components/auth-guard"
import { AuthErrorHandler } from "@/components/auth-error-handler"
import { PortalNavbar } from "@/components/portal-navbar"

export default async function PortalLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AuthErrorHandler />
      <div className="min-h-screen bg-background">
        <PortalNavbar />
        <main className="portal-main">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
