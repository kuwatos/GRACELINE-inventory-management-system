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
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  // get session and return user details

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {data, isPending}= authClient.useSession();
  const isLoading = !mounted || isPending || (!data && mounted);
  const user = {
    // Only access data when we are SURE we aren't loading anymore
    name: data?.user?.username || data?.user?.name || "User",
    email: data?.user?.department?.toUpperCase() || "DEPARTMENT",
    avatar: "/avatars/shadcn.jpg",
  };
  
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  

  const handleLogout = async () => {
  setIsLoggingOut(true);
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => router.push("/login"),
      onResponse: () => setIsLoggingOut(false) 
    },
  })
}

  // 👇 2. THE LOGIC FROM LAST NIGHT
  // Get the section from the URL (e.g. "warehouse", "admin")
  const section = pathname.split('/')[1]
  const sectionDashboard = '/' + section
  
  // If the section exists in your config, use it. Otherwise default to "admin".
  const navKey = (section in sideBarNav ? section : "admin") as keyof typeof sideBarNav
  
  // Get the list of links for that specific role
  const navItems = sideBarNav[navKey]

  return (
    <Sidebar {...props} className="bg-[#0f172a] border-0! text-white [&>div]:bg-transparent p-1">
      {/* --- HEADER: USER PROFILE --- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Clicking the logo usually takes you to the Dashboard Home */}
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-primary">
              <Link href={sectionDashboard} >

                {/* 2. The Company Name */}
                <div className="grid flex-1 text-left text-sm leading-tight just hover:bg-transparent">
                  <span className="truncate font-bold text-2xl tracking-wide text-white">GraceLine</span>
                </div>
                
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* --- CONTENT: DYNAMIC MENU --- */}
      <SidebarContent>
        <SidebarGroup>
          {/* Capitalize the Title (e.g. "admin" -> "Admin Menu") */}
          <SidebarGroupLabel className="uppercase tracking-wider font-bold text-[10px] text-white">Menu
          </SidebarGroupLabel>
          
          <SidebarGroupContent >
            <SidebarMenu className="gap-3">
              {/* Map through the items from your config file */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={isActive} className="hover:bg-gray-400/30 hover:text-white 
                    data-[active=true]:bg-green-500" tooltip={item.label}>
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
          <SidebarMenuButton
            size="lg"
            onClick={handleLogout} // Whole bar is clickable
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {/* 1. The Avatar Box */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black">
              <User className="size-4" />
            </div>

            {/* 2. The Text Info */}
            <div className="grid flex-1 text-left text-sm leading-tight">
              {isLoading ? (
                // You can replace these with Shadcn Skeleton components if you have them
                <>
                  <div className="h-4 w-24 animate-pulse rounded bg-white/20" /> 
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                </>
              ) : (
                <>
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </>
              )}
            </div>

            {/* 3. The Logout Icon (Pushed to the right) */}
            {/* ml-auto = margin-left: auto (Pushes this element to the far right) */}
            <LogOut className="ml-auto size-4" />
            
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    </Sidebar>
  )
}