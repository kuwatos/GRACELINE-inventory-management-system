"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { editItemSchema } from "@/lib/validations"; // Your shiny new schema!
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";


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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "./inventory-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { updateItemAction } from "@/lib/action/inventory.action";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  categories: { name: string }[];
  isViewOnly?: boolean;
}

export const EditItemModal = ({ isOpen, onClose, item, categories, isViewOnly = false }: EditItemModalProps) => {
   const [openCombobox, setOpenCombobox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. Setup React Hook Form with your editItemSchema
  const form = useForm<z.input<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    // THE MAGIC TRICK: We use 'values' here instead of 'defaultValues'. 
    // This forces the form to instantly update whenever you click a different item in the table!
    values: {
      productName: item?.productName || "",
      category1: item?.productCategory1 || "",
      category2: item?.productCategory2 || "",
      category3: item?.productCategory3 || "",
      category4: item?.productCategory4 || "",
      category5: item?.productCategory5 || "",
      productDesc: item?.productDesc || "",
      productQuantity: item?.productQuantity || 0,
      reorderLevel: item?.reorderLevel || 0,
      reason: "Initial adjustment", 
    },
  });


  // 2. The function that runs when you click Submit
  async function onSubmit(data: z.input<typeof editItemSchema>) {
    // 1. Safety check: make sure we actually have a supplier selected!
          if (!item) return; 
      
          try {
            const validatedData = editItemSchema.parse(data);
            // 2. Send the ID and the new form values across the bridge
            const result = await updateItemAction(item.productId, validatedData);
      
            // 3. If the Robot Butler succeeds, close the modal
            if (result?.success) {
              onClose();
            } else {
              console.error("Failed to update item:", result?.error);
              alert("Failed to update item. Please try again.");
            }
          } catch (error) {
            console.error("Server error:", error);
          }
        }

  if (!item) return null;

  return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl">
      <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <DialogTitle className="text-xl font-bold text-gray-900">
          Edit Item: {item.productName}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* SECTION: BASIC INFO */}
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Update product name..." className="h-11 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* SECTION: CATEGORIES (Consistent with New Item) */}
            <div className="space-y-3">
              <FormLabel className="font-bold text-gray-700">Categorization</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="category1" render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-col">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("h-11 justify-between rounded-xl font-normal border-gray-200", !field.value && "text-gray-400")}
                          >
                            {field.value || "Select or type a category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[630px] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search or type..." 
                            onValueChange={(val) => field.onChange(val)} 
                          />
                          <CommandList>
                            <CommandEmpty>No matches. Type to create new.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((cat) => (
                                <CommandItem
                                  key={cat.name}
                                  value={cat.name}
                                  onSelect={() => {
                                    form.setValue("category1", cat.name);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", cat.name === field.value ? "opacity-100" : "opacity-0")} />
                                  {cat.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {["category2", "category3", "category4", "category5"].map((catName) => (
                    <FormField key={catName} control={form.control} name={catName as any} render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder={`${catName} (Optional)`} className="h-10 rounded-xl text-xs" />
                        </FormControl>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </div>

            {/* SECTION: DESCRIPTION */}
            <FormField control={form.control} name="productDesc" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="rounded-xl resize-none h-24" placeholder="Update details..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* SECTION: STOCK & ADJUSTMENTS */}
            <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100 space-y-4">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Inventory Adjustment</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Current Quantity (Visual Only) */}
                <div className="space-y-2">
                  <FormLabel className="text-gray-500 text-xs">Current Stock</FormLabel>
                  <Input 
                    readOnly 
                    value={(item.productQuantity?.toString() ?? "")}
                    className="h-11 rounded-xl bg-gray-100 border-none text-gray-500 cursor-not-allowed" 
                  />
                </div>

                {/* New Quantity Input */}
                <FormField control={form.control} name="productQuantity" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold text-gray-700 text-xs">Adjusted Stock</FormLabel>
                    <FormControl>
                      <Input {...field} value={(field.value as string) ?? ""} type="number" className="h-11 rounded-xl border-blue-200 focus:ring-blue-500" placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Reorder Level */}
                <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold text-gray-700 text-xs">Reorder Level</FormLabel>
                    <FormControl>
                      <Input {...field} value={(field.value as string) ?? ""} type="number" className="h-11 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Reason for change */}
              <FormField control={form.control} name="reason" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700 text-xs">Reason for Adjustment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-white">
                        <SelectValue placeholder="Why is this changing?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="audit">Inventory Audit</SelectItem>
                      <SelectItem value="damage">Damaged / Expired</SelectItem>
                      <SelectItem value="restock">Manual Restock</SelectItem>
                      <SelectItem value="correction">Typo Correction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl text-gray-500">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-zinc-800 text-white px-8 rounded-xl font-bold">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Item"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);
};