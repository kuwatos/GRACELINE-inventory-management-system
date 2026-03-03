"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderHistoryTable, Order } from "./order-history-table";
import { NewOrderModal } from "./new-order-modal";
import { EditOrderModal } from "./edit-order-modal";
import { ViewOrderModal } from "./view-order-modal";

export interface LowStockItem {
  id: string;
  name: string;
  currentQty: number;
  reorderLevel: number;
}

export const OrdersManager = ({ 
  data = [], 
  lowStockData = [] // Add this new prop!
}: { 
  data?: Order[], 
  lowStockData?: LowStockItem[] 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredData = data.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Urgent: Low Stock Items Card */}
      <Card className="shadow-sm border-gray-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-gray-50/50 py-4 flex flex-row items-center gap-2 space-y-0 border-b border-gray-100">
          <AlertTriangle className="w-5 h-5 text-gray-600" />
          <CardTitle className="text-sm font-bold text-gray-800">Urgent: Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="text-[12px]">
            <TableHeader>
              <TableRow className="text-gray-400 uppercase tracking-widest border-b border-gray-100 hover:bg-transparent">
                <TableHead className="px-10 py-4 font-bold text-center">Item Name</TableHead>
                <TableHead className="px-10 py-4 font-bold text-center">Current Qty</TableHead>
                <TableHead className="px-10 py-4 font-bold text-center">Reorder Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-700 font-medium">
              {/* Dynamic Mapping for Low Stock Items */}
              {lowStockData.length > 0 ? (
                lowStockData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-none">
                    <TableCell className="px-10 py-4 text-center">{item.name}</TableCell>
                    <TableCell className="px-10 py-4 text-center text-red-500 font-bold">{item.currentQty}</TableCell>
                    <TableCell className="px-10 py-4 text-center">{item.reorderLevel}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="px-10 py-8 text-center text-gray-500 border-none">
                    No urgent low stock items at this time.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/30">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase h-8 px-4 hover:bg-gray-200 text-gray-500 rounded-lg">
              View Inventory →
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">Purchase Orders</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO# or Supplier..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
              />
            </div>
            
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <Button onClick={() => setIsNewModalOpen(true)} className="bg-[#0f172a] text-white hover:bg-[#0f172a]/70 h-11 px-6 rounded-xl font-bold shadow-lg shadow-black/10 gap-2">
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </div>
        </div>

        <OrderHistoryTable data={filteredData} onEdit={(order) => { setSelectedOrder(order); setIsEditModalOpen(true); }} onView={(order) => { setSelectedOrder(order); setIsViewModalOpen(true); }} />
      </Card>

      <NewOrderModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <EditOrderModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedOrder(null); }} orderData={selectedOrder} />
      <ViewOrderModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setSelectedOrder(null); }} orderData={selectedOrder} />
    </div>
  );
};