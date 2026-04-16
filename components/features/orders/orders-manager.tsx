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

// MOCK DATA
const MOCK_ORDERS: OrderRecord[] = [
  { 
    id: "1", poId: "DRAFT-001", supplierName: "TechSupply Co.", dateCreated: "2026-03-04", expectedDelivery: "2026-03-10", status: "pending",
    products: [{ productId: "Keyboard", expectedQty: 10, unitPrice: 45.00 }, { productId: "Mouse", expectedQty: 15, unitPrice: 20.00 }]
  },
  { 
    id: "2", poId: "PO-2026-0847", supplierName: "GlobalParts Ltd", dateCreated: "2026-03-01", expectedDelivery: "2026-03-05", status: "official",
    products: [{ productId: "Monitor", expectedQty: 5, unitPrice: 150.00 }]
  },
  { 
    id: "3", poId: "PO-2026-0848", supplierName: "Industrial Valve Inc.", dateCreated: "2026-02-28", expectedDelivery: "2026-03-02", status: "awaiting",
    products: [{ productId: "Valve A", expectedQty: 100, unitPrice: 12.50 }, { productId: "Pipe B", expectedQty: 50, unitPrice: 8.00 }]
  },
];

export type Role = "admin" | "warehouse";

export const OrdersManager = () => {

  // --- AUTH SIMULATION ---
  const [role, setRole] = useState<Role>("admin");
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<OrderRecord["status"]>("pending");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [orders, setOrders] = useState<OrderRecord[]>(MOCK_ORDERS);
  
  // MODAL STATES
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null);
  const [receivingOrder, setReceivingOrder] = useState<OrderRecord | null>(null);

  // --- FILTERING ---
  const currentTab = role === "warehouse" ? "awaiting" : activeTab;
  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = order.status === currentTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.poId.toLowerCase().includes(searchLower) ||
        order.supplierName.toLowerCase().includes(searchLower);
        
      return matchesTab && matchesSearch;
    });
  }, [orders, currentTab, searchQuery]);

  // --- DATABASE READY ACTIONS ---
  const handleApprovePending = (id: string) => {
    setOrders(curr => curr.map(o => o.id === id ? { ...o, status: "official", poId: o.poId.replace("DRAFT", "PO") } : o));
  };

  const handleMoveToAwaiting = (id: string) => {
    setOrders(curr => curr.map(o => o.id === id ? { ...o, status: "awaiting" } : o));
  };

  const handleDelete = (id: string) => {
    setOrders(curr => curr.filter(o => o.id !== id));
  };

  // Blind Receiving Logic
  const handleProcessReceipt = (orderId: string, receivedCounts: Record<string, number>) => {
    const today = new Date().toLocaleDateString();
    
    setOrders(curr => curr.map(order => {
      if (order.id !== orderId) return order;

      let isPerfectMatch = true;
      const updatedProducts = order.products.map(p => {
        const rQty = receivedCounts[p.productId] || 0;
        if (rQty !== p.expectedQty) isPerfectMatch = false; 
        return { ...p, receivedQty: rQty };
      });

      return {
        ...order,
        products: updatedProducts,
        status: isPerfectMatch ? "complete" : "incomplete",
        dateReceived: today
      };
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* MAIN ENCLOSING CARD (Matched to InventoryManager) */}
      <Card className="shadow-sm border-gray-200 p-8">
        
        {/* HEADER SECTION (Matched to InventoryManager) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Orders Dashboard
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
              Role: <span className={role === "admin" ? "text-blue-600" : "text-green-600"}>{role}</span>
            </p>
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

            {/* ROLE TOGGLES (Added setSearchQuery("") so it clears on switch) */}
            <Button variant={role === "admin" ? "secondary" : "outline"} onClick={() => { setRole("admin"); setActiveTab("pending"); setSearchQuery(""); }} className="h-11 rounded-xl">
              <UserCircle className="w-4 h-4 mr-2" /> Admin
            </Button>
            <Button variant={role === "warehouse" ? "secondary" : "outline"} onClick={() => { setRole("warehouse"); setSearchQuery(""); }} className="h-11 rounded-xl">
              <UserCircle className="w-4 h-4 mr-2" /> Warehouse
            </Button>

            {/* CREATE ORDER BUTTON */}
            {role === "admin" && (
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

        {/* TABS (Admin Only) */}
        {role === "admin" && (
          <div className="flex border-b border-gray-100 mb-6 gap-6 overflow-x-auto">
            {(["pending", "official", "awaiting", "incomplete", "complete"] as const).map((tab) => (
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
          currentRole={role}
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
      <NewOrderModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
      <EditOrderModal order={editingOrder} isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} />
      <ViewOrderModal orderData={viewingOrder} isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} />
      <ReceiveOrderModal orderData={receivingOrder} isOpen={!!receivingOrder} onClose={() => setReceivingOrder(null)} onSubmitReceipt={handleProcessReceipt} />

    </div>
  );
};