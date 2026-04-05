"use client";

import { useState } from "react";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ALIGN THIS WITH YOUR schema.ts
export interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierLandline: string | null; // Matches the database return exactly
  supplierEmail: string | null;
  supplierMobile: string | null;
  active: boolean|null;
}

interface SupplierTableProps {
  data: Supplier[];
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const SupplierTable = ({ data = [], onView, onEdit, onDelete }: SupplierTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed">
        No suppliers found. Click &quot;Add New Supplier&quot; to get started.
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <Table className="text-sm border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supplier ID</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supplier Name</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Mobile</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Landline</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email</TableHead>
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((sup) => (
            // Use sup.supplierId instead of sup.id
             <TableRow key={sup.supplierId} className="group hover:bg-black transition-colors cursor-default border-b border-gray-50">
              <TableCell className="px-6 py-6 font-mono text-xs text-gray-500 group-hover:text-zinc-400">{sup.supplierId}</TableCell>
              <TableCell className="px-6 py-6 font-medium text-gray-800 group-hover:text-white">{sup.supplierName}</TableCell>
              <TableCell className="px-6 py-6 text-gray-600 group-hover:text-zinc-300">{sup.supplierMobile ||  '-'}</TableCell>
              <TableCell className="px-6 py-6 text-gray-600 group-hover:text-zinc-300">{sup.supplierLandline || '-'}</TableCell>
              <TableCell className="px-6 py-6 text-gray-600 group-hover:text-zinc-300">{sup.supplierEmail || '-'}</TableCell>
              <TableCell className="px-6 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onView(sup)} className="text-zinc-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(sup)} className="text-zinc-400 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(sup)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter bg-white">
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