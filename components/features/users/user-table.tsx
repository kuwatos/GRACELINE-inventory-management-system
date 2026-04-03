"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 1. UPDATED INTERFACE to match the database exactly
export interface User {
  userId: string; 
  firstName: string;
  lastName: string;
  username: string;
  department: string;
  active: boolean; // Kept for TypeScript, but we won't show it in the table
}

interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable = ({ data = [], onEdit, onDelete }: UserTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed">
        No users found. Click &quot;Add New User&quot; to get started.
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
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">User ID</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Name</TableHead>
            {/* 2. ADDED USERNAME HEADER */}
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Username</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Department</TableHead>
            <TableHead className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((user) => (
            <TableRow 
              key={user.userId} // Changed from user.id
              className="group hover:bg-black transition-colors cursor-default border-b border-gray-50"
            >
              <TableCell className="px-6 py-5 font-mono text-xs text-gray-500 group-hover:text-zinc-400">
                {`EMP-${String(user.userId).padStart(4, '0')}`}
              </TableCell>
              <TableCell className="px-6 py-5 font-medium text-gray-800 group-hover:text-white">
                {user.firstName} {user.lastName}
              </TableCell>
              {/* 3. ADDED USERNAME CELL */}
              <TableCell className="px-6 py-5 font-medium text-gray-600 group-hover:text-gray-300">
                @{user.username}
              </TableCell>
              <TableCell className="px-6 py-5">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase group-hover:bg-white/10 group-hover:text-white">
                  {user.department}
                </span>
              </TableCell>
              <TableCell className="px-6 py-5 text-right">
                {/* Removed opacity-0 and group-hover:opacity-100 */}
                <div className="flex items-center justify-end gap-3 transition-opacity">
                  <button onClick={() => onEdit(user)} className="text-zinc-400 hover:text-indigo-400 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(user)} className="text-zinc-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dynamic Pagination Footer */}
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