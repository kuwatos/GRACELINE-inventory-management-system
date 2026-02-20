"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

export const NewOrderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [products, setProducts] = useState([{ id: 1, name: "", qty: "" }]);

  const addProduct = () => setProducts([...products, { id: Date.now(), name: "", qty: "" }]);
  const removeProduct = (id: number) => setProducts(products.filter((p) => p.id !== id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        
        {/* Header - Compact style consistent with Inventory */}
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            New Order: PO-1001
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Body Area */}
        <ScrollArea className="max-h-[60vh]">
          <div className="px-10 py-6 space-y-6">
            <div className="grid grid-cols-1 gap-5">
              
              {/* Supplier Selection */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 ml-1">Supplier</Label>
                <Select>
                  <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5 text-gray-400">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office-supplies">Office Supplies Co.</SelectItem>
                    <SelectItem value="global-parts">Global Parts Ltd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Delivery Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 ml-1">Delivery Date</Label>
                <Input 
                  type="date" 
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-black/5" 
                />
              </div>

              {/* Dynamic Products List */}
              <div className="space-y-4 pt-2">
                <Label className="text-lg font-bold text-gray-800 ml-1">Products</Label>
                <div className="space-y-3">
                  {products.map((product, index) => (
                    <div key={product.id} className="flex gap-3 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Product {index + 1}
                        </Label>
                        <Select>
                          <SelectTrigger className="h-10 bg-white rounded-xl border-gray-200 focus:ring-black/5 text-sm">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chair">Office Chair - Ergonomic</SelectItem>
                            <SelectItem value="mouse">Wireless Mouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="w-20 space-y-1.5">
                        <Label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Qty</Label>
                        <Input 
                          type="number" 
                          placeholder="0"
                          className="h-10 bg-white rounded-xl border-gray-200 focus-visible:ring-black/5 text-sm" 
                        />
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeProduct(product.id)}
                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={addProduct}
                  className="w-full h-12 border-dashed border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-10 py-6 bg-gray-50/50 flex flex-row justify-end gap-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-8 h-10 rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </Button>
          <Button 
            className="px-10 h-10 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
          >
            Submit Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};