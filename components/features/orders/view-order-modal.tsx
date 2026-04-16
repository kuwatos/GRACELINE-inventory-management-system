"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderRecord } from "./order-history-table";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderRecord | null;
}

export const ViewOrderModal = ({ isOpen, onClose, orderData }: ViewOrderModalProps) => {
  if (!orderData) return null;

  const isAudited = orderData.status === "complete" || orderData.status === "incomplete";
  const grandTotal = orderData.products.reduce((sum, p) => sum + (p.expectedQty * p.unitPrice), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 flex items-center justify-between flex-row">
          <DialogTitle className="text-xl font-bold text-gray-900">PO: {orderData.poId}</DialogTitle>
          {isAudited && orderData.dateReceived && (
            <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              Received on: {orderData.dateReceived}
            </span>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div><Label className="text-[10px] text-gray-400 uppercase">Supplier</Label><p className="font-bold">{orderData.supplierName}</p></div>
              <div><Label className="text-[10px] text-gray-400 uppercase">Status</Label><p className="font-bold uppercase text-blue-600">{orderData.status}</p></div>
              <div><Label className="text-[10px] text-gray-400 uppercase">Est. Total</Label><p className="font-bold text-green-700">${grandTotal.toFixed(2)}</p></div>
            </div>

            <Table className="text-sm border border-gray-100 rounded-xl overflow-hidden">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold">Item</TableHead>
                  <TableHead className="font-bold text-right">Unit Price</TableHead>
                  <TableHead className="font-bold text-right text-blue-600">Expected Qty</TableHead>
                  {isAudited && <TableHead className="font-bold text-right text-purple-600">Actual Rcvd</TableHead>}
                  <TableHead className="font-bold text-right">Row Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.products.map((item, i) => {
                  const rowTotal = item.expectedQty * item.unitPrice;
                  const isMismatch = isAudited && item.expectedQty !== item.receivedQty;

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.productId}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">{item.expectedQty}</TableCell>
                      
                      {isAudited && (
                        <TableCell className={`text-right font-bold ${isMismatch ? "text-red-500" : "text-green-600"}`}>
                          {item.receivedQty}
                        </TableCell>
                      )}
                      
                      <TableCell className="text-right font-medium">${rowTotal.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};