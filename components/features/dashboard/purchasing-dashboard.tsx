"use client";

import { Clock, Receipt, ArrowRight, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardNotifications, KpiCard } from "./dashboard-shared";
import { Notification } from "../notifications/notification-manager";
import Link from "next/link";

export interface LowStockItem {
  productId: number;
  productName: string;
  productQuantity: number;
  reorderLevel: number | null;
}

interface PurchasingDashboardProps {
  notifications?: Notification[];
  lowStockItems?: LowStockItem[];
  kpiPendingOrders?: number;
  kpiRecentTransactionsWeek?: number;
  kpiRecentTransactionsMonth?: number;
}

export const PurchasingDashboard = ({
  notifications = [],
  lowStockItems = [],
  kpiPendingOrders = 0,
  kpiRecentTransactionsWeek = 0,
  kpiRecentTransactionsMonth = 0,
}: PurchasingDashboardProps) => {
  return (
    <div className="space-y-6 ">

      <DashboardNotifications
        viewAllLink="/purchasing/notifications"
        notifications={notifications}
      />

      <div className="flex gap-4">
        <KpiCard
          title="Pending Orders"
          value={kpiPendingOrders}
          subtext1=" "
          subtext2=" "
          icon={<Clock className="w-5 h-5" />}
        />
        <KpiCard
          title="Recent Transactions"
          value={kpiRecentTransactionsMonth}
          subtext1={`Mon – Today: ${kpiRecentTransactionsWeek}`}
          subtext2={`This Month: ${kpiRecentTransactionsMonth}`}
          icon={<Receipt className="w-5 h-5" />}
        />
      </div>

      <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-900">Urgent: Low Stock Items</h2>
          </div>
          <Link
            href="/purchasing/inventory"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View Full Inventory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No low stock items.</div>
        ) : (
          <Table className="text-sm border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-transparent border-b border-gray-100">
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Item Name</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Current Qty</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Reorder Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.slice(0, 3).map((item) => (
                <TableRow 
                  key={item.productId} 
                  className="group hover:bg-[#0f172a] transition-colors cursor-default border-b border-gray-50 last:border-0"
                >
                  <TableCell className="px-6 py-4 font-medium text-gray-800 group-hover:text-white transition-colors">
                    {item.productName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {/* 👇 Red text that snaps to white on hover */}
                    <span className="text-red-600 font-bold group-hover:text-white transition-colors">
                      {item.productQuantity}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-gray-600 group-hover:text-white transition-colors">
                    {item.reorderLevel ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
};