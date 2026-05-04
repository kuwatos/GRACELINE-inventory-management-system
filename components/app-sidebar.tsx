"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { User, LogOut, Loader2 } from "lucide-react"
import { sideBarNav } from "./config/nav"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail, SidebarFooter,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useNavigationLoader } from "@/components/providers/navigation-loader"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { startLoading, isLoading: isNavigating } = useNavigationLoader()

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const { data, isPending } = authClient.useSession();
  const isLoading = !mounted || isPending || (!data && mounted);
  const user = {
    name: data?.user?.username || data?.user?.name || "User",
    email: data?.user?.department?.toUpperCase() || "DEPARTMENT",
  };

  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/login"),
        onResponse: () => setIsLoggingOut(false)
      },
    })
  }

  const section = pathname.split('/')[1]
  const sectionDashboard = '/' + section
  const navKey = (section in sideBarNav ? section : "admin") as keyof typeof sideBarNav
  const navItems = sideBarNav[navKey]

  return (
    <Sidebar {...props} className="bg-[#0f172a] border-0! text-white [&>div]:bg-transparent p-1">
       {isNavigating && (
        <div
          className="absolute inset-0 z-50 cursor-not-allowed"
          onPointerDown={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-primary">
              {/* Regular Link + onClick — no NavLink needed */}
              <Link href={sectionDashboard} onClick={startLoading}>
                <div className="grid flex-1 text-left text-sm leading-tight hover:bg-transparent">
                  <span className="truncate font-bold text-2xl tracking-wide text-white">GraceLine</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider font-bold text-[10px] text-white">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                // isActive logic stays exactly the same as before
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="hover:bg-gray-400/30 hover:text-white data-[active=true]:bg-green-500"
                      tooltip={item.label}
                    >
                      {/* Regular Link — asChild works correctly with Link */}
                      <Link href={item.href} onClick={startLoading}>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black">
                {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <User className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {isLoading ? (
                  <>
                    <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
                    <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-semibold">
                      {isLoggingOut ? "Signing out..." : user.name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </>
                )}
              </div>
              {!isLoggingOut && <LogOut className="ml-auto size-4" />}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}