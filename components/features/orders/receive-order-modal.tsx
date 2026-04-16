"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderRecord } from "./order-history-table";

interface ReceiveOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderRecord | null;
  onSubmitReceipt: (orderId: string, receivedCounts: Record<string, number>) => void;
}

export const ReceiveOrderModal = ({ isOpen, onClose, orderData, onSubmitReceipt }: ReceiveOrderModalProps) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  const handleInputChange = (productId: string, value: string) => {
    setCounts(prev => ({ ...prev, [productId]: parseInt(value) || 0 }));
  };

  const handleSubmit = () => {
    if (!orderData) return;
    onSubmitReceipt(orderData.id, counts);
    setCounts({}); 
    onClose();
  };

  if (!orderData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none shadow-2xl rounded-3xl bg-white">
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
              {orderData.products.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-lg">{item.productId}</TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={counts[item.productId] || ""}
                      onChange={(e) => handleInputChange(item.productId, e.target.value)}
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