'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { logoutAction } from "@/app/actions/auth"

export function PortalNavbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    const result = await logoutAction()
    if (!result.success) return

    logout()
    router.replace('/login')
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'EX'

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-xl backdrop-saturate-180">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Exhibitor Portal Logo" width={36} height={36} className="rounded-lg object-contain shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-foreground">
              Exhibitor Portal
            </span>
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-widest hidden sm:block">
              ILDEX Vietnam 2026
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 px-2 sm:px-3 rounded-xl hover:bg-accent/80 transition-all duration-200"
              >
                <Avatar className="h-7 w-7 ring-2 ring-emerald-500/20">
                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                  {user?.username || 'Exhibitor'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50">
              <DropdownMenuLabel className="font-normal px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user?.username || 'Exhibitor'}</span>
                    <span className="text-xs text-muted-foreground">Exhibitor Account</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer gap-2 px-3 py-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
