"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ReceiveOrderModal = ({ isOpen, onClose, order }: any) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        {/* Aligned Header */}
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">
            Receive Order: {order.poId}
          </DialogTitle>
          <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-tight">
            Supplier: {order.supplierName}
          </p>
        </DialogHeader>

        {/* Table Content - Aligned to your Dashboard style */}
        <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <Table className="text-sm border-collapse">
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-gray-50/50">
                  <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold border-none">Product Description</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center border-none">Ordered</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-right border-none">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-50">
                <TableRow className="border-none transition-colors">
                  <TableCell className="px-6 py-4 font-medium text-gray-900 border-none">3/4 Marine Plywood 4x8</TableCell>
                  <TableCell className="text-center font-semibold text-gray-400 border-none">50</TableCell>
                  <TableCell className="px-6 py-4 text-right border-none">
                    <Input 
                      type="number" 
                      defaultValue={50} 
                      className="h-10 w-24 ml-auto rounded-xl border-gray-200 text-right font-bold focus:ring-black" 
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-gray-400 italic ml-1">
            * Actual received quantity will update the current warehouse stock levels.
          </p>
        </div>

        {/* Footer - Aligned to your NewItemModal style */}
        <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-8 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
            Cancel
          </Button>
          <Button className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/80 transition-all">
            Confirm Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};