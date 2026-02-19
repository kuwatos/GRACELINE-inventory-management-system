"use client";

import { Download, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderHistoryTableProps {
  onEdit: (order: any) => void;
  onView: (order: any) => void;
}

const ORDERS = [
  { id: "PO-1001", supplier: "Office Supplies Co.", created: "Jan 15, 2025", expected: "Jan 25, 2025", actual: "-", status: "Pending" },
  { id: "PO-1003", supplier: "Furniture Plus", created: "Jan 10, 2025", expected: "Jan 18, 2025", actual: "Jan 18, 2025", status: "Delivered" },
  { id: "PO-1004", supplier: "Industrial Supply Inc.", created: "Jan 8, 2025", expected: "Jan 16, 2025", actual: "-", status: "Canceled" },
];

export const OrderHistoryTable = ({ onEdit, onView }: OrderHistoryTableProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-gray-100 overflow-hidden">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100 bg-gray-50/50">
              <TableHead className="text-[10px] uppercase tracking-widest px-4 py-3 text-gray-400 font-medium">PO ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-4 py-3 text-gray-400 font-medium">Supplier Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-4 py-3 text-gray-400 font-medium">Date Created</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-4 py-3 text-gray-400 font-medium">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-4 py-3 text-gray-400 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {ORDERS.map((order) => (
              <TableRow 
                key={order.id} 
                className="group transition-colors hover:bg-black cursor-default border-none"
              >
                <TableCell className="px-4 py-5 font-mono text-[11px] text-gray-500 group-hover:text-zinc-400">
                  {order.id}
                </TableCell>
                <TableCell className="px-4 py-5 font-medium text-gray-800 group-hover:text-white text-[11px]">
                  {order.supplier}
                </TableCell>
                <TableCell className="px-4 py-5 text-gray-500 group-hover:text-zinc-400 text-[11px]">
                  {order.created}
                </TableCell>
                <TableCell className="px-4 py-5">
                  <Badge 
                    variant="secondary"
                    className={`text-[9px] font-bold uppercase tracking-tighter rounded-sm px-2 py-0.5 border-none ${
                      order.status === "Pending" ? "bg-gray-100 text-gray-500" :
                      order.status === "Delivered" ? "bg-zinc-800 text-white" : "bg-red-50 text-red-500"
                    } group-hover:bg-white/10 group-hover:text-white`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/10"
                      onClick={() => onView(order)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      className="h-7 px-3 bg-white text-black text-[9px] font-bold uppercase hover:bg-gray-200 transition-all active:scale-95 border-none"
                      onClick={() => onEdit(order)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter">
        <span>Showing 1 to 3 of 47 results</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] border-gray-200">Previous</Button>
          <Button size="sm" className="h-8 px-3 text-[10px] bg-black text-white hover:bg-zinc-800">1</Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] border-gray-200">2</Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] border-gray-200">Next</Button>
        </div>
      </div>
    </div>
  );
};