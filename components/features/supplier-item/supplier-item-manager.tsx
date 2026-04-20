"use client";

import { useState, useTransition } from "react";
import { Search, ChevronDown, Plus, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Import your sub-components (we will create these next)
import { SupplierItemTable, SupplierItem } from "./supplier-item-table";
import { NewSupplierItemModal } from "./new-supplier-item-modal";
import { EditSupplierItemModal } from "./edit-supplier-item-modal";
import { deleteSupplierItemAction } from "@/lib/action/supplier-items.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface SupplierItemManagerProps {
  data: SupplierItem[]; // The linked items with names and prices
  suppliers: { supplierId: number; supplierName: string }[]; // For the "Link" dropdown
  products: { productId: number; productName: string; productCategory1: string; measurement: string }[];    // For the "Link" dropdown
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
  const [isPending, startTransition] = useTransition();

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
      startTransition(async () => {
        await executeAction(async () => { 
          const res = await deleteSupplierItemAction(item.supplierItemId);
          if (!res.success) throw res;
          return res;
        }, "Supplier-product link deleted successfully!");
      })
  };
}

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <LoadingOverlay isLoading={isPending} message="Loading..." />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Items Sourcing by Supplier</h2>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64 text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or suppliers..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5"
              />
            </div>
            
            {/* Group by Supplier Filter */}
            <Select 
                value={filterSupplierId} 
                onValueChange={(value) => setFilterSupplierId(value)}
              >
                {/* Standardized flat gray trigger */}
                <SelectTrigger className="h-11! w-[200px] px-5 bg-[#E5E7EB] border-none shadow-none rounded-xl text-sm font-medium data-[placeholder]:text-black text-gray-900 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer hover:bg-gray-300 transition-colors">
                  <SelectValue placeholder="Filter by Supplier" />
                </SelectTrigger>
                
                {/* Dropdown menu with 5px offset */}
                <SelectContent 
                  position="popper" 
                  sideOffset={5} 
                  className="rounded-xl border-slate-200 shadow-lg bg-white p-1 max-h-[300px]"
                >
                  <SelectItem 
                    value="all" 
                    className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                  >
                    All Suppliers
                  </SelectItem>
                  
                  {suppliers.map((s) => (
                    <SelectItem 
                      key={s.supplierId} 
                      value={s.supplierId.toString()}
                      className="focus:bg-slate-100 focus:text-[#0f172a] cursor-pointer rounded-lg font-medium transition-colors py-2.5"
                    >
                      {s.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            {/* Link Product Button */}
            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-zinc-800 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Product
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

       <EditSupplierItemModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLink(null);
        }}
        item={selectedLink}
        isViewOnly={isViewOnly}
        suppliers={suppliers}
        products={products}
      />  
    </div>
  );
};