"use client";

import { Box, FileText, Truck, Clock, Receipt, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardNotifications, KpiCard, NotificationItem } from "./dashboard-shared";
import Link from "next/link";

export interface ActivityRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  recordAffected: string;
  avatarUrl?: string; // For the tiny face icons
}

interface AdminDashboardProps {
  notifications?: NotificationItem[];
  activities?: ActivityRecord[];
  kpiPendingOrders?: number;
  kpiRecentTransactions?: number;
  isLoading?: boolean;
}

const MOCK_NOTIFS = [
  { id: "1", title: "Low Stock Alert: Industrial Valve Model A-342", subtext1: "Current quantity: 5 units", subtext2: "Reorder level: 20 units", icon: <Box className="w-5 h-5 text-white" /> },
  { id: "2", title: "Order Placed: PO#2025-0847", subtext1: "Delivery Date: November 20, 2025", subtext2: "Supplier: TechSupply Co.", icon: <FileText className="w-5 h-5 text-white" /> },
  { id: "3", title: "Delivery Received: Supplier GlobalParts Ltd", subtext1: "Date Delivered: November 5, 2025", icon: <Truck className="w-5 h-5 text-white" /> },
];

const MOCK_ACTIVITY = [
  { id: "1", timestamp: "Mar 13, 2025 14:32", user: "John Davis", action: "Updated Item Quantity", recordAffected: "Industrial Valve A-342 (+50 units)" },
  { id: "2", timestamp: "Mar 13, 2025 13:18", user: "Sarah Mitchell", action: "Created Purchase Order", recordAffected: "PO#2025-0848 - GlobalParts Ltd" },
  { id: "3", timestamp: "Mar 13, 2025 11:45", user: "Emily Rodriguez", action: "Created Purchase Order", recordAffected: "PO#2025-0845 - TechSupply Co." },
];

export const AdminDashboard = ({ 
  notifications = MOCK_NOTIFS, 
  activities = MOCK_ACTIVITY,
  kpiPendingOrders = 23,
  kpiRecentTransactions = 142
}: AdminDashboardProps) => {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top: Notifications */}
      <DashboardNotifications viewAllLink="/admin/notifications" notifications={notifications} />

      {/* Middle: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Pending Orders" value={kpiPendingOrders} subtext1=" " subtext2=" " icon={<Clock className="w-5 h-5" />} />
        <KpiCard title="Recent Transactions" value={kpiRecentTransactions} subtext1="This week: 47" subtext2="This month: 142" icon={<Receipt className="w-5 h-5" />} />
      </div>

      {/* Bottom: Activity Table */}
      <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Recent System Activity</h2>
          <Link href="/admin/activity" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View Full Activity Log <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Table className="text-sm border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50">
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Timestamp</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">User</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Action Performed</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Item/Record Affected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {activities.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50/50 border-none transition-colors">
                <TableCell className="px-6 py-4 text-gray-600">{log.timestamp}</TableCell>
                <TableCell className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    {/* Placeholder for real avatar image */}
                    <div className="w-full h-full bg-gray-300" />
                  </div>
                  {log.user}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">{log.action}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600">{log.recordAffected}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};