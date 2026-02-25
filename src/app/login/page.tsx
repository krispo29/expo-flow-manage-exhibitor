'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { exhibitorLoginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Building2, ArrowRight } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await exhibitorLoginAction(formData)

      if (result.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }

      if (result.success && result.user) {
        login(result.user)
        toast.success('Logged in successfully')
        router.push('/exhibitor')
      }
    } catch {
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-8 right-8 z-10">
        <ModeToggle />
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="space-y-8 animate-scale-in">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Exhibitor Login
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to manage your exhibition presence
            </p>
          </div>

          {/* Form container with glassmorphism */}
          <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. EB001"
                  required
                  className="h-12 rounded-2xl bg-muted/30 border-border/60 focus:bg-background focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-12 rounded-2xl bg-muted/30 border-border/60 focus:bg-background focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 px-4"
                />
              </div>

              <Button
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-300 gap-2 group mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer note */}
          <div className="text-center space-y-4 animate-fade-in delay-300">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              Don't have an account or lost your credentials?<br />
              Please contact your event organizer for support.
            </p>
            <div className="pt-4 border-t border-border/10">
              <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                ExpoFlow Exhibitor Portal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
