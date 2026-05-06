"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LinkProductModal = ({ isOpen, onClose, supplierId, inventoryItems, onSuccess }: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [unitPrice, setUnitPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const filteredItems = inventoryItems?.filter((item: any) => 
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLink = async () => {
    if (!selectedItem || !unitPrice) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/suppliers/link-product", {
        method: "POST",
        body: JSON.stringify({
          supplierId,
          productId: selectedItem.product_id,
          unitPrice: parseFloat(unitPrice),
        }),
      });

      if (res.ok) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Failed to link product", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isLoading) return;  // block close while loading
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[480px] p-0 border-none shadow-2xl rounded-3xl bg-white overflow-hidden">
        <DialogHeader className="px-10 py-10 border-b border-gray-100 flex flex-col items-start text-left">
          <DialogTitle className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            Link New Product
          </DialogTitle>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 text-left">
            Supplier ID: {supplierId}
          </p>
        </DialogHeader>

        <div className="p-10 space-y-8 bg-white">
          <div className="space-y-4">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</Label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <Input 
                placeholder="Search inventory..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl border-gray-100 bg-white focus-visible:ring-black"
              />
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <ScrollArea className="h-[180px]">
                <div className="divide-y divide-gray-50">
                  {filteredItems?.map((item: any) => (
                    <div 
                      key={item.product_id}
                      onClick={() => setSelectedItem(item)}
                      className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${
                        selectedItem?.product_id === item.product_id ? "bg-black" : "hover:bg-gray-50/50"
                      }`}
                    >
                      <span className={`font-bold text-sm tracking-tight ${selectedItem?.product_id === item.product_id ? "text-white" : "text-gray-800"}`}>
                        {item.product_name}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${selectedItem?.product_id === item.product_id ? "text-zinc-400" : "text-gray-400"}`}>
                        {item.category_name}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Unit Price (₱)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₱</span>
              <Input 
                type="number"
                placeholder="0.00"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="pl-8 h-14 rounded-xl border-gray-100 bg-white font-mono font-bold text-xl text-gray-950 focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="font-bold text-gray-400 h-12 rounded-xl px-6">Cancel</Button>
          <Button 
            disabled={!selectedItem || !unitPrice || isLoading}
            onClick={handleLink}
            className="bg-[#0f172a] hover:bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};