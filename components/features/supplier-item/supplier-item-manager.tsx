"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Import your sub-components (we will create these next)
import { SupplierItemTable, SupplierItem } from "./supplier-item-table";
import { NewSupplierItemModal } from "./new-supplier-item-modal";
// import { EditSupplierItemModal } from "./edit-supplier-item-modal";
// import { deleteSupplierItemAction } from "@/lib/action/supplier-item.action";

interface SupplierItemManagerProps {
  data: SupplierItem[]; // The linked items with names and prices
  suppliers: { supplierId: number; supplierName: string }[]; // For the "Link" dropdown
  products: { productId: number; productName: string }[];    // For the "Link" dropdown
}

export const SupplierItemManager = ({ 
  data = [], 
  suppliers = [], 
  products = []
  
}: SupplierItemManagerProps) => {
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSupplierId, setFilterSupplierId] = useState<string>("all");

  // Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Data States
  const [selectedLink, setSelectedLink] = useState<SupplierItem | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Search & Grouping Logic
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Match text search
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchLower) ||
      item.supplierName.toLowerCase().includes(searchLower) ||
      item.supplierItemId.toString().includes(searchLower);

    // Match "Grouped by Supplier" filter
    const matchesSupplier = filterSupplierId === "all" 
      ? true 
      : item.supplierId?.toString() === filterSupplierId;

    return matchesSearch && matchesSupplier;
  });

  // Action Handlers
  const handleViewClick = (item: SupplierItem) => {
    setSelectedLink(item);
    setIsViewOnly(true);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (item: SupplierItem) => {
    setSelectedLink(item);
    setIsViewOnly(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (item: SupplierItem) => {
    if (confirm(`Are you sure you want to remove the link between ${item.supplierName} and ${item.productName}?`)) {
      // await archiveSupplierItemAction(item.supplierItemId);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8 rounded-3xl bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Items Sourcing by Supplier</h2>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">
              Linking Suppliers to Inventory
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64 text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or suppliers..." 
                className="pl-9 h-11 border-gray-100 rounded-xl focus-visible:ring-black focus-visible:ring-2"
              />
            </div>
            
            {/* Group by Supplier Filter */}
            <div className="relative">
              <select 
                value={filterSupplierId}
                onChange={(e) => setFilterSupplierId(e.target.value)}
                className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map(s => (
                  <option key={s.supplierId} value={s.supplierId.toString()}>
                    {s.supplierName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Link Product Button */}
            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-zinc-800 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Link New Product
            </Button>
          </div>
        </div>

        <SupplierItemTable 
          data={filteredData} 
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Card>

      {/* {/* Modals - These will need the full lists to populate their dropdowns */}
      <NewSupplierItemModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        suppliers={suppliers}
        products={products}
      />

      {/* <EditSupplierItemModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLink(null);
        }}
        supplierItem={selectedLink}
        isViewOnly={isViewOnly}
        suppliers={suppliers}
        products={products}
      />  */}
    </div>
  );
};