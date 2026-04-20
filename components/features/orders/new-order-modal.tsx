"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { newOrderSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createOrderAction } from "@/lib/action/order.action";
import { executeAction } from "@/lib/error.handler";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Big from "big.js";
import { ProjectOption, SupplierOption, SupplierProduct } from "@/lib/action/order.action";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: SupplierOption[];
  supplierProducts: SupplierProduct[];
  projects: ProjectOption[];
}

export const NewOrderModal = ({ isOpen, onClose, suppliers, supplierProducts, projects }: NewOrderModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  // Products available for the selected supplier
  const availableProducts = supplierProducts.filter(
    (p) => p.supplierId === selectedSupplierId
  );

  const form = useForm<
    z.input<typeof newOrderSchema>,
    any,
    z.output<typeof newOrderSchema>
  >({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      supplierId: 0,
      projectId: undefined,
      deliveryDate: undefined,
      products: [{ productId: 0, unitPrice: "", quantity: 1 }],
    },
  });

  const getRowTotal = (index: number): string => {
    const row = watchedProducts?.[index];
    const product = availableProducts.find((p) => p.productId === Number(row?.productId));
    if (!product || !row?.quantity) return "—";
    try {
      return new Big(product.unitPrice).times(new Big(row.quantity)).toFixed(2);
    } catch {
      return "—";
    }
  };

  const grandTotal = (): string => {
    if (!watchedProducts?.length) return "0.00";
    try {
      return watchedProducts
        .reduce((acc, row) => {
          const product = availableProducts.find((p) => p.productId === Number(row?.productId));
          if (!product || !row?.quantity) return acc;
          return acc.plus(new Big(product.unitPrice).times(new Big(row.quantity)));
        }, new Big(0))
        .toFixed(2);
    } catch {
      return "0.00";
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });
  const watchedProducts = form.watch("products");

  const selectedProductIds = watchedProducts
    .map((p) => Number(p.productId))
    .filter(Boolean);

  const hasAvailableProducts = availableProducts.some(
    (p) => !selectedProductIds.includes(p.productId)
  );
  
  const handleClose = () => {
    form.reset();
    setSelectedSupplierId(null);
    onClose();
  };

  // When a product is selected, auto-fill its unit price
  const handleProductSelect = (index: number, productId: number) => {
    form.setValue(`products.${index}.productId`, productId);
    const match = availableProducts.find((p) => p.productId === productId);
    if (match) {
      form.setValue(`products.${index}.unitPrice`, match.unitPrice);
    }
  };

  async function onSubmit(values: z.output<typeof newOrderSchema>) {
    setIsSubmitting(true);
    await executeAction(async () => {
      const res = await createOrderAction(values);
      if (!res.success) throw res;
      handleClose();
      return res;
    }, "Order created successfully!");
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl flex flex-col h-[90vh] max-h-[90vh]">
        <LoadingOverlay isLoading={isSubmitting} message="Creating order..." />
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center shrink-0">
          <DialogTitle className="text-2xl font-medium text-gray-900">Create New Purchase Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <ScrollArea className="flex-1 h-0">
              <div className="p-8 space-y-8">

                {/* Row 1: Supplier + Delivery Date */}
                <div className="grid grid-cols-2 gap-5">
                  <FormField control={form.control} name="supplierId" render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          const id = Number(val);
                          field.onChange(id);
                          setSelectedSupplierId(id);
                          form.setValue("products", [{ productId: 0, unitPrice: "", quantity: 1 }]);
                        }}
                        value={field.value ? String(field.value as number) : ""}
                      >
                        <FormControl>
                          {/* 👇 Applied standard focus ring */}
                          <SelectTrigger className={cn("h-11! w-full rounded-xl border-gray-200 focus:ring-black/5", !(field.value as number) && "text-gray-400")}>
                            <SelectValue placeholder="Select supplier..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((s) => (
                            <SelectItem key={s.supplierId} value={String(s.supplierId)}>{s.supplierName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                    <FormItem className="flex flex-col gap-2 ">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Expected Delivery</FormLabel>
                      <FormControl>
                        {/* 👇 Applied standard focus ring */}
                        <Input
                          type="date"
                          value={field.value ? new Date(field.value as Date).toISOString().split("T")[0] : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />
                </div>

                {/* Row 2: Project (optional) */}
                <FormField control={form.control} name="projectId" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">
                      Project <span className="text-gray-400 font-normal">(optional)</span>
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "none" ? undefined : Number(val))}
                      value={field.value ? String(field.value as number) : "none"}
                    >
                      <FormControl>
                        {/* 👇 Applied standard focus ring */}
                        <SelectTrigger className="h-11! w-full rounded-xl border-gray-200 focus:ring-black/5">
                          <SelectValue placeholder="Select project..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {projects.map((p) => (
                          <SelectItem key={p.projectId} value={String(p.projectId)}>{p.projectName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )} />

                {/* Products */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-bold text-gray-800 ml-1">Products</FormLabel>
                    <FormMessage className="text-xs text-red-500">
                      {form.formState.errors.products?.root?.message}
                    </FormMessage>
                  </div>

                  {!selectedSupplierId ? (
                    <p className="text-sm text-gray-400 text-center py-4">Select a supplier first to add products.</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto pb-1">
                        <div className="space-y-3 min-w-[560px]">
                          {fields.map((field, index) => {
                            const selectedProductId = form.watch(`products.${index}.productId`);
                            const selectedProduct = availableProducts.find((p) => p.productId === Number(selectedProductId));
                            const rowTotal = getRowTotal(index);
                            
                            // IDs selected in OTHER rows — this row can still show its own current value
                            const selectedInOtherRows = form
                              .watch("products")
                              .filter((_, i) => i !== index)
                              .map((p) => Number(p.productId))
                              .filter(Boolean);

                            // Products available for this row's dropdown
                            const dropdownOptions = availableProducts.filter(
                              (p) => !selectedInOtherRows.includes(p.productId)
                            );

                            return (
                              <div key={field.id} className="flex gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex-1">
                                  <FormField control={form.control} name={`products.${index}.productId`} render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product {index + 1}</FormLabel>
                                      <Select
                                        onValueChange={(val) => handleProductSelect(index, Number(val))}
                                        value={f.value ? String(f.value as number) : ""}
                                      >
                                        <FormControl>
                                          {/* 👇 Applied standard focus ring and w-full */}
                                          <SelectTrigger className="h-11 w-full bg-white rounded-xl border-gray-200 focus:ring-black/5">
                                            <SelectValue placeholder="Select product..." />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {dropdownOptions.map((p) => (
                                            <SelectItem key={p.productId} value={String(p.productId)}>
                                              {p.productName}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage className="text-xs text-red-500 ml-1" />
                                    </FormItem>
                                  )} />
                                </div>

                                {/* Unit Price — read only */}
                                <div className="w-24">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Unit Price</p>
                                  <div className="h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium">
                                    {selectedProduct ? `₱${selectedProduct.unitPrice}` : "—"}
                                  </div>
                                </div>

                                {/* Qty */}
                                <div className="w-20">
                                  <FormField control={form.control} name={`products.${index}.quantity`} render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Qty</FormLabel>
                                      <FormControl>
                                        {/* 👇 Applied standard focus ring */}
                                        <Input
                                          type="number"
                                          name={f.name}
                                          ref={f.ref}
                                          value={f.value as number}
                                          onChange={f.onChange}
                                          onBlur={f.onBlur}
                                          className="h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-black/5"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs text-red-500 ml-1" />
                                    </FormItem>
                                  )} />
                                </div>

                                {/* Row Total */}
                                <div className="w-28">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Total</p>
                                  <div className="h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-green-700 text-sm font-bold">
                                    {rowTotal !== "—" ? `₱${rowTotal}` : "—"}
                                  </div>
                                </div>

                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ productId: 0, unitPrice: "", quantity: 1 })}
                        disabled={!hasAvailableProducts}
                        className="w-full h-12 border-dashed border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 rounded-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {hasAvailableProducts ? "Add Product Row" : "All products added"}
                      </Button>

                      {/* Grand Total */}
                      <div className="flex justify-end pt-2">
                        <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3 rounded-xl">
                          <span className="text-sm font-semibold">Order Total</span>
                          <span className="text-lg font-bold">₱{grandTotal()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-10 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <LoadingOverlay isLoading={isSubmitting} message="Creating Order Draft..." />
      </DialogContent>
    </Dialog>
  );
};