import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { Suspense } from "react";
import { NavigationLoaderProvider } from "@/components/providers/navigation-loader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <NavigationLoaderProvider>
        <SidebarProvider className="flex h-screen sm:rounded-3xl overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-y-auto h-full">
            <DashboardHeader />
            <div className="p-5">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </NavigationLoaderProvider>
    </Suspense>
  );
}