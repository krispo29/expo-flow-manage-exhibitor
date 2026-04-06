import { PublicOnsiteMemberForm } from '@/components/exhibitor/public-onsite-member-form'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Link2 } from 'lucide-react'

type OnsitePageProps = {
  searchParams: Promise<{
    exhibitor_uuid?: string
  }>
}

export default async function OnsitePage({ searchParams }: OnsitePageProps) {
  const { exhibitor_uuid: exhibitorUuid = '' } = await searchParams
  const hasExhibitorUuid = exhibitorUuid.trim().length > 0

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),_transparent_32%),linear-gradient(180deg,_#f6fbfa_0%,_#eef6f8_100%)] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-center min-h-[calc(100dvh-5rem)]">
        {hasExhibitorUuid ? (
          <div className="w-full animate-fade-in-up">
            <PublicOnsiteMemberForm exhibitorUuid={exhibitorUuid} />
          </div>
        ) : (
          <Card className="w-full max-w-xl border-amber-200/70 bg-white/90 shadow-2xl shadow-slate-950/10 backdrop-blur">
            <CardContent className="px-6 py-10 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div className="mt-5 space-y-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">Invalid onsite link</h1>
                <p className="text-sm leading-6 text-slate-600">
                  This page requires an <code>exhibitor_uuid</code> in the URL before a member can be created.
                </p>
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 className="h-4 w-4 text-cyan-700" />
                  Expected format
                </div>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">
                  /onsite?exhibitor_uuid=your-exhibitor-uuid
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
