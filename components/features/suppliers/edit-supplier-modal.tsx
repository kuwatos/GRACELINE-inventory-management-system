"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { editSupplierSchema } from "@/lib/validations";
import { Supplier } from "./supplier-table";
import { executeAction } from "@/lib/error.handler";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateSupplierAction } from "@/lib/action/supplier.action";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  isViewOnly?: boolean;
}

export const EditSupplierModal = ({ isOpen, onClose, supplier, isViewOnly = false }: EditSupplierModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Setup React Hook Form
  const form = useForm<z.infer<typeof editSupplierSchema>>({
    resolver: zodResolver(editSupplierSchema),
    defaultValues: { 
      name: "", 
      supplierLandline: "",
      supplierEmail: "",
      supplierMobile: "",
    },
  });
  // 2. Sync Form when supplier changes
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

  // 3. Submit Handler
  async function onSubmit(values: z.infer<typeof editSupplierSchema>) {
    setIsSubmitting(true);
    await executeAction(async () => {
      if (!supplier) {
        throw new Error("Missing supplier context. Please refresh and try again.");
      } // Just a safety check
      
      // If THIS line fails (Zod Error), it stops and goes to the wrapper's catch.
      const validatedData = editSupplierSchema.parse(values);
  
      const res = await updateSupplierAction(supplier.supplierId,validatedData);
  
      // If THIS line runs, we manually trigger the wrapper's catch by throwing the result.
      if (!res.success) {
        throw res; 
      }
      form.reset();
      onClose();
      return res;
    }, "Supplier updated successfully!");
  
    setIsSubmitting(false);
  }

  const handleFormSubmit = isViewOnly ? (e: React.FormEvent) => e.preventDefault() : form.handleSubmit(onSubmit);
  const title = isViewOnly ? `View Supplier: ${supplier?.supplierId}` : `Edit Supplier: ${supplier?.supplierId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none shadow-2xl rounded-2xl bg-white overflow-hidden text-left">
        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <DialogHeader className="px-8 py-8 border-b border-gray-100 bg-gray-50/50">
              <div className="text-left">
                <DialogTitle className="text-2xl font-semibold text-gray-900">{title}</DialogTitle>
                <p className="text-xs font-medium text-gray-400 mt-1">ID: {supplier?.supplierId || "N/A"}</p>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-5">
              {/* Supplier Name */}
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewOnly} className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              {/* Mobile & Landline Grid */}
              <div className="grid grid-cols-2 gap-6">
                <FormField control={form.control} name="supplierMobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Mobile Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isViewOnly} className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )} />

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

              {/* Email Address */}
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
                <Button type="submit" disabled={isSubmitting} className="bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800 transition-all active:scale-95">
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