"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { newOrderSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NewOrderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const form = useForm<z.infer<typeof newOrderSchema>>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      supplier: "",
      expected: "",
      products: [{ productId: "", qty: 1 }], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function onSubmit(values: z.infer<typeof newOrderSchema>) {
    console.log("Ready for Supabase Insert:", values);
    handleClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">Create New Purchase Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[65vh]">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-5">
                  <FormField control={form.control} name="supplier" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn("h-11 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-0", !field.value && "text-gray-400")}>
                            <SelectValue placeholder="Select supplier..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Office Supplies Co.">Office Supplies Co.</SelectItem>
                          <SelectItem value="Furniture Plus">Furniture Plus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="expected" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Expected Delivery</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0" />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-bold text-gray-800 ml-1">Products</FormLabel>
                    <FormMessage className="text-xs text-red-500">
                      {form.formState.errors.products?.root?.message}
                    </FormMessage>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex-1">
                          <FormField control={form.control} name={`products.${index}.productId`} render={({ field: productField }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product {index + 1}</FormLabel>
                              <Select onValueChange={productField.onChange} defaultValue={productField.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-0">
                                    <SelectValue placeholder="Select product..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PROD-001">Office Chair - Ergonomic</SelectItem>
                                  <SelectItem value="PROD-002">Wireless Mouse</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs text-red-500 ml-1" />
                            </FormItem>
                          )} />
                        </div>
                        
                        <div className="w-24">
                          <FormField control={form.control} name={`products.${index}.qty`} render={({ field: qtyField }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expected Qty</FormLabel>
                              <FormControl>
                                <Input {...qtyField} type="number" className="h-11 bg-white rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0" />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500 ml-1" />
                            </FormItem>
                          )} />
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button type="button" variant="outline" onClick={() => append({ productId: "", qty: 1 })} className="w-full h-12 border-dashed border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 rounded-xl transition-all font-bold">
                    <Plus className="w-4 h-4 mr-2" /> Add Product Row
                  </Button>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-8 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/70">
                Submit Order
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};