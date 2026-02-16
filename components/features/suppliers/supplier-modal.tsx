// app/components/features/suppliers/supplier-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SupplierModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  supplier 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  mode: "new" | "edit" | "view"; 
  supplier: any 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const isView = mode === "view";
  const title = mode === "new" ? "Add New Supplier" : mode === "edit" ? `Edit Supplier: ${supplier?.id}` : `View Supplier: ${supplier?.id}`;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-10 border-b border-gray-100 flex justify-center items-center relative">
          <h2 className="text-3xl font-medium text-gray-900">{title}</h2>
          <button onClick={onClose} className="absolute right-8 top-10 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-12 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Supplier Name</label>
              <Input 
                defaultValue={supplier?.name || ""} 
                disabled={isView} 
                className="h-12 rounded-xl border-gray-200" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Contact Person</label>
                <Input 
                  defaultValue={supplier?.contact || ""} 
                  disabled={isView} 
                  className="h-12 rounded-xl border-gray-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
                {isView ? (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center px-5 text-gray-900">
                    {supplier?.category}
                  </div>
                ) : (
                  <div className="relative">
                    <select className="w-full h-12 bg-white border border-gray-200 rounded-xl px-5 text-sm appearance-none focus:outline-none">
                      <option>Stationery</option>
                      <option>Hardware</option>
                      <option>Furniture</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <Input 
                type="email" 
                defaultValue={supplier?.email || ""} 
                disabled={isView} 
                className="h-12 rounded-xl border-gray-200" 
              />
            </div>
          </div>
        </div>

        <div className="px-12 py-10 bg-gray-50/50 flex justify-end gap-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="px-8 h-12 rounded-xl font-bold text-gray-500">
            {isView ? "Close" : "Cancel"}
          </Button>
          {!isView && (
            <Button className="bg-black text-white px-12 h-12 rounded-xl font-bold shadow-lg shadow-black/10">
              {mode === "new" ? "Add Supplier" : "Save Changes"}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};