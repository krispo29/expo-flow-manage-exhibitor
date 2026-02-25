"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Users,
  Frame,
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
    email: "Exhibitor",
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
            <SidebarMenuButton 
              size="lg" 
              className="border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent cursor-default hover:bg-primary/10 transition-all duration-500 rounded-xl h-14"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/5 group-hover:scale-105 transition-transform duration-500">
                <Frame className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold text-[14px] tracking-tight text-foreground">
                  Exhibitor
                </span>
                <span className="truncate text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-[0.1em] mt-0.5">
                  Portal
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-4 mb-2">
            Exhibitor Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Portal" 
                  className={cn(
                    "h-10 text-[15px] font-medium px-4 transition-all duration-200",
                    isActive('/exhibitor') 
                      ? "bg-primary/10 text-primary font-bold border-l-4 border-primary rounded-none ml-0 pl-3" 
                      : "hover:bg-sidebar-accent/50"
                  )}
                  isActive={isActive('/exhibitor')}
                >
                  <Link href="/exhibitor">
                    <Users className="size-5 transition-transform group-hover:scale-110" />
                    <span>My Portal</span>
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
