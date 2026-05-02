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
  target: string;
  prev: string | null;
  next: string | null;
  remarks: string | null;
  column: string | null;
  project: string | null;
}

interface ActivityLogTableProps {
  data: Log[];
}

export const ActivityLogTable = ({ data = [] }: ActivityLogTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  
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

  // 👇 ADDED: Helper function to calculate the sliding window of pages
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // If we are near the beginning
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } 
      // If we are near the end
      else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } 
      // If we are somewhere in the middle
      else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <Table className="text-sm border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-transparent border-b border-gray-100">
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold whitespace-nowrap">Date & Time</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">User Account</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Department</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Action</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Column</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Target ID</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Prev</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">New</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Remarks</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Project</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((log) => (
            <TableRow 
              key={log.id} 
              className="group hover:bg-[#0f172a] transition-colors cursor-default border-b border-gray-50 last:border-0"
            >
              <TableCell className="px-6 py-4 text-xs font-mono text-gray-500 group-hover:text-white transition-colors whitespace-nowrap">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-800 group-hover:text-white transition-colors">
                {log.user}
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase group-hover:bg-white/20 group-hover:text-white transition-colors">
                  {log.dept}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                {log.action}
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                {log.column}
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                {log.target}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                {log.prev}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                {log.next}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                {log.remarks}
              </TableCell>
              <TableCell className="px-6 py-4 font-medium text-gray-700 group-hover:text-white transition-colors">
                {log.project}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
          
          {/* 👇 UPDATED: We now map over our getPageNumbers() array */}
          {getPageNumbers().map((pageNumber, i) => (
            pageNumber === '...' ? (
              <span key={`ellipsis-${i}`} className="flex items-center justify-center w-8 h-8 text-gray-400 tracking-widest">
                ...
              </span>
            ) : (
              <Button 
                key={i}
                variant={currentPage === pageNumber ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNumber as number)}
                className={`h-8 w-8 p-0 text-[11px] ${
                  currentPage === pageNumber 
                    ? "bg-[#0f172a] text-white hover:bg-[#0f172a]/90" 
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                }`}
              >
                {pageNumber}
              </Button>
            )
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