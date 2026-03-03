"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "./order-history-table";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: Order | null;
}

export const ViewOrderModal = ({ isOpen, onClose, orderData }: ViewOrderModalProps) => {
  // Use real products from the database, or an empty array if loading
  const products = orderData?.products || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">
            View Order: {orderData?.id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-10 py-8 space-y-10">
            
            <div className="grid grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Supplier Name
                </Label>
                <p className="text-base font-bold text-gray-900">
                  {orderData?.supplier || "N/A"}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Expected Delivery
                </Label>
                <p className="text-base font-bold text-gray-900">
                  {orderData?.expected || "N/A"}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Current Status
                </Label>
                <p className="text-base font-bold text-gray-900">
                  {orderData?.status || "N/A"}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Date Created
                </Label>
                <p className="text-base font-bold text-gray-900">
                  {orderData?.created || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-bold text-gray-800 ml-1">Products Ordered</Label>
              <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <Table className="text-sm">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent border-b border-gray-100">
                      <TableHead className="px-6 py-4 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                        Item Description
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((item, i) => (
                      <TableRow key={i} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-none">
                        <TableCell className="px-6 py-4 font-medium text-gray-800">
                          {item.name}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right font-bold text-gray-900">
                          {item.qty}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            End of Order Details
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};