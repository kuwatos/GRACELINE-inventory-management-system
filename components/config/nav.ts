import {
  LayoutDashboard,
  ClipboardList,
  ChartLine,
  History,
  ShoppingBag,
  UsersRound,
  BellDot,
  Truck,
  Hammer,
  PackageCheck,
  FolderDot, // Added for Projects
  LucideIcon // Better type safety than 'unknown'
} from 'lucide-react'

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon; 
};

interface SideBarConfig {
  admin: NavItem[];
  purchasing: NavItem[];
  finance: NavItem[];
  warehouse: NavItem[];
}

export const sideBarNav: SideBarConfig = {
  // -------------------------------------------------------
  // 🟢 ADMIN PATHS (start with /admin)
  // -------------------------------------------------------
  admin: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Projects", 
      href: "/admin/projects",
      icon: FolderDot
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
      label: "Supplier Items",
      href: "/admin/supplier-items",
      icon: Hammer
    },
    {
      label: "Completed Orders Notifs",
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
  // 🟡 PURCHASING PATHS
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
      label: "Supplier Items",
      href: "/purchasing/supplier-items",
      icon: Hammer
    },
    {
      label: "Completed Orders Notifs",
      href: "/purchasing/completed",
      icon: PackageCheck
    },
    {
      label: "Projects", 
      href: "/purchasing/projects",
      icon: FolderDot
    },
    {
      label: "Notifications",
      href: "/purchasing/notifications",
      icon: BellDot
    },
  ],

  // -------------------------------------------------------
  // 🔵 FINANCE PATHS
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
  // 🟠 WAREHOUSE PATHS
  // -------------------------------------------------------
  warehouse: [
    {
      label: "Dashboard",
      href: "/warehouse/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Orders", // 👈 Added to Warehouse
      href: "/warehouse/orders",
      icon: ShoppingBag
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