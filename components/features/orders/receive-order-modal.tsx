"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderRecord } from "./order-history-table";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface ReceiveOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderRecord | null;
  onSubmitReceipt: (orderId: number, receivedCounts: Record<number, number>) => void;
}

export const ReceiveOrderModal = ({ isOpen, onClose, orderData, onSubmitReceipt }: ReceiveOrderModalProps) => {
  const [counts, setCounts] = useState<Record<number, number>>({});

  const handleInputChange = (orderProductId: number, value: string) => {
    setCounts(prev => ({ ...prev, [orderProductId]: parseInt(value) || 0 }));
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!orderData) return;
    setIsSubmitting(true);
    // Call first, THEN clear — order matters
    onSubmitReceipt(orderData.poId, counts);
    onClose();
    setCounts({});  // clear last, after data is handed off
    setIsSubmitting(false);
  };

  if (!orderData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none shadow-2xl rounded-3xl bg-white">
        <LoadingOverlay isLoading={isSubmitting} message="Confirming receipt..." />
        <DialogHeader className="px-8 py-6 bg-black text-white rounded-t-3xl text-center">
          <DialogTitle className="text-xl">Warehouse Receipt: {orderData.poId}</DialogTitle>
          <p className="text-xs text-gray-400">Perform a blind count of incoming items.</p>
        </DialogHeader>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Product Arriving</TableHead>
                <TableHead className="font-bold text-right">Physical Count Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.products.map((item) => (
                <TableRow key={item.orderProductId}>
                  <TableCell className="font-medium text-lg">{item.productName}</TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={counts[item.orderProductId] || ""}
                      onChange={(e) => handleInputChange(item.orderProductId, e.target.value)}
                      className="h-12 w-32 ml-auto text-xl font-bold text-center border-gray-300 focus:border-black focus:ring-black" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="px-8 py-6 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
          <Button variant="outline" onClick={onClose} className="h-11">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-black text-white h-11 px-8">Confirm Quantities</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};