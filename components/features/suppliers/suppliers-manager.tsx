"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SupplierTable, Supplier } from "./supplier-table";
import { NewSupplierModal } from "./new-supplier-modal";
import { EditSupplierModal } from "./edit-supplier-modal";
import { deleteSupplierAction } from "@/lib/action/supplier.action";

interface SuppliersManagerProps {
  data: Supplier[];
}

export const SuppliersManager = ({ data = [] }: SuppliersManagerProps) => {
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Data States
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Search Filter Logic matching your specific property names
  const filteredData = data.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.supplierName.toLowerCase().includes(searchLower) ||
      supplier.supplierId.toString().includes(searchLower)
    );
  });

  // Action Handlers
  const handleViewClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOnly(true);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOnly(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    // 1. Ask for confirmation so they don't accidentally delete
    const isConfirmed = window.confirm(`Are you sure you want to archive supplier: ${supplier.supplierName}?`);
    
    if (isConfirmed) {
      try {
        // 2. Send the ID across the bridge to your Robot Butler
        const result =  await deleteSupplierAction(supplier.supplierId)

        if (!result.success) {
          console.error("Failed to delete order:", result.error);
          alert("Failed to delete order. Please try again.");
        }
      } catch (error) {
        console.error("Server error during deletion:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8 rounded-3xl bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Supplier Directory</h2>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">Manage External Partners</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by supplier name or ID..." 
                className="pl-9 h-11 border-gray-100 rounded-xl focus-visible:ring-black focus-visible:ring-2"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer">
                <option>Search Filters</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="bg-[#0f172a] text-white hover:bg-zinc-800 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10 gap-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Supplier
            </Button>
          </div>
        </div>

        <SupplierTable 
          data={filteredData} 
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Card>

      <NewSupplierModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      <EditSupplierModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        isViewOnly={isViewOnly}
      />
    </div>
  );
};
