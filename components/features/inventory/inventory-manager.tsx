"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InventoryTable, InventoryItem } from "./inventory-table"; 
import { NewItemModal } from "./new-item-modal";
import { EditItemModal } from "./edit-item-modal";
import { deleteItem } from "@/src/entity/item/item.repository";
import { deleteItemAction } from "@/lib/action/inventory.action";
import { authClient } from "@/lib/auth-client";

interface InventoryManagerProps {
  data?: InventoryItem[];
  suppliers?: { id: number; name: string }[]; // Add suppliers to props
  categories?: { name: string }[]; // Add categories to props
  measurements?: { name: string }[]; // Add measurements to props
  projects?: { id: number; name: string }[]; // Add projects to props
  
}

export const InventoryManager = ({ data = [], suppliers = [], categories = [], measurements = [], projects = [] }: InventoryManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "low-stock">("all");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const session = authClient.useSession();
  const userDept = session.data?.user?.department?.toLowerCase(); // Assuming the field is 'dept'
  const isWarehouse = userDept === "warehouse";

  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const words= (
      item.productName.toLowerCase().includes(searchLower) 
      || item.productCategory1?.toLowerCase().includes(searchLower)
      || item.productCategory2?.toLowerCase().includes(searchLower)
      || item.productCategory3?.toLowerCase().includes(searchLower)
      || item.productCategory4?.toLowerCase().includes(searchLower) 
      || item.productCategory5?.toLowerCase().includes(searchLower)
      || item.productId.toString().includes(searchLower)
    );
    const isLowStock = (item.productQuantity ?? 0) <= (item.reorderLevel ?? 0);
    const matchesStatus = filterStatus === "low-stock" ? isLowStock : true;
    return words && matchesStatus;
  });

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewOnly(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    const result = deleteItemAction(item.productId);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            {filterStatus === "low-stock" ? "🚨 Low Stock Warning" : "Current Stock Levels"}
          </h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Item Name or Code..."
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-green-500 focus-visible:ring-2"
              />
            </div>

            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "low-stock")}
                className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="low-stock">Low Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Your custom slate color is applied here! */}
            {!isWarehouse && (
              <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-[#0f172a]/70 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Inventory Item
            </Button>
            )}
          </div>
        </div>

        <InventoryTable data={filteredData} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      </Card>

      <NewItemModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        suppliers={suppliers} // Pass suppliers to the modal
        categories={categories} // Pass categories if needed in the future
        measurements={measurements} // Pass measurements if needed in the future
      />

      <EditItemModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }} 
        item={selectedItem}
        isViewOnly={isViewOnly}
        categories={categories}
        measurements={measurements}
        projects= {projects}
      />
    </div>
  );
};