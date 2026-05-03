"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Package, ClipboardList, ArrowRight } from "lucide-react";
import { Report } from "./reports-history-table";
import { cn } from "@/lib/utils";

export const ReportViewerModal = ({ isOpen, onClose, reportData, auditResults }: { 
  isOpen: boolean; 
  onClose: () => void; 
  reportData: Report | null;
  auditResults: {
    purchased: { supplierName: string; totalAmount: number }[];
    paid: { supplierName: string; paidAmount: number }[];
    incoming: { supplierName: string; productName: string; quantity: number; status: string; eta: Date | null }[];
    inventory: { productName: string; measurement: string; startQty: number; endQty: number }[];
  } | null;
}) => {
  if (!reportData || !auditResults) return null;

  // Merge Purchased and Paid data for the Financial Table
  const supplierNames = Array.from(new Set([
    ...auditResults.purchased.map(p => p.supplierName),
    ...auditResults.paid.map(p => p.supplierName)
  ]));

  const financialSummary = supplierNames.map(name => ({
    name,
    purchased: auditResults.purchased.find(p => p.supplierName === name)?.totalAmount || 0,
    paid: auditResults.paid.find(p => p.supplierName === name)?.paidAmount || 0,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="px-10 py-8 bg-black text-white">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter">GRACELINE AUDIT</DialogTitle>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
                {new Date(reportData.dateStart).toLocaleDateString()} — {new Date(reportData.dateEnd).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className="text-white border-white/20 px-4 py-1">
              {reportData.reportType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-10 space-y-12 max-h-[75vh] overflow-y-auto bg-white">
          
          {/* 1. FINANCIAL AUDIT */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Financial Audit (Liability vs Paid)</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2 border-gray-100">
                  <TableHead className="font-bold text-gray-800">Supplier</TableHead>
                  <TableHead className="text-right font-bold text-gray-800">Total Purchased</TableHead>
                  <TableHead className="text-right font-bold text-gray-800">Total Paid</TableHead>
                  <TableHead className="text-right font-bold text-gray-800">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialSummary.map((row, i) => {
                  const balance = row.purchased - row.paid;

                  // Helper to format numbers consistently
                  const formatCurrency = (num: number) => 
                    num.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    });

                  return (
                    <TableRow key={i} className="hover:bg-gray-50/50">
                      <TableCell className="font-bold">{row.name}</TableCell>
                      
                      {/* Updated formatting for Purchased */}
                      <TableCell className="text-right">
                        ₱{formatCurrency(row.purchased)}
                      </TableCell>
                      
                      {/* Updated formatting for Paid */}
                      <TableCell className="text-right text-green-600 font-bold">
                        ₱{formatCurrency(row.paid)}
                      </TableCell>
                      
                      {/* Updated formatting for Balance */}
                      <TableCell className={cn(
                        "text-right font-mono text-xs",
                        balance > 0 ? "text-red-600 font-bold" : "text-gray-500"
                      )}>
                        ₱{formatCurrency(balance)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>

          {/* 2. INCOMING MATERIALS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-gray-400" />
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Incoming Materials (Pending Balance)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditResults.incoming.length > 0 ? auditResults.incoming.map((item, i) => (
                <div key={i} className="flex flex-col p-4 border rounded-2xl bg-zinc-50 border-zinc-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-gray-900">{item.productName}</span>
                    <Badge className="text-[9px] bg-white text-black border-zinc-200 uppercase">{item.status}</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-gray-500">
                      <p className="font-bold uppercase tracking-tighter">{item.supplierName}</p>
                      <p>ETA: {item.eta ? new Date(item.eta).toLocaleDateString() : 'No Date Set'}</p>
                    </div>
                    <p className="text-xl font-black italic">
                      {item.quantity} <span className="text-[10px] not-italic text-gray-400">UNITS</span>
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 italic">No incoming materials for this period.</p>
              )}
            </div>
          </section>

          {/* 3. INVENTORY MOVEMENT */}
          <section className="space-y-4 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-gray-400" />
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Inventory Stock Movement</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {auditResults.inventory.map((item, i) => (
                <div key={i} className="p-5 border-2 border-gray-50 rounded-2xl flex justify-between items-center group hover:border-black transition-all">
                  <div>
                    <p className="font-black text-sm uppercase tracking-tighter">{item.productName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.measurement}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400">START</p>
                      <p className="font-bold text-sm">{item.startQty}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400">END</p>
                      <p className="font-black text-sm text-green-600">{item.endQty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};