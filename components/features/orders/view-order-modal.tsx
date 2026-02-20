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

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: any;
}

export const ViewOrderModal = ({ isOpen, onClose, orderData }: ViewOrderModalProps) => {
  // Mock products - ready for backend data mapping
  const products = [
    { name: "Office Chair - Ergonomic", qty: 5 },
    { name: "Wireless Mouse", qty: 10 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        
        {/* Header - Compact style */}
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            View Order: {orderData?.id || "PO-1001"}
          </DialogTitle>
        </DialogHeader>

        {/* Info Body with ScrollArea */}
        <ScrollArea className="max-h-[60vh]">
          <div className="px-10 py-6 space-y-8">
            
            {/* Top Metadata Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Supplier Name
                </Label>
                <p className="text-lg font-medium text-gray-900">
                  {orderData?.supplier || "Office Supplies Co."}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Delivery Date
                </Label>
                <p className="text-lg font-medium text-gray-900">
                  {orderData?.expected || "12/04/2025"}
                </p>
              </div>
            </div>

            {/* Products Table Section */}
            <div className="space-y-4">
              <Label className="text-base font-bold text-gray-800 ml-1">Products Ordered</Label>
              <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent border-b border-gray-100">
                      <TableHead className="px-6 h-10 text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
                        Item Description
                      </TableHead>
                      <TableHead className="px-6 h-10 text-right text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
                        Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((item, i) => (
                      <TableRow key={i} className="hover:bg-gray-50/30 border-b border-gray-50 last:border-none">
                        <TableCell className="px-6 py-4 font-medium text-gray-700">
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

        {/* Footer info - Static for View Only */}
        <div className="px-10 py-6 bg-gray-50/50 flex justify-center border-t border-gray-100">
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300">
            End of Order Details
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};