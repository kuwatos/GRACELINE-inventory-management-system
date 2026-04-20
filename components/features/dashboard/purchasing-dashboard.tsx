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
    <div className="space-y-6 max-w-6xl">

      <DashboardNotifications
        viewAllLink="/purchasing/notifications"
        notifications={notifications}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <AlertTriangle className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
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
          <Table className="text-sm border-collapse">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-gray-50/50">
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Item Name</TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Current Qty</TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Reorder Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {lowStockItems.slice(0, 3).map((item) => (
                <TableRow key={item.productId} className="hover:bg-gray-50/50 border-none transition-colors">
                  <TableCell className="px-6 py-4 font-medium text-gray-900">{item.productName}</TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <span className="text-red-600 font-bold">{item.productQuantity}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center text-gray-600">{item.reorderLevel ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
};