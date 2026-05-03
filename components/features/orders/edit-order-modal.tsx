"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { editOrderSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { OrderRecord } from "./order-history-table";
import { ProjectOption, SupplierProduct, updateOrderAction } from "@/lib/action/order.action";
import { executeAction } from "@/lib/error.handler";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import Big from "big.js";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  supplierProducts: SupplierProduct[];
  projects: ProjectOption[];
}

export const EditOrderModal = ({ isOpen, onClose, order, supplierProducts, projects }: EditOrderModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Products for this specific order's supplier — fixed, never changes
  const availableProducts = supplierProducts.filter(
    (p) => p.supplierId === order?.supplierId
  );

  const handleProductSelect = (index: number, productId: number) => {
    form.setValue(`products.${index}.productId`, productId);
    const match = availableProducts.find((p) => p.productId === productId);
    if (match) {
      form.setValue(`products.${index}.unitPrice`, match.unitPrice);
    }
  };

  const form = useForm<
    z.input<typeof editOrderSchema>,
    any,
    z.output<typeof editOrderSchema>
  >({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      supplierId: 0,
      projectId: undefined,
      deliveryDate: undefined,
      products: [{ productId: 0, unitPrice: "", quantity: 1 }],
    },
  });

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

  useEffect(() => {
    if (isOpen && order) {
      form.reset({
        supplierId: order.supplierId,
        projectId: order.projectId,
        deliveryDate: order.expectedDelivery ? new Date(order.expectedDelivery) : undefined,
        products: order.products.length > 0
          ? order.products.map((p) => ({
              productId: p.productId,
              unitPrice: String(p.unitPrice),
              quantity: p.expectedQty,
            }))
          : [{ productId: 0, unitPrice: "", quantity: 1 }],
      });
    }
  }, [isOpen, order, form]);

  const getRowTotal = (index: number): string => {
    const row = watchedProducts?.[index];
    const product = availableProducts.find((p) => p.productId === Number(row?.productId));
    if (!product || !row?.quantity) return "—";
    try {
      return new Big(product.unitPrice).times(new Big(row.quantity as number)).toFixed(2);
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
          return acc.plus(new Big(product.unitPrice).times(new Big(row.quantity as number)));
        }, new Big(0))
        .toFixed(2);
    } catch {
      return "0.00";
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  async function onSubmit(values: z.output<typeof editOrderSchema>) {
    if (!order) return;
    setIsSubmitting(true);
    await executeAction(async () => {
      const res = await updateOrderAction(order.poId, values);
      if (!res.success) throw res;
      handleClose();
      return res;
    }, "Order updated successfully!");
    setIsSubmitting(false);
  }

   return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl flex flex-col h-[90vh] max-h-[90vh]">
        <LoadingOverlay isLoading={isSubmitting} message="Saving changes..." />
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center shrink-0">
          <DialogTitle className="text-2xl font-medium text-gray-900">Edit Order: {order?.poId}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <ScrollArea className="flex-1 h-0">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-5">

                  {/* Supplier: read-only, no select */}
                  <div className="flex flex-col gap-2 ">
                    <p className="text-sm font-semibold text-gray-700 ml-1">Supplier</p>
                    {/* 👇 Applied !h-11 for exact alignment */}
                    <p className="!h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm">
                      {order?.supplierName}
                    </p>
                  </div>

                  {/* Delivery Date */}
                  <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Expected Delivery</FormLabel>
                      <FormControl>
                        {/* 👇 Applied !h-11 and standard focus ring */}
                        <Input
                          type="date"
                          value={field.value ? new Date(field.value as Date).toISOString().split("T")[0] : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          className="!h-11 w-full rounded-xl border-gray-200 focus-visible:ring-black/5"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />
                </div>

                  {/* Project (optional) */}
                  <FormField control={form.control} name="projectId" render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">
                        Project <span className="text-gray-400 font-normal"></span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(val === "none" ? null : Number(val))}
                        value={field.value ? String(field.value) : "none"}
                      >
                        <FormControl>
                          {/* 👇 Applied !h-11 and standard focus ring */}
                          <SelectTrigger className="!h-11 w-full rounded-xl border-gray-200 focus:ring-black/5">
                            <SelectValue placeholder="Select project..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

                  <div className="overflow-x-auto pb-1">
                    <div className="space-y-3 min-w-[560px]">
                        {fields.map((field, index) => {
                          const selectedProductId = form.watch(`products.${index}.productId`);
                          const selectedProduct = availableProducts.find((p) => p.productId === Number(selectedProductId));
                          
                          // IDs selected in OTHER rows
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
                                <FormItem className="flex flex-col gap-2">
                                  <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product {index + 1}</FormLabel>
                                  <Select
                                    onValueChange={(val) => handleProductSelect(index, Number(val))}
                                    value={f.value ? String(f.value as number) : ""}
                                  >
                                    <FormControl>
                                      {/* 👇 Applied !h-11, w-full, and standard focus ring */}
                                      <SelectTrigger className="!h-11 w-full bg-white rounded-xl border-gray-200 focus:ring-black/5">
                                        <SelectValue placeholder="Select product..." />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {dropdownOptions.map((p) => (
                                        <SelectItem key={p.productId} value={String(p.productId)}>
                                          <div className="flex flex-col gap-0.5 py-0.5">
                                            <span className="font-medium text-gray-900">{p.productName}</span>
                                            <span className="text-[11px] text-gray-400">
                                              {p.productCategory1} · {p.measurement}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-xs text-red-500 ml-1" />
                                </FormItem>
                              )} />
                            </div>

                            {/* Unit price display only */}
                            <div className="w-28">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Unit Price</p>
                              {/* 👇 Applied !h-11 */}
                              <div className="!h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium">
                                {selectedProduct ? `₱${selectedProduct.unitPrice}` : "—"}
                              </div>
                            </div>

                            <div className="w-24">
                              <FormField control={form.control} name={`products.${index}.quantity`} render={({ field: f }) => (
                                <FormItem className="flex flex-col gap-2">
                                  <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Qty</FormLabel>
                                  <FormControl>
                                    {/* 👇 Applied !h-11 and standard focus ring */}
                                    <Input
                                      type="number"
                                      name={f.name}
                                      ref={f.ref}
                                      value={f.value as number}
                                      onChange={f.onChange}
                                      onBlur={f.onBlur}
                                      className="!h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-black/5"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs text-red-500 ml-1" />
                                </FormItem>
                              )} />
                            </div>

                            <div className="w-28">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">Total</p>
                              {/* 👇 Applied !h-11 */}
                              <div className="!h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-green-700 text-sm font-bold">
                                {getRowTotal(index) !== "—" ? `₱${getRowTotal(index)}` : "—"}
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
                  
                  <div className="flex justify-end pt-2">
                    <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-3 rounded-xl">
                      <span className="text-sm font-semibold">Order Total</span>
                      <span className="text-lg font-bold">₱{grandTotal()}</span>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3 shrink-0">
              <Button type="button" variant="outline" onClick={handleClose} className="px-10 h-11 rounded-xl text-gray-500">Cancel</Button>
              {/* 👇 Applied standard #0f172a hover state */}
              <Button type="submit" disabled={isSubmitting} className="bg-[#0f172a] hover:bg-[#0f172a]/90 text-white px-10 h-11 rounded-xl font-bold">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <LoadingOverlay isLoading={isSubmitting} message="Saving Changes..." />
      </DialogContent>
    </Dialog>
  );
};