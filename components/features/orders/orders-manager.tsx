"use client";

import { useState } from "react";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderHistoryTable } from "./order-history-table";
import { NewOrderModal } from "./new-order-modal";
import { EditOrderModal } from "./edit-order-modal";
import { ViewOrderModal } from "./view-order-modal";

export const OrdersManager = () => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleEditClick = (order: any) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Urgent: Low Stock Items Card */}
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50/50 py-3 flex flex-row items-center gap-2 space-y-0">
          <AlertTriangle className="w-4 h-4 text-gray-600" />
          <CardTitle className="text-sm font-semibold text-gray-800">
            Urgent: Low Stock Items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="text-[11px]">
            <TableHeader>
              <TableRow className="text-gray-400 uppercase tracking-wider border-b border-gray-50 hover:bg-transparent">
                <TableHead className="px-10 h-10 font-medium text-center">Item Name</TableHead>
                <TableHead className="px-10 h-10 font-medium text-center">Current Qty</TableHead>
                <TableHead className="px-10 h-10 font-medium text-center">Reorder Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-700">
              <TableRow className="hover:bg-gray-50/50">
                <TableCell className="px-10 py-3 font-medium text-center">Office Printer Paper A4</TableCell>
                <TableCell className="px-10 py-3 text-center">15</TableCell>
                <TableCell className="px-10 py-3 text-center">25</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50/50 border-none">
                <TableCell className="px-10 py-3 font-medium text-center">Blue Ballpoint Pens</TableCell>
                <TableCell className="px-10 py-3 text-center">8</TableCell>
                <TableCell className="px-10 py-3 text-center">20</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="p-3 border-t border-gray-100 flex justify-end">
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase h-7 px-2 hover:bg-gray-100">
              View All →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Order History Section */}
      <Card className="shadow-sm border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800">Purchase Order History</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by PO#..." 
                className="pl-9 h-10 border-gray-200 focus-visible:ring-black rounded-md"
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-36 h-10 bg-[#E5E7EB] border-none text-sm font-medium focus:ring-0 rounded-md">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-black text-white hover:bg-zinc-800 h-10 px-4 transition-all active:scale-95 rounded-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Purchase Order
            </Button>
          </div>
        </div>

        <OrderHistoryTable onEdit={handleEditClick} onView={handleViewClick} />
      </Card>

      {/* Modals */}
      <NewOrderModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      <EditOrderModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }} 
        orderData={selectedOrder}
      />

      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
        orderData={selectedOrder}
      />
    </div>
  );
};