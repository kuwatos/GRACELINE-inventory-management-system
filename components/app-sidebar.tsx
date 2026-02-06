"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut } from "lucide-react"

// 👇 1. IMPORT YOUR CONFIG
import { sideBarNav } from "./config/nav"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Mock User Data (Replace with real data later)
const user = {
  name: "Temporary Name",
  email: "admin@graceline.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // 👇 2. THE LOGIC FROM LAST NIGHT
  // Get the section from the URL (e.g. "warehouse", "admin")
  const section = pathname.split('/')[1]
  
  // If the section exists in your config, use it. Otherwise default to "admin".
  const navKey = (section in sideBarNav ? section : "admin") as keyof typeof sideBarNav
  
  // Get the list of links for that specific role
  const navItems = sideBarNav[navKey]

  return (
    <Sidebar {...props} className="!bg-gradient-to-b from-[#06418d] to-[#0f2a53] text-white border-r-0 rounded-r-3xl [&>div]:bg-transparent">
      {/* --- HEADER: USER PROFILE --- */}
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- CONTENT: DYNAMIC MENU --- */}
      <SidebarContent>
        <SidebarGroup>
          {/* Capitalize the Title (e.g. "admin" -> "Admin Menu") */}
          <SidebarGroupLabel className="uppercase tracking-wider font-bold text-xs text-white">
            {navKey} Menu
          </SidebarGroupLabel>
          
          <SidebarGroupContent >
            <SidebarMenu className="gap-3">
              {/* Map through the items from your config file */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER: LOGOUT --- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => console.log("Logout Clicked")} className="">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}