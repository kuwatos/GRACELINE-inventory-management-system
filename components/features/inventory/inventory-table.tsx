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

const MOCK_DATA = [
  { id: "1", code: "PNL-101", name: '3/4" Marine Plywood 4x8', category: "Panels", quantity: 85, reorderLevel: 40 },
  { id: "2", code: "PNL-102", name: '1/2" MDF Board 4x8', category: "Panels", quantity: 110, reorderLevel: 50 },
  { id: "3", code: "HW-201", name: "Soft-Close Cabinet Hinge (Pair)", category: "Hardware", quantity: 620, reorderLevel: 250 },
  { id: "4", code: "HW-202", name: "18-inch Drawer Slides (Pair)", category: "Hardware", quantity: 15, reorderLevel: 200 },
  { id: "5", code: "FIN-301", name: "White Laminate Sheet 4x8", category: "Finishes", quantity: 15, reorderLevel: 30 },
  { id: "6", code: "FAS-501", name: "1.5\" Cabinet Screws (Box of 100)", category: "Hardware", quantity: 95, reorderLevel: 100 },
  { id: "7", code: "ADH-401", name: "Titebond II Wood Glue (1 Gallon)", category: "Adhesives", quantity: 20, reorderLevel: 25 },
  { id: "8", code: "TI-2001", name: "Office Chair", category: "Office Space", quantity: 85, reorderLevel: 10 },
];

interface InventoryTableProps {
  onEdit: (item: any) => void;
}

export const InventoryTable = ({ onEdit }: InventoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = MOCK_DATA.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(MOCK_DATA.length / itemsPerPage);

  return (
    <div className="overflow-hidden">
      <Table className="text-sm border-collapse">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="px-4 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Product Code
            </TableHead>
            <TableHead className="px-4 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Item Name
            </TableHead>
            <TableHead className="px-4 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Category
            </TableHead>
            <TableHead className="px-4 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Current Quantity
            </TableHead>
            <TableHead className="px-4 py-3 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Reorder Level
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-gray-400 font-medium uppercase text-[10px] tracking-widest">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => {
            const isLowStock = item.quantity <= item.reorderLevel;
            return (
              <TableRow 
                key={item.id} 
                className="group transition-colors hover:bg-black cursor-default border-b border-gray-50"
              >
                <TableCell className="px-4 py-4 font-mono text-xs text-gray-500 group-hover:text-zinc-400">
                  {item.code}
                </TableCell>
                <TableCell className="px-4 py-4 font-medium text-gray-800 group-hover:text-white">
                  {item.name}
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-600 group-hover:text-zinc-300">
                  {item.category}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span className={`flex items-center gap-1 ${
                    isLowStock 
                      ? "text-red-600 font-semibold group-hover:text-red-400" 
                      : "text-gray-700 group-hover:text-white"
                  }`}>
                    {item.quantity} {isLowStock && <span className="text-[10px] font-normal uppercase">(low)</span>}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-gray-500 group-hover:text-zinc-400">
                  {item.reorderLevel}
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-7 px-4 text-[10px] font-bold uppercase bg-white text-black border-gray-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {/* Dynamic Pagination Footer */}
      <div className="pt-8 flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-tighter">
        <span>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, MOCK_DATA.length)} of {MOCK_DATA.length} results
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
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};