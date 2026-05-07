"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { newSupplierSchema } from "@/lib/validations";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupplierAction } from "@/lib/action/supplier.action";
import { useState } from "react";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSupplierModal = ({ isOpen, onClose }: NewSupplierModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof newSupplierSchema>>({
    resolver: zodResolver(newSupplierSchema),
    defaultValues: { 
      name: "", 
      supplierLandline: "", 
      supplierEmail: "",
      supplierMobile: "" 
    },
  });

  async function onSubmit(values: z.infer<typeof newSupplierSchema>) {
    setIsSubmitting(true);
        
    await executeAction(async () => {
      
      const validatedData = newSupplierSchema.parse(values);
  
      const res = await createSupplierAction(validatedData);
  
      if (!res.success) {
        throw res; 
      }
      form.reset();
      onClose();
      return res;
    }, "Supplier added successfully!");
  
    setIsSubmitting(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isSubmitting) return;  // block close while loading
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">Add New Supplier</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    {/* 👇 Applied standard focus ring */}
                    <Input {...field} className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <FormField control={form.control} name="supplierLandline" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Landline</FormLabel>
                  <FormControl>
                    {/* 👇 Applied standard focus ring */}
                    <Input {...field} className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <FormField control={form.control} name="supplierEmail" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Email Address</FormLabel>
                  <FormControl>
                    {/* 👇 Applied standard focus ring */}
                    <Input {...field} type="email" className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <FormField control={form.control} name="supplierMobile" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Mobile Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    {/* 👇 Applied standard focus ring */}
                    <Input {...field} className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { form.reset(); onClose(); }} className="px-8 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              {/* 👇 Applied #0f172a hover state and isSubmitting disabled state */}
              <Button type="submit" disabled={isSubmitting} className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10">
                {isSubmitting ? "Adding..." : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <LoadingOverlay isLoading={isSubmitting} message="Creating Supplier..." />
      </DialogContent>
    </Dialog>
  );
};