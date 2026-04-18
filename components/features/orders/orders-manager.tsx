"use client";

import { Plus, UserCircle, Search } from "lucide-react"; 
import { Input } from "@/components/ui/input"; 
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderHistoryTable, OrderRecord } from "./order-history-table";
import { ViewOrderModal } from "./view-order-modal";
import { ReceiveOrderModal } from "./receive-order-modal";
import { NewOrderModal } from "./new-order-modal"; 
import { EditOrderModal } from "./edit-order-modal"; 
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { handleError } from "@/lib/error.handler";
import { approveOrderAction, changeOrderStatusAction, deleteOrderAction, receiveOrderAction } from "@/lib/action/order.action";
import { SupplierOption, SupplierProduct } from "@/lib/action/order.action";


export type Role = "admin" | "warehouse" | "purchasing" | "finance";

interface OrdersManagerProps {
  initialOrders: OrderRecord[];
  suppliers: SupplierOption[];
  supplierProducts: SupplierProduct[];
}
export const OrdersManager = ({ initialOrders, suppliers, supplierProducts }: OrdersManagerProps) => {
  
  // --- AUTH ---
  const user = authClient.useSession().data?.user
  const role  = user?.department;
  
  // --- STATE ---
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<OrderRecord["status"]>("Draft");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  
  // MODAL STATES
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null);
  const [receivingOrder, setReceivingOrder] = useState<OrderRecord | null>(null);

  // --- FILTERING ---
  const currentTab = role === "warehouse" ? "Awaiting Delivery" : activeTab;
  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = order.status === currentTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.poId.toString().toLowerCase().includes(searchLower) ||
        order.supplierName.toLowerCase().includes(searchLower);
        
      return matchesTab && matchesSearch;
    });
  }, [orders, currentTab, searchQuery]);

  // --- DATABASE READY ACTIONS ---
  const handleApprovePending = (poId: number, ) => {
    startTransition(async () => {
      await approveOrderAction(poId);
    });
  };

  // replace with action for placing the order
  const handleMoveToAwaiting = (poId: number) => {
    startTransition(async () => {
      await changeOrderStatusAction(
        poId,
        "Awaiting Delivery"
      );
    });
  };

  const handleDelete = async (poId: number) => {
    // We wrap the call in startTransition so Next.js knows to 
    // refresh the server data (revalidatePath) after it finishes.
    startTransition(async () => {
      await deleteOrderAction(poId);
    });
  };

  // Blind Receiving Logic
  const handleProcessReceipt = async (
    orderId: string,
    receivedCounts: Record<string, number>
  ) => {
    startTransition(async () => {
      const payload = {
        products: Object.entries(receivedCounts).map(([productId, quantity]) => ({
          productId: Number(productId),
          quantity,
        })),
      };
      await receiveOrderAction(Number(orderId), payload);
    });
  };
  return (
    <div className="space-y-6">
      
      {/* MAIN ENCLOSING CARD (Matched to InventoryManager) */}
      <Card className="shadow-sm border-gray-200 p-8">
        
        {/* HEADER SECTION (Matched to InventoryManager) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Orders
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
            
            {/* ADDED: THE NEW SEARCH BAR */}
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO ID or Supplier..."
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black focus-visible:ring-2"
              />
            </div>

            {/* CREATE ORDER BUTTON */}
            {(role === "admin" || role === "purchasing") && (
              <Button 
                onClick={() => setIsNewModalOpen(true)}
                className="bg-[#0f172a] text-white hover:bg-[#0f172a]/70 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
              >
                <Plus className="w-4 h-4" /> 
                Create New Order
              </Button>
            )}
          </div>
        </div>

        {/* TABS (Admin and Purchasing Only) */}
        {(role === "admin" || role === "purchasing") && (
          <div className="flex border-b border-gray-100 mb-6 gap-6 overflow-x-auto">
            {(["Draft", "Official", "Awaiting Delivery", "Incomplete", "Complete"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${currentTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-bold">
                  {orders.filter(o => o.status === tab).length}
                </span>
                {currentTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f172a] rounded-t-full" />}
              </button>
            ))}
          </div>
        )}

        {/* THE TABLE */}
        <OrderHistoryTable 
          data={filteredOrders} 
          currentRole={role as "admin" | "warehouse" | "purchasing" | "finance"}
          viewMode={currentTab} 
          onView={setViewingOrder}
          onEdit={setEditingOrder} 
          onReceive={setReceivingOrder}
          onApprovePending={handleApprovePending}
          onMoveToAwaiting={handleMoveToAwaiting}
          onDelete={handleDelete}
          onDownload={(order) => console.log("Download PDF", order)}
        />
      </Card>

      {/* --- ALL MODALS --- */}
      <NewOrderModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
      />
      <EditOrderModal
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        supplierProducts={supplierProducts}
      />
      <ViewOrderModal orderData={viewingOrder} isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} />
      <ReceiveOrderModal orderData={receivingOrder} isOpen={!!receivingOrder} onClose={() => setReceivingOrder(null)} onSubmitReceipt={handleProcessReceipt} />

    </div>
  );
};