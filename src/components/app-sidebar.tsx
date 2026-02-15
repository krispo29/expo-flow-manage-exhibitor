"use client"

import * as React from "react"
import {
  Store,
  Lock,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/store/useAuthStore"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const userData = {
    name: user?.username || "Exhibitor",
    email: user?.role || "Exhibitor Portal",
    avatar: "/avatars/admin.jpg",
  }

  // Helper to check if a path is active
  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
                <Store className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold uppercase tracking-tight">
                  Exhibitor Portal
                </span>
                <span className="truncate text-[10px] opacity-70 font-bold uppercase tracking-widest">Management System</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Exhibitor"
                  className="h-10 text-[15px] font-medium px-4"
                  isActive={isActive('/exhibitor')}
                >
                  <Link href="/exhibitor">
                    <Store className="size-5" />
                    <span>Exhibitor Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Demo - Locked Mode"
                  className="h-10 text-[15px] font-medium px-4 opacity-70 hover:opacity-100"
                  isActive={isActive('/exhibitor-2')}
                >
                  <Link href="/exhibitor-2">
                    <Lock className="size-5" />
                    <span>Demo (Locked Mode)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
           <ModeToggle />
        </div>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
