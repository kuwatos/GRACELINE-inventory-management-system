"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { editSupplierSchema } from "@/lib/validations";
import { Supplier } from "./supplier-table"; // Import the type from your table file
import { updateSupplierAction } from "@/lib/action/supplier.action";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  isViewOnly?: boolean;
}

export const EditSupplierModal = ({ isOpen, onClose, supplier, isViewOnly = false }: EditSupplierModalProps) => {
  const form = useForm<z.infer<typeof editSupplierSchema>>({
    resolver: zodResolver(editSupplierSchema),
    defaultValues: { 
      name: "", 
      supplierLandline: "",
      supplierEmail: "" ,
      supplierMobile: "" ,
      
    },
  });

  // Inject the supplier data when opened
  useEffect(() => {
    if (isOpen && supplier) {
      form.reset({
        name: supplier.supplierName,
        supplierLandline: supplier.supplierLandline || "",
        supplierEmail: supplier.supplierEmail || "",
        supplierMobile: supplier.supplierMobile || "",
      });
    }
  }, [isOpen, supplier, form]);

  async function onSubmit(values: z.infer<typeof editSupplierSchema>) {
      // 1. Safety check: make sure we actually have a supplier selected!
      if (!supplier) return; 
  
      try {
        // 2. Send the ID and the new form values across the bridge
        const result = await updateSupplierAction(supplier.supplierId, values);
  
        // 3. If the Robot Butler succeeds, close the modal
        if (result?.success) {
          onClose();
        } else {
          console.error("Failed to update supplier:", result?.error);
          alert("Failed to update supplier. Please try again.");
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    }

  const handleFormSubmit = isViewOnly ? (e: React.FormEvent) => e.preventDefault() : form.handleSubmit(onSubmit);
  const title = isViewOnly ? `View Supplier: ${supplier?.supplierId}` : `Edit Supplier: ${supplier?.supplierId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewOnly} className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-6">
              <FormField control={form.control} name="supplierLandline" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Landline</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewOnly} className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
              </div>

              <FormField control={form.control} name="supplierEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={isViewOnly} className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="px-8 h-12 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                {isViewOnly ? "Close" : "Cancel"}
              </Button>
              {!isViewOnly && (
                <Button type="submit" className="bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800">
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};