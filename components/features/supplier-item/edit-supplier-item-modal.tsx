"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Link as LinkIcon } from "lucide-react";

import { editSupplierItemSchema, newSupplierItemSchema } from "@/lib/validations";
import { SupplierItem } from "./supplier-item-table"; // Adjust path as needed

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSupplierItemAction } from "@/lib/action/supplier-items.action";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";


interface EditSupplierItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SupplierItem | null;
  suppliers: { supplierId: number; supplierName: string }[];
  products: { 
    productId: number; 
    productName: string; 
    productCategory1: string; // Added
    measurement: string;      // Added
  }[];
  isViewOnly?: boolean;
}

export const EditSupplierItemModal = ({ 
  isOpen, 
  onClose, 
  item, 
  suppliers, 
  isViewOnly = false 
}: EditSupplierItemModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.input<typeof newSupplierItemSchema>>({
    resolver: zodResolver(newSupplierItemSchema),
    defaultValues: { 
      supplierId: 0, 
      productId: 0, 
      unitPrice: ""
    },
  });

  // Sync form when item changes
  useEffect(() => {
    if (isOpen && item) {
      form.reset({
        supplierId: item.supplierId ?? 0,
        productId: item.productId ?? 0,
        unitPrice: item.unitPrice?.toString() ?? "",
      });
    }
  }, [isOpen, item, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.input<typeof editSupplierItemSchema>) {
    setIsSubmitting(true);
    
    await executeAction(async () => {
      if (!item) {
        throw new Error("Missing item context. Please refresh and try again.");
      } // Just a safety check
      
      // If THIS line fails (Zod Error), it stops and goes to the wrapper's catch.
      const validatedData = editSupplierItemSchema.parse(values);
  
      const res = await updateSupplierItemAction(item.supplierItemId, validatedData);
  
      // If THIS line runs, we manually trigger the wrapper's catch by throwing the result.
      if (!res.success) {
        throw res; 
      }
      form.reset();
      onClose();
      return res;
    }, "Supplier item updated successfully!");
  
    setIsSubmitting(false);
  }

  const handleFormSubmit = isViewOnly ? (e: React.FormEvent) => e.preventDefault() : form.handleSubmit(onSubmit);
  const title = isViewOnly ? "View Supplier Link" : "Edit Supplier Link";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <DialogHeader className="px-8 py-8 border-b border-gray-100 flex flex-col items-center bg-gray-50/50">
              
              <DialogTitle className="text-2xl font-bold text-gray-900">{title}</DialogTitle>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
                {item?.productName || "Direct Sourcing"} - {item?.supplierName || "No Supplier"} ({item?.measurement || "N/A"})
              </p>
            </DialogHeader>

            <div className="p-8 space-y-6">
              {/* Supplier Selection - Editable */}
              <FormField control={form.control} name="supplierId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Assigned Supplier</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value?.toString()} 
                    disabled={isViewOnly}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-black">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.supplierId} value={s.supplierId.toString()}>
                          {s.supplierName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              {/* Unit Price Input - Editable */}
              <FormField control={form.control} name="unitPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Negotiated Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        disabled={isViewOnly}
                        className="h-12 pl-8 rounded-xl border-gray-200 focus-visible:ring-black disabled:bg-gray-50 disabled:text-gray-900" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-8 h-12 rounded-xl font-bold text-gray-500">
                {isViewOnly ? "Close" : "Cancel"}
              </Button>
              {!isViewOnly && (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800 transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
        <LoadingOverlay isLoading={isSubmitting} message="Saving Changes..." />
      </DialogContent>
    </Dialog>
  );
};