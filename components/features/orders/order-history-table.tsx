"use client";

import { Eye, Download, Trash2, Edit, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface OrderRecord {
  id: string;
  poId: string;
  supplierName: string;
  dateCreated: string;
  expectedDelivery: string;
  status: "draft" | "official"; // <--- THE NEW STATUS TAG
  totalAmount: string;
  products?: { productId: string; qty: number }[]; // <--- ADD THIS NEW LINE!
}

interface OrderHistoryTableProps {
  data: OrderRecord[];
  viewMode: "draft" | "official"; // <--- TELLS THE TABLE WHICH BUTTONS TO SHOW
  onView?: (order: OrderRecord) => void;
  onDownload?: (order: OrderRecord) => void;
  onEdit?: (order: OrderRecord) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
}

export const OrderHistoryTable = ({ 
  data, 
  viewMode, 
  onView, 
  onDownload, 
  onEdit, 
  onDelete, 
  onApprove 
}: OrderHistoryTableProps) => {
  
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed bg-gray-50/30 m-6">
        {viewMode === "draft" ? "No pending drafts." : "No official orders found."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="text-sm border-collapse w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50/50">
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">PO ID</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Supplier Name</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Date Created</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold">Total Amount</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-50">
          {data.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="px-6 py-4 font-medium text-gray-900">{order.poId}</TableCell>
              <TableCell className="px-6 py-4 text-gray-600">{order.supplierName}</TableCell>
              <TableCell className="px-6 py-4 text-gray-600">{order.dateCreated}</TableCell>
              <TableCell className="px-6 py-4 text-gray-600 font-medium">{order.totalAmount}</TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  
                  {/* --- DRAFT BUTTONS --- */}
                  {viewMode === "draft" && (
                    <> 
                    
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => onApprove?.(order.id)} title="Approve & Make Official">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => onEdit?.(order)} title="Edit Draft">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete?.(order.id)} title="Delete Draft">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* --- OFFICIAL BUTTONS --- */}
                  {viewMode === "official" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100" onClick={() => onView?.(order)} title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100" onClick={() => onDownload?.(order)} title="Download PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};