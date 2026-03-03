"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Order {
  id: string;
  supplier: string;
  created: string;
  expected: string;
  actual: string;
  status: "Pending" | "Delivered" | "Canceled";
  // Add this new line so it knows about the products!
  products?: { productId: string; name?: string; qty: number }[]; 
}

interface OrderHistoryTableProps {
  data: Order[];
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
}

export const OrderHistoryTable = ({ data = [], onEdit, onView }: OrderHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed mt-4">
        No purchase orders found matching your criteria.
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <Table className="text-sm border-collapse">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100 bg-gray-50/50">
              <TableHead className="text-[10px] uppercase tracking-widest px-6 py-4 text-gray-400 font-bold">PO ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-6 py-4 text-gray-400 font-bold">Supplier Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-6 py-4 text-gray-400 font-bold">Date Created</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-6 py-4 text-gray-400 font-bold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest px-6 py-4 text-gray-400 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-50">
            {currentItems.map((order) => (
              <TableRow key={order.id} className="group transition-colors hover:bg-black cursor-default border-none">
                <TableCell className="px-6 py-5 font-mono text-xs text-gray-500 group-hover:text-zinc-400">{order.id}</TableCell>
                <TableCell className="px-6 py-5 font-medium text-gray-800 group-hover:text-white">{order.supplier}</TableCell>
                <TableCell className="px-6 py-5 text-gray-500 group-hover:text-zinc-400">{order.created}</TableCell>
                <TableCell className="px-6 py-5">
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
                <TableCell className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10" onClick={() => onView(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button className="h-8 px-4 bg-white text-black text-[10px] font-bold uppercase hover:bg-gray-200 transition-all active:scale-95 border-none" onClick={() => onEdit(order)}>
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-6 border border-gray-100 rounded-2xl flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter bg-white">
        <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} results</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 disabled:opacity-30" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 p-0 text-[11px] ${currentPage === i + 1 ? "bg-black text-white hover:bg-zinc-800" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}>{i + 1}</Button>
          ))}
          <Button variant="outline" className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 disabled:opacity-30" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
        </div>
      </div>
    </div>
  );
};