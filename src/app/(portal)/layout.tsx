import { AuthGuard } from "@/components/auth-guard"
import { PortalNavbar } from "@/components/portal-navbar"

export default async function PortalLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <AuthGuard>
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
