"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Log {
  id: number;
  timestamp: string | Date | null; 
  user: string | null;
  dept: string | null;
  action: string | null;
  target: number;
  prev: string | null;
  next: string | null;
  remarks: string | null;
  column: string | null;
}

interface ActivityLogTableProps {
  data: Log[];
}

export const ActivityLogTable = ({ data = [] }: ActivityLogTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Slightly more items per page since rows are thinner
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed">
        No logs found matching your criteria.
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
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold whitespace-nowrap">Date & Time</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">User Account</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Department</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Action</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Column</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Target ID</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Prev</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">New</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((log) => (
            <TableRow 
              key={log.id} 
              className="group hover:bg-black transition-colors cursor-default border-b border-gray-50"
            >
              <TableCell className="px-6 py-4 text-xs font-mono text-gray-500 group-hover:text-zinc-400 whitespace-nowrap">
                {log.timestamp ? (
                  // This extracts the "Numbers" directly without calculating offsets
                  new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 16)
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-800 group-hover:text-white">
                {log.user}
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase group-hover:bg-white/10 group-hover:text-white">
                  {log.dept}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-zinc-200">
                {log.action}
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-zinc-400">
                {log.column}
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-zinc-400">
                {log.target}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-zinc-200">
                {log.prev}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-zinc-200">
                {log.next}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-zinc-200">
                {log.remarks}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Unified Pagination Footer */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter bg-white">
        <span>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} results
        </span>
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
              className={`h-8 w-8 p-0 text-[11px] ${
                currentPage === i + 1 
                  ? "bg-black text-white hover:bg-zinc-800" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
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