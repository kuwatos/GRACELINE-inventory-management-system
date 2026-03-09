"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderHistoryTable, OrderRecord } from "./order-history-table";
import { NewOrderModal } from "./new-order-modal";
import { EditOrderModal } from "./edit-order-modal";

const MOCK_ORDERS: OrderRecord[] = [
  { id: "1", poId: "DRAFT-001", supplierName: "TechSupply Co.", dateCreated: "2026-03-04", expectedDelivery: "2026-03-10", totalAmount: "$4,500.00", status: "draft" },
  { id: "2", poId: "DRAFT-002", supplierName: "Office Supplies Co.", dateCreated: "2026-03-04", expectedDelivery: "2026-03-08", totalAmount: "$250.00", status: "draft" },
  { id: "3", poId: "PO-2025-0847", supplierName: "GlobalParts Ltd", dateCreated: "2026-03-01", expectedDelivery: "2026-03-05", totalAmount: "$12,400.00", status: "official" },
  { id: "4", poId: "PO-2025-0846", supplierName: "Industrial Valve Inc.", dateCreated: "2026-02-28", expectedDelivery: "2026-03-02", totalAmount: "$8,900.00", status: "official" },
];

export const OrdersManager = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"draft" | "official">("draft");
  const [orders, setOrders] = useState<OrderRecord[]>(MOCK_ORDERS);
  
  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);

  // --- DATA FILTERING ---
  // The table will only ever see the data that matches the currently clicked tab
  const filteredOrders = orders.filter(order => order.status === activeTab);

  // --- ACTIONS ---
  const handleApproveDraft = (id: string) => {
    // This finds the draft and flips its status to "official"
    setOrders(current => 
      current.map(order => 
        order.id === id 
          ? { ...order, status: "official", poId: order.poId.replace("DRAFT", "PO") } 
          : order
      )
    );
  };

  const handleDeleteDraft = (id: string) => {
    setOrders(current => current.filter(order => order.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Header & Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage drafts and official supplier orders.</p>
        </div>
        <Button 
          onClick={() => setIsNewModalOpen(true)}
          className="bg-black text-white hover:bg-zinc-800 rounded-xl px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Order
        </Button>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-white overflow-hidden">
        
        {/* --- THE TABS --- */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "draft" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Pending Drafts
            {/* The little green badge to show how many drafts need attention */}
            <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-[10px]">
              {orders.filter(o => o.status === "draft").length}
            </span>
            {activeTab === "draft" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />}
          </button>

          <button
            onClick={() => setActiveTab("official")}
            className={`pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "official" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Official Orders
            {activeTab === "official" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />}
          </button>
        </div>

        {/* --- THE TABLE --- */}
        <OrderHistoryTable 
          data={filteredOrders} 
          viewMode={activeTab} 
          
          // Official Actions
          onView={(order) => console.log("View", order)}
          onDownload={(order) => console.log("Download PDF", order)}
          
          // Draft Actions
          onEdit={(order) => setEditingOrder(order)}
          onDelete={handleDeleteDraft}
          onApprove={handleApproveDraft}
        />
      </Card>

      {/* --- THE MODALS --- */}
      <NewOrderModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />
      
      <EditOrderModal 
        order={editingOrder} 
        isOpen={!!editingOrder} 
        onClose={() => setEditingOrder(null)} 
      />

    </div>
  );
};