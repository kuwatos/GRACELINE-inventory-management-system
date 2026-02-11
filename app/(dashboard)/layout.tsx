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
import DashboardHeader from "@/components/features/dashboard-header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
return (
     <SidebarProvider>
      <AppSidebar  />
      <SidebarInset>
        <DashboardHeader/>
          {children}
      </SidebarInset>
    </SidebarProvider>
  );
}


