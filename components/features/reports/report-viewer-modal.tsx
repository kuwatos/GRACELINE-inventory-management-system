"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "./reports-history-table";

// Aligned MOCK data

// @/components/features/reports/report-viewer-modal.tsx
export const ReportViewerModal = ({ isOpen, onClose, reportData, auditResults }: { 
  isOpen: boolean; 
  onClose: () => void; 
  reportData: Report | null;
  auditResults: any; // The data from generateMonthlyAudit
}) => {
  if (!reportData || !auditResults) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px] p-0 overflow-hidden rounded-3xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold">Month-End Audit: {reportData.reportType}</DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Supplier Spending Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400">Financial Audit</h3>
            <Table>
              <TableHeader className="bg-black">
                <TableRow>
                  <TableHead className="text-white px-6">Supplier</TableHead>
                  <TableHead className="text-white text-right">Purchased</TableHead>
                  <TableHead className="text-white text-right">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditResults.spending.map((s: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="px-6 font-bold">{s.supplierName}</TableCell>
                    <TableCell className="text-right">₱{s.totalPurchased.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-green-600 font-bold">₱{s.totalPaid.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Inventory Movement Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400">Inventory Snapshot</h3>
            <div className="grid grid-cols-2 gap-4">
              {auditResults.inventory.map((item: any, i: number) => (
                <div key={i} className="p-4 bg-gray-50 border rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-sm">{item.productName}</span>
                  <div className="flex gap-4 text-xs">
                    <div className="text-center">
                      <p className="text-gray-400 font-black">OPENING</p>
                      <p className="font-bold">{item.startQty}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-400 font-black">CLOSING</p>
                      <p className="font-bold text-red-600">{item.endQty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};