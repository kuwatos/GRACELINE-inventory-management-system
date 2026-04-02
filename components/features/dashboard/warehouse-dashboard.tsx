"use client";

import { useState } from "react";
import { FileText, Truck, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DashboardNotifications, NotificationItem } from "./dashboard-shared";
import { ReceiveOrderModal } from "../orders/receive-order-modal";

export interface PendingOrder {
  id: string;
  poId: string;
  supplierName: string;
  dateCreated: string;
  expectedDelivery: string;
}

const MOCK_WH_NOTIFS = [
  { id: "1", title: "Order Placed: PO#2025-0848", subtext1: "Delivery Date: November 20, 2025", subtext2: "Supplier: TechSupply Co.", icon: <FileText className="w-5 h-5 text-white" /> },
  { id: "2", title: "Order Placed: PO#2025-0847", subtext1: "Delivery Date: November 20, 2025", subtext2: "Supplier: TechSupply Co.", icon: <FileText className="w-5 h-5 text-white" /> },
  { id: "3", title: "Order Placed: PO#2025-0846", subtext1: "Delivery Date: November 18, 2025", subtext2: "Supplier: ToolSupply Co.", icon: <Truck className="w-5 h-5 text-white" /> },
];

const MOCK_PENDING = [
  { id: "1", poId: "PO-1001", supplierName: "BuildPro Supplies", dateCreated: "Jan 15, 2025", expectedDelivery: "Jan 25, 2025" },
  { id: "2", poId: "PO-1002", supplierName: "Hardware Sol.", dateCreated: "Jan 12, 2025", expectedDelivery: "Jan 20, 2025" },
  { id: "3", poId: "PO-1003", supplierName: "Steel Corp", dateCreated: "Jan 10, 2025", expectedDelivery: "Jan 18, 2025" },
];

export const WarehouseDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReceiveClick = (order: PendingOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <DashboardNotifications viewAllLink="/warehouse/notifications" notifications={MOCK_WH_NOTIFS} />

      <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-6 border-b border-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Pending Orders</h2>
          <div className="bg-gray-100 p-1 rounded-md"><Clock className="w-4 h-4 text-gray-600" /></div>
        </div>
        
        <Table className="text-sm border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50/50 border-none">
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold border-none">PO ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold border-none">Supplier Name</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold border-none">Date Created</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold border-none">Expected Delivery</TableHead>
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-right border-none"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {MOCK_PENDING.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50/50 border-none transition-colors">
                <TableCell className="px-6 py-4 font-medium text-gray-900 border-none">{order.poId}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600 border-none">{order.supplierName}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600 border-none">{order.dateCreated}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600 border-none">{order.expectedDelivery}</TableCell>
                <TableCell className="px-6 py-4 text-right border-none">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full px-4 font-medium"
                    onClick={() => handleReceiveClick(order)}
                  >
                    Receive
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination - Exact copy of your reference */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter bg-white">
          <span>Showing 1 to 3 of 3 results</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 rounded-md">Previous</Button>
            <Button className="h-8 w-8 p-0 text-[11px] bg-black text-white hover:bg-zinc-800 rounded-md">1</Button>
            <Button variant="outline" className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 rounded-md">Next</Button>
          </div>
        </div>
      </div>

      <ReceiveOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
};