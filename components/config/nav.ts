import {
  LayoutDashboard,
  ClipboardList,
  ChartLine,
  History,
  ShoppingBag,
  UsersRound,
  BellDot,
  Truck,
  PackageCheck
} from 'lucide-react'

// Define the type so TypeScript knows what "icon" is
export type NavItem = {
  label: string;
  href: string;
  icon: unknown;
};

interface SideBarConfig {
  admin: NavItem[];
  purchasing: NavItem[];
  finance: NavItem[];
  warehouse: NavItem[];
}

export const sideBarNav:SideBarConfig = {
  // -------------------------------------------------------
  // 🟢 ADMIN PATHS (start with /admin)
  // -------------------------------------------------------
  admin: [
    {
      label: "Dashboard",
      href: "/admin/dashboard", // 👈 Must match the folder name!
      icon: LayoutDashboard
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: ClipboardList
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: ChartLine
    },
    {
      label: "Activity Logs",
      href: "/admin/activity",
      icon: History
    },
    {
      label: "Suppliers",
      href: "/admin/suppliers",
      icon: Truck
    },
    {
      label: "Completed Orders",
      href: "/admin/completed",
      icon: PackageCheck
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: UsersRound
    },
    {
      label: "Notifications",
      href: "/admin/notifications",
      icon: BellDot 
    },
  ],

  // -------------------------------------------------------
  // 🟡 PURCHASING PATHS (start with /purchasing)
  // -------------------------------------------------------
  purchasing: [
    {
      label: "Dashboard",
      href: "/purchasing/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Inventory",
      href: "/purchasing/inventory",
      icon: ClipboardList
    },
    {
      label: "Orders",
      href: "/purchasing/orders",
      icon: ShoppingBag
    },
    {
      label: "Suppliers",
      href: "/purchasing/suppliers",
      icon: Truck
    },
    {
      label: "Notifications",
      href: "/purchasing/notifications",
      icon: BellDot
    },
  ],

  // -------------------------------------------------------
  // 🔵 FINANCE PATHS (start with /finance)
  // -------------------------------------------------------
  finance: [
    {
      label: "Dashboard",
      href: "/finance/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Completed Orders",
      href: "/finance/completed",
      icon: PackageCheck
    }
  ],

  // -------------------------------------------------------
  // 🟠 WAREHOUSE PATHS (start with /warehouse)
  // -------------------------------------------------------
  warehouse: [
    {
      label: "Dashboard",
      href: "/warehouse/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Inventory",
      href: "/warehouse/inventory",
      icon: ClipboardList
    },
    {
      label: "Notifications",
      href: "/warehouse/notifications",
      icon: BellDot
    },
  ]
}