"use client";

import { Eye, Download, Trash2, Edit, CheckCircle, Truck, PackageCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DownloadOrderButton } from "./download-order-button";

export interface OrderProduct {
  orderProductId: number;  // ADD
  productId: number;
  productName: string;
  expectedQty: number;
  unitPrice: number;
  receivedQty?: number;
}

export interface OrderRecord {
  id: string;
  poId: number;
  supplierId: number;     // ADD
  projectId?: number;     // ADD
  projectName?: string;     // ADD
  supplierName: string;
  dateCreated: string;
  expectedDelivery: string;
  dateReceived?: string;
  status: "Draft" | "Official" | "Awaiting Delivery" | "Incomplete" | "Complete";
  orderedValue?: string;    // ADD
  receivedValue?: string;   // ADD
  products: OrderProduct[];
}

interface OrderHistoryTableProps {
  data: OrderRecord[];
  viewMode: OrderRecord["status"];
  currentRole: "admin" | "warehouse" | "purchasing" | "finance";
  onView: (order: OrderRecord) => void;
  onReceive: (order: OrderRecord) => void;
  onApprovePending: (id: number) => void;
  onMoveToAwaiting: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (order: OrderRecord) => void; 
}

export const OrderHistoryTable = ({ 
  data, 
  viewMode, 
  currentRole, 
  onView, 
  onReceive, 
  onApprovePending, 
  onMoveToAwaiting, 
  onDelete, 
  onEdit,
}: OrderHistoryTableProps) => {
  
  if (data.length === 0) return <div className="p-8 text-center text-gray-500 m-6">No orders found in this category.</div>;

  return (
    <div className="overflow-x-auto">
      <Table className="text-sm border-collapse w-full">
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">PO ID</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Supplier</TableHead>
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Date</TableHead>
            {(currentRole === "admin" || currentRole === "purchasing") && (
              <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Total Cost</TableHead>
            )}
            <TableHead className="text-[11px] uppercase tracking-widest px-6 py-4 text-gray-500 font-bold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-50">
          {data.map((order) => {
            const totalCost = order.orderedValue;

            return (
              <TableRow key={order.poId} className="hover:bg-gray-50/50">
                <TableCell className="px-6 py-4 font-bold text-gray-900 text-center">{order.poId}</TableCell>
                <TableCell className="px-6 py-4 text-gray-600 text-center">{order.supplierName}</TableCell>
                <TableCell className="px-6 py-4 text-gray-500 text-xs text-center">
                  <div className="space-y-0.5">
                    <div>Placed: {order.dateCreated}</div>
                    <div>Expected: {order.expectedDelivery}</div>
                    {/* Only show for completed/incomplete orders */}
                    {(order.status === "Complete" || order.status === "Incomplete") && (
                      <div className={order.dateReceived && (new Date(order.dateReceived) <= new Date(order.expectedDelivery)) ? "text-green-600" : "text-red-400" }>
                        Recieved: {order.dateReceived ?? "—"}
                      </div>
                    )}
                  </div>
                </TableCell>
                {(currentRole === "admin" || currentRole === "purchasing") && (
                  <TableCell className="px-6 py-4 font-medium text-green-700 text-center">
                    ₱{totalCost}
                  </TableCell>
                )}
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    
                    {/* --- DRAFT ACTIONS --- */}
                    {viewMode === "Draft" && (
                      <>
                         <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => onView(order)} title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* ADMIN SPECIFIC BUTTON */}
                        {currentRole === "admin" && (
                          <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={() => onApprovePending(order.poId)} title="Approve to Official">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                         )}
                        <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50" onClick={() => onEdit?.(order)} title="Edit Draft">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => onDelete(order.poId)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {/* --- OFFICIAL ACTIONS --- */}
                    {viewMode === "Official" && (
                      <>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => onView(order)} title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* ADMIN SPECIFIC BUTTON */}
                          {currentRole === "admin" && (
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => onMoveToAwaiting(order.poId)} title="Send to Warehouse (Awaiting Delivery)">
                            <Truck className="w-4 h-4" />
                          </Button>
                          )}
                        <DownloadOrderButton order={order} />
                        
                      </>
                    )}

                    {/* --- AWAITING DELIVERY ACTIONS --- */}
                    {viewMode === "Awaiting Delivery" && (
                      <>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => onView(order)} title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* ADMIN AND PURCHASING SPECIFIC BUTTON */}
                        {(currentRole === "admin" || currentRole === "purchasing") && (
                         <DownloadOrderButton order={order} />
                        )}
                        {/* WAREHOUSE SPECIFIC BUTTON */}
                        {currentRole === "warehouse" && (
                          <Button variant="outline" size="sm" className="bg-green-900 text-white hover:bg-green-800 gap-2 ml-1 transition-colors" onClick={() => onReceive(order)}>
                            <PackageCheck className="w-4 h-4" /> Receive Items
                          </Button>
                        )}
                      </>
                    )}

                    {/* --- COMPLETE AND INCOMPLETE ACTIONS --- */}
                    {viewMode === "Complete"  && (
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => onView(order)} title="View Audit">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}

                    {viewMode === "Incomplete" && (
                      <>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => onView(order)} title="View Audit">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {/* WAREHOUSE SPECIFIC BUTTON */}
                      {currentRole === "warehouse" && (
                        <Button variant="outline" size="sm" className="bg-green-900 text-white hover:bg-green-800 gap-2 ml-1 transition-colors" onClick={() => onReceive(order)}>
                          <PackageCheck className="w-4 h-4" /> Resolve Order
                        </Button>
                      )}
                      {currentRole === "admin" && (
                        <Button variant="outline" size="sm" className="bg-green-900 text-white hover:bg-green-800 gap-2 ml-1 transition-colors" onClick={() => onReceive(order)}>
                          <PackageCheck className="w-4 h-4" /> Resolve Order
                        </Button>
                      )}
                      
                      </>
                    )}

                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};