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

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    code: string;
    name: string;
    category: string;
    quantity: number;
    reorderLevel: number;
  } | null;
}

export const EditItemModal = ({ isOpen, onClose, item }: EditItemModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header - Tightened Padding */}
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            Edit Inventory Item: {item.code}
          </DialogTitle>
        </DialogHeader>

        {/* Form Body - Reduced Padding and Spacing */}
        <div className="px-10 py-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            
            {/* Supplier */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Supplier</Label>
              <Select defaultValue="office-supplies">
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office-supplies">Office Supplies Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Category</Label>
              <Select defaultValue={item.category}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={item.category}>{item.category}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Product Name</Label>
              <Select defaultValue={item.name}>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={item.name}>{item.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reorder Level */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Reorder Level</Label>
              <Input 
                type="number"
                defaultValue={item.reorderLevel}
                className="w-32 h-10 rounded-xl border-gray-200 focus-visible:ring-black/5"
              />
            </div>

            {/* Stock Adjustment Row - Reduced Gap */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 ml-1">Current Quantity</Label>
                <Input 
                  type="number"
                  readOnly
                  value={item.quantity}
                  className="h-10 rounded-xl bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 ml-1">New Quantity</Label>
                <Input 
                  type="number"
                  placeholder="Enter new quantity..."
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-black/5 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Reason for Adjustment */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 ml-1">Reason for Adjustment</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5 text-gray-400">
                  <SelectValue placeholder="Choose a reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Regular Restock</SelectItem>
                  <SelectItem value="damage">Damaged Goods</SelectItem>
                  <SelectItem value="audit">Inventory Audit</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer - Reduced Height and Padding */}
        <DialogFooter className="px-10 py-6 bg-gray-50/50 flex flex-row justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-6 h-10 rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-white hover:text-black"
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