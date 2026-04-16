"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupplierItemAction } from "@/lib/action/supplier-items.action";
import { newSupplierItemSchema } from "@/lib/validations";
import { useState } from "react";
import { executeAction } from "@/lib/error.handler";


interface NewSupplierItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: { supplierId: number; supplierName: string }[];
  products: { 
    productId: number; 
    productName: string; 
    productCategory1: string; // Added
    measurement: string;      // Added
  }[];
}

export const NewSupplierItemModal = ({ 
  isOpen, 
  onClose, 
  suppliers, 
  products 
}: NewSupplierItemModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.input<typeof newSupplierItemSchema>>({
    resolver: zodResolver(newSupplierItemSchema),
    defaultValues: { 
      supplierId: 0, 
      productId: 0, 
      unitPrice: ""
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.input<typeof newSupplierItemSchema>) {
    setIsSubmitting(true);
    
      // You call the wrapper here...
      await executeAction(async () => {
        
        // If THIS line fails (Zod Error), it stops and goes to the wrapper's catch.
        const validatedData = newSupplierItemSchema.parse(values);
    
        const res = await createSupplierItemAction(validatedData);
    
        // If THIS line runs, we manually trigger the wrapper's catch by throwing the result.
        if (!res.success) {
          throw res; 
        }
        form.reset();
        onClose();
        return res;
      }, "Supplier item added successfully!");
    
      setIsSubmitting(false);
    }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex flex-col items-center bg-gray-50/50">
         
          <DialogTitle className="text-2xl font-bold text-gray-900">Link Supplier Item</DialogTitle>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">Sourcing & Procurement</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-8 space-y-6">
              
              {/* Supplier Selection */}
              <FormField control={form.control} name="supplierId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={""}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-black">
                        <SelectValue placeholder="Choose a supplier" />
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

              {/* Product Selection */}
              <FormField control={form.control} name="productId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={""}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-black">
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.productId} value={p.productId.toString()}>
                          {/* Concatenated: Name - Category (Measurement) */}
                          {p.productName} — {p.productCategory1} ({p.measurement})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              {/* Unit Price Input */}
              <FormField control={form.control} name="unitPrice" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Unit Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        className="h-12 pl-8 rounded-xl border-gray-200 focus-visible:ring-black" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-8 h-12 rounded-xl font-bold text-gray-500">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Link Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};