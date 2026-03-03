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

const LOG_DATA = [
  { id: "1", timestamp: "2025-01-15 14:32:15", user: "John Carlo Benter", dept: "Warehouse", action: "Updated Stock", target: "SKU-101", prev: "10", next: "85" },
  { id: "2", timestamp: "2025-01-15 13:45:22", user: "Maria Santos", dept: "Purchasing", action: "Created Order", target: "ORD-2025-001", prev: "-", next: "Active" },
  { id: "3", timestamp: "2025-01-15 11:25:41", user: "Anna Rodriguez", dept: "Finance", action: "Created Report", target: "PRD-789", prev: "-", next: "Created" },
  { id: "4", timestamp: "2025-01-15 10:12:33", user: "Robert Kim", dept: "Warehouse", action: "Updated Stock", target: "SKU-205", prev: "75", next: "50" },
  { id: "5", timestamp: "2025-01-15 09:45:17", user: "Sarah Johnson", dept: "Admin", action: "Added User", target: "USR-099", prev: "-", next: "Created" },
];

export const ActivityLogTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalResults = 247;

  return (
    <div className="overflow-hidden">
      <Table className="text-[11px] border-collapse">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest">Date and Time</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest">User Account</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest">Department</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest">Action Performed</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest">Target ID</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest text-center">Prev Value</TableHead>
            <TableHead className="px-4 py-4 text-gray-400 font-medium uppercase tracking-widest text-center">New Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LOG_DATA.map((log) => (
            <TableRow 
              key={log.id} 
              className="group transition-colors hover:bg-black cursor-default border-b border-gray-50"
            >
              <TableCell className="px-4 py-5 text-gray-500 group-hover:text-zinc-400 font-medium">
                {log.timestamp}
              </TableCell>
              <TableCell className="px-4 py-5 text-gray-800 group-hover:text-white font-medium">
                {log.user}
              </TableCell>
              <TableCell className="px-4 py-5 text-gray-600 group-hover:text-zinc-300">
                {log.dept}
              </TableCell>
              <TableCell className="px-4 py-5 text-gray-700 group-hover:text-white font-medium">
                {log.action}
              </TableCell>
              <TableCell className="px-4 py-5 text-gray-500 group-hover:text-zinc-400 font-mono">
                {log.target}
              </TableCell>
              <TableCell className="px-4 py-5 text-center text-gray-400 group-hover:text-zinc-500">
                {log.prev}
              </TableCell>
              <TableCell className="px-4 py-5 text-center text-gray-800 group-hover:text-white font-bold">
                {log.next}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination Footer */}
      <div className="pt-8 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter font-medium">
        <span>Showing 1 to 6 of {totalResults} results</span>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 uppercase"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          
          <Button className="h-8 w-8 p-0 bg-black text-white hover:bg-zinc-800 text-[11px]">1</Button>
          <Button variant="outline" className="h-8 w-8 p-0 border-gray-200 text-[11px] hover:bg-gray-50">2</Button>
          <Button variant="outline" className="h-8 w-8 p-0 border-gray-200 text-[11px] hover:bg-gray-50">3</Button>
          
          <span className="px-2 text-gray-300">...</span>
          
          <Button variant="outline" className="h-8 w-8 p-0 border-gray-200 text-[11px] hover:bg-gray-50">42</Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 text-[11px] border-gray-200 hover:bg-gray-50 uppercase"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};