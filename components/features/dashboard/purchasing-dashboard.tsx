"use client";

import { Box, Truck, Clock, Receipt, ArrowRight, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardNotifications, KpiCard, NotificationItem } from "./dashboard-shared";
import Link from "next/link";

export interface LowStockItem {
  id: string;
  itemName: string;
  currentQty: number;
  reorderLevel: number;
}

interface PurchasingDashboardProps {
  notifications?: NotificationItem[];
  lowStockItems?: LowStockItem[];
  kpiPendingOrders?: number;
  kpiRecentTransactions?: number;
}

const MOCK_PURCH_NOTIFS = [
  { id: "1", title: "Low Stock Alert: Industrial Valve Model A-342", subtext1: "Current quantity: 5 units", subtext2: "Reorder level: 20 units", icon: <Box className="w-5 h-5 text-white" /> },
  { id: "2", title: "Delivery Received: Supplier GlobalParts Ltd", subtext1: "Date Delivered: November 5, 2025", icon: <Truck className="w-5 h-5 text-white" /> },
  { id: "3", title: "Delivery Received: Supplier ElectroMech Traders", subtext1: "Date Delivered: November 2, 2025", icon: <Truck className="w-5 h-5 text-white" /> },
];

const MOCK_LOW_STOCK = [
  { id: "1", itemName: "Office Printer Paper A4", currentQty: 15, reorderLevel: 25 },
  { id: "2", itemName: "Blue Ballpoint Pens", currentQty: 8, reorderLevel: 20 },
  { id: "3", itemName: "Wireless Mouse", currentQty: 3, reorderLevel: 10 },
];

export const PurchasingDashboard = ({ 
  notifications = MOCK_PURCH_NOTIFS, 
  lowStockItems = MOCK_LOW_STOCK,
  kpiPendingOrders = 23,
  kpiRecentTransactions = 142
}: PurchasingDashboardProps) => {
  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top: Notifications */}
      <DashboardNotifications viewAllLink="/purchasing/notifications" notifications={notifications} />

      {/* Middle: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Pending Orders" value={kpiPendingOrders} subtext1=" " subtext2=" " icon={<Clock className="w-5 h-5" />} />
        <KpiCard title="Recent Transactions" value={kpiRecentTransactions} subtext1="This week: 47" subtext2="This month: 142" icon={<Receipt className="w-5 h-5" />} />
      </div>

      {/* Bottom: Urgent Low Stock Table */}
      <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
            <h2 className="text-lg font-medium text-gray-900">Urgent: Low Stock Items</h2>
          </div>
          <Link href="/purchasing/inventory" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View Full Inventory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Table className="text-sm border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Item Name</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Current Qty</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Reorder Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {lowStockItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 border-none transition-colors">
                <TableCell className="px-6 py-4 font-medium text-gray-900">{item.itemName}</TableCell>
                <TableCell className="px-6 py-4 text-center text-gray-600">{item.currentQty}</TableCell>
                <TableCell className="px-6 py-4 text-center text-gray-600">{item.reorderLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};