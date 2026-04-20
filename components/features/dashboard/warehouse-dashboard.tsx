"use client";

import { Truck, ArrowRight, PackageCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DashboardNotifications } from "./dashboard-shared";
import { Notification } from "../notifications/notification-manager";
import { OrderRecord } from "../orders/order-history-table";
import Link from "next/link";

interface WarehouseDashboardProps {
  notifications?: Notification[];
  pendingOrders?: OrderRecord[];   // reuse OrderRecord — already has everything we need
}

export const WarehouseDashboard = ({
  notifications = [],
  pendingOrders = [],
}: WarehouseDashboardProps) => {
  return (
    <div className="space-y-6 max-w-6xl">

      <DashboardNotifications
        viewAllLink="/warehouse/notifications"
        notifications={notifications}
      />

      {/* Pending deliveries table */}
      <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-900" strokeWidth={2.5} />
            <h2 className="text-lg font-medium text-gray-900">Awaiting Delivery</h2>
          </div>
          <Link
            href="/warehouse/orders"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No orders awaiting delivery.</div>
        ) : (
          <Table className="text-sm border-collapse">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-gray-50/50">
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">PO ID</TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Supplier</TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Expected Delivery</TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {pendingOrders.slice(0, 3).map((order) => (
                <TableRow key={order.poId} className="hover:bg-gray-50/50 border-none transition-colors">
                  <TableCell className="px-6 py-4 font-bold text-gray-900">{order.poId}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">{order.supplierName}</TableCell>
                  <TableCell className="px-6 py-4 text-center text-gray-500 text-xs">{order.expectedDelivery}</TableCell>
                  <TableCell className="px-6 py-4 text-center text-gray-600">{order.products.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

    </div>
  );
};