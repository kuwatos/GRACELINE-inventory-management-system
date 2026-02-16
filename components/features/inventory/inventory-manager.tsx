"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "./inventory-table";
import { NewItemModal } from "./new-item-modal";
import { EditItemModal } from "./edit-item-modal";

export const InventoryManager = () => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Triggered when the "Edit" button is clicked inside InventoryTable
  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">
          Current Stock Levels
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by Item Name..."
              className="pl-10 h-11 border-gray-200 focus-visible:ring-black"
            />
          </div>

          <Button 
            variant="secondary" 
            className="h-11 px-4 bg-[#E5E7EB] text-gray-700 hover:bg-gray-300 gap-2"
          >
            Search Filters
            <ChevronDown className="w-4 h-4" />
          </Button>

          <Button 
            onClick={() => setIsNewModalOpen(true)}
            className="h-11 px-4 bg-black text-white hover:bg-zinc-800 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Inventory Item
          </Button>
        </div>

        {/* Pass the handleEditClick function to the table */}
        <InventoryTable onEdit={handleEditClick} />

        {/* New Item Modal */}
        <NewItemModal 
          isOpen={isNewModalOpen} 
          onClose={() => setIsNewModalOpen(false)} 
        />

        {/* Edit Item Modal */}
        <EditItemModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }} 
          item={selectedItem}
        />
      </CardContent>
    </Card>
  );
};