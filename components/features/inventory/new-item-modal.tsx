"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewItemModal = ({ isOpen, onClose }: NewItemModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        
        {/* Header - Tightened Padding */}
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            New Inventory Item: TI-2001
          </DialogTitle>
        </DialogHeader>

        {/* Form Body - Reduced Padding and Spacing */}
        <div className="px-10 py-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Supplier Select */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Supplier</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5 text-gray-400">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office-supplies">Office Supplies Co.</SelectItem>
                  <SelectItem value="global-parts">Global Parts Ltd</SelectItem>
                  <SelectItem value="tech-supply">TechSupply Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Category</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5 text-gray-400">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panels">Panels</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="finishes">Finishes</SelectItem>
                  <SelectItem value="adhesives">Adhesives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Name Input */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Product Name</Label>
              <Input 
                type="text"
                placeholder="Enter the product name..."
                className="h-10 rounded-xl border-gray-200 focus-visible:ring-black/5 placeholder:text-gray-300"
              />
            </div>

            {/* Reorder Level Input */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Reorder Level</Label>
              <Input 
                type="number"
                className="w-32 h-10 rounded-xl border-gray-200 focus-visible:ring-black/5"
              />
            </div>
          </div>
        </div>

        {/* Footer - Reduced Height and Padding */}
        <DialogFooter className="px-10 py-6 bg-gray-50/50 flex flex-row justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-6 h-10 rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </Button>
          <Button 
            className="px-8 h-10 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};