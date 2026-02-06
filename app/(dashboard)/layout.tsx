import { AppSidebar } from "@/components/app-sidebar";
import Sidebar from "@/components/features/sidebar";
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="mx-auto max-w-screen-2xl flex-1 bg">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


