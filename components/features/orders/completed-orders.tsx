"use client";

import { useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface CompletedOrder {
  id: string;
  supplierName: string;
  confirmationDate: string;
}

const MOCK_COMPLETED_ORDERS: CompletedOrder[] = [
  { id: "1", supplierName: "Supplier GlobalParts Ltd", confirmationDate: "November 5, 2025" },
  { id: "2", supplierName: "Supplier GlobalParts Ltd", confirmationDate: "October 27, 2025" },
  { id: "3", supplierName: "Supplier GlobalParts Ltd", confirmationDate: "October 26, 2025" },
];

export const CompletedOrders = ({ data = MOCK_COMPLETED_ORDERS }: { data?: CompletedOrder[] }) => {
  // 1. We add state here so the component can modify its own list
  const [orders, setOrders] = useState<CompletedOrder[]>(data);

  // 2. This function removes the clicked order from the list
  const handleArchive = (idToArchive: string) => {
    // In the future, you will also call Supabase here to update the database
    setOrders((currentOrders) => currentOrders.filter((order) => order.id !== idToArchive));
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">Completed Orders</h2>
          </div>
          <div className="p-8 text-center text-gray-500 border rounded-xl border-dashed bg-gray-50/30">
            All completed orders have been archived.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">Completed Orders</h2>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-gray-100 rounded-xl transition-all hover:bg-gray-50"
            >
              
              <div className="flex items-center gap-4">
                <div className="bg-[#1C1C1E] p-2.5 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    Delivery Completed: {order.supplierName}
                  </span>
                  <span className="text-[13px] text-gray-500">
                    Confirmation Date: {order.confirmationDate}
                  </span>
                </div>
              </div>

              <div className="pl-4">
                {/* 3. The icon is now wrapped in an interactive button! */}
                <button 
                  onClick={() => handleArchive(order.id)}
                  className="p-1 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors active:scale-95"
                  title="Archive Order"
                >
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
              
            </div>
          ))}
        </div>

      </Card>
    </div>
  );
};