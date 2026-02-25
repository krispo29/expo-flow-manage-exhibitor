'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { exhibitorLoginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Building2 } from 'lucide-react'

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
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-emerald-500">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <Building2 className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Exhibitor Login</CardTitle>
          <CardDescription>
            Sign in to manage your exhibitor account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="e.g. EB001" required className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="h-11" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-4 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In '}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
