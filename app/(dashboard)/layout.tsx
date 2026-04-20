import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import DashboardHeader from "@/components/dashboard-header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  
return (
     <SidebarProvider className="flex h-screen sm:rounded-3xl overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex-1 overflow-y-auto h-full">
        <DashboardHeader />
        <div className="p-6 md:p-8 lg:p-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


