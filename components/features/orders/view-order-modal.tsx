"use client";

import Big from "big.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderRecord } from "./order-history-table";
import { authClient } from "@/lib/auth-client";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderRecord | null;
}

export const ViewOrderModal = ({ isOpen, onClose, orderData }: ViewOrderModalProps) => {
  if (!orderData) return null;

  const { data: session, isPending } = authClient.useSession();
  const role = session?.user.department;
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading...
      </div>
    );
  }
  
  const isWarehouse = role === "warehouse";
  const canSeePrices = role === "admin" || role === "purchasing" || role === "finance";
  const isAudited = orderData.status === "Complete" || orderData.status === "Incomplete";

  // Use Big.js for accurate decimal arithmetic
  const grandTotal = orderData.products.reduce((acc, p) => {
    try {
      return acc.plus(new Big(p.unitPrice).times(new Big(p.expectedQty)));
    } catch {
      return acc;
    }
  }, new Big(0)).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none shadow-2xl flex flex-col h-[90vh] max-h-[90vh]">
        
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              PO: {orderData.poId}
            </DialogTitle>
            {isAudited && orderData.dateReceived && (
              <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                Received on: {orderData.dateReceived}
              </span>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 h-0">
          <div className="p-8 space-y-6">

            {/* Order Info Card */}
            <div className={`grid gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 ${
              canSeePrices
                ? isAudited ? "grid-cols-5" : "grid-cols-4"
                : "grid-cols-3"
            }`}>
              <div>
                <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Supplier</Label>
                <p className="font-bold mt-1">{orderData.supplierName}</p>
              </div>
              <div>
                <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Project</Label>
                <p className="font-bold mt-1">{orderData.projectName ?? "—"}</p>
              </div>
              <div>
                <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Status</Label>
                <p className="font-bold uppercase text-blue-600 mt-1">{orderData.status}</p>
              </div>
              {canSeePrices && (
                <>
                  <div>
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Ordered Value</Label>
                    <p className="font-bold text-blue-700 mt-1">
                      {orderData.orderedValue ? `₱${orderData.orderedValue}` : "—"}
                    </p>
                  </div>
                  {/* Received value only relevant for audited orders */}
                  {isAudited && (
                    <div>
                      <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Received Value</Label>
                      <p className={`font-bold mt-1 ${
                        orderData.receivedValue && orderData.orderedValue
                          ? new Big(orderData.receivedValue).lt(new Big(orderData.orderedValue))
                            ? "text-red-500"
                            : "text-green-600"
                          : "text-gray-500"
                      }`}>
                        {orderData.receivedValue ? `₱${orderData.receivedValue}` : "—"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Dates row */}
            <div className={`grid gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 ${isAudited ? "grid-cols-3" : "grid-cols-2"}`}>
            <div>
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Date Placed</Label>
              <p className="font-medium mt-1">{orderData.dateCreated}</p>
            </div>
            <div>
              <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Expected Delivery</Label>
              <p className="font-medium mt-1">{orderData.expectedDelivery}</p>
            </div>
            {/* Only shown for Complete and Incomplete */}
            {isAudited && (
              <div>
                <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Actual Delivery</Label>
                <p className={`font-medium mt-1 ${
                  orderData.dateReceived && new Date(orderData.dateReceived) <= new Date(orderData.expectedDelivery) 
                    ? "text-green-600" // On time or Early: Show Green
                    : "text-red-400" // Late: Show Red
                }`}>
                  {orderData.dateReceived ?? "—"}
                </p>
              </div>
            )}
          </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <Table className="text-sm">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold">Item</TableHead>
                    {/* Warehouse only sees product name and received qty if audited */}
                    {isWarehouse ? (
                      isAudited && (
                        <TableHead className="font-bold text-right text-purple-600">Received</TableHead>
                      )
                    ) : (
                      <>
                        <TableHead className="font-bold text-right">Unit Price</TableHead>
                        <TableHead className="font-bold text-right text-blue-600">Expected Qty</TableHead>
                        {isAudited && (
                          <TableHead className="font-bold text-right text-purple-600">Actual Received</TableHead>
                        )}
                        <TableHead className="font-bold text-right">Row Total</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderData.products.map((item) => {
                    const rowTotal = (() => {
                      try {
                        return new Big(item.unitPrice).times(new Big(item.expectedQty)).toFixed(2);
                      } catch {
                        return "0.00";
                      }
                    })();
                    const isMismatch = isAudited && item.expectedQty !== item.receivedQty;

                    return (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>

                        {isWarehouse ? (
                          isAudited && (
                            <TableCell className={`text-right font-bold ${isMismatch ? "text-red-500" : "text-green-600"}`}>
                              {item.receivedQty ?? "—"}
                            </TableCell>
                          )
                        ) : (
                          <>
                            <TableCell className="text-right">₱{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-bold text-blue-600">
                              {item.expectedQty}
                            </TableCell>
                            {isAudited && (
                              <TableCell className={`text-right font-bold ${isMismatch ? "text-red-500" : "text-green-600"}`}>
                                {item.receivedQty ?? "—"}
                              </TableCell>
                            )}
                            <TableCell className="text-right font-medium">₱{rowTotal}</TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>


          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};