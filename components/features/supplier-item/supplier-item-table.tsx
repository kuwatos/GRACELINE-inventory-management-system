"use client";

import { useState } from "react";
import { Eye, Edit3, Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This interface assumes you've performed a JOIN in your server component 
// to get the names alongside the IDs.
export interface SupplierItem {
  supplierItemId: number;
  supplierId: number | null;
  supplierName: string;
  productId: number    | null;
  productName: string;
  unitPrice: string | number | null; // 👈 Drizzle numeric returns as string  category1: string | null;
  category2: string | null;
  lastUpdated: Date | string | null;
}

interface SupplierItemTableProps {
  data: SupplierItem[];
  onView: (item: SupplierItem) => void;
  onEdit: (item: SupplierItem) => void;
  onDelete: (item: SupplierItem) => void;
}

export const SupplierItemTable = ({ data = [], onView, onEdit, onDelete }: SupplierItemTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed">
        No linked items found. Click &quot;Link New Product&quot; to begin sourcing.
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Helper to format currency
 

  // Helper to format date
  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    return new Date(date).toISOString().replace('T', ' ').slice(0, 16)
   
  };

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
      <Table className="text-sm border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Link ID</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supplier</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Product</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Unit Price</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Last Updated</TableHead>
            <TableHead className="px-6 py-4 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.supplierItemId} className="group hover:bg-black transition-colors cursor-default border-b border-gray-50">
              <TableCell className="px-6 py-6 font-mono text-[10px] text-gray-400 group-hover:text-zinc-500">
                {item.supplierItemId}
              </TableCell>
              <TableCell className="px-6 py-6">
                <span className="font-semibold text-gray-800 group-hover:text-white block truncate max-w-[150px]">
                  {item.supplierName}
                </span>
              </TableCell>
              <TableCell className="px-6 py-6">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600 group-hover:text-zinc-300">
                    {item.productName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-6 text-right font-bold text-green-600 group-hover:text-green-400">
                {item.unitPrice}
              </TableCell>
              <TableCell className="px-6 py-6 text-gray-500 group-hover:text-zinc-400">
                <div className="flex items-center gap-2 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.lastUpdated)}
                </div>
              </TableCell>
              <TableCell className="px-6 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onView(item)} 
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(item)} 
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item)} 
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION SECTION */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter bg-white">
        <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} results</span>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 disabled:opacity-30" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button 
              key={i} 
              variant={currentPage === i + 1 ? "default" : "outline"} 
              onClick={() => setCurrentPage(i + 1)} 
              className={`h-8 w-8 p-0 text-[11px] ${currentPage === i + 1 ? "bg-black text-white hover:bg-zinc-800" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 disabled:opacity-30" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};