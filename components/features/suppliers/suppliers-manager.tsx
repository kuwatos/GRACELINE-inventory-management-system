"use client";

import { useState, useTransition } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SupplierTable, Supplier } from "./supplier-table";
import { NewSupplierModal } from "./new-supplier-modal";
import { EditSupplierModal } from "./edit-supplier-modal";
import { deleteSupplierAction } from "@/lib/action/supplier.action";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

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
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
    // 1. Ask for confirmation so they don't accidentally delete
    const isConfirmed = window.confirm(`Are you sure you want to archive Supplier: ${supplier.supplierName}?`);
    
    if (isConfirmed) {
          await executeAction(async () => { 
            const res = await await deleteSupplierAction(supplier.supplierId)
            if (!res.success) throw res;
            return res;
          }, "Supplier archived successfully!");
        }
      })
    };

  return (
    <div className="space-y-6">
      <Card className="p-8 rounded-2xl border-2 shadow-sm bg-white">
        <LoadingOverlay isLoading={isPending} message="Loading..." />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Supplier Directory</h2>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by supplier name or ID..." 
                className="pl-9 h-11 border-gray-200 rounded-xl focus-visible:ring-black/5"
              />
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
