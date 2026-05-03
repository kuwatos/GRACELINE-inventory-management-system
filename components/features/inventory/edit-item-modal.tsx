"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { editItemSchema } from "@/lib/validations"; 
import { Check, ChevronsUpDown, Minus, ArrowRight } from "lucide-react";
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
import { executeAction } from "@/lib/error.handler";
import { authClient } from "@/lib/auth-client";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  categories: { name: string }[];
  measurements: { name: string }[];
  projects: { id: number; name: string }[];
  isViewOnly?: boolean;
}

export const EditItemModal =  ({ isOpen, onClose, item, categories, measurements, projects, isViewOnly = false }: EditItemModalProps) => {
  const {data: session,isPending,error} =  authClient.useSession();
  const user= session?.user; 
  const [openCombobox, setOpenCombobox] = useState(false);
  const [openCombobox2, setOpenCombobox2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Standardize names to Capital Case (e.g., "hardware" -> "Hardware")
  const formattedCategories = Array.from(
  new Map(
    categories.map((cat) => {
      const formattedName = 
        cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase();
      
      // Using formattedName as the Map key automatically overwrites 
      // identical names, leaving you with a unique list.
      return [formattedName, { ...cat, name: formattedName }];
    })
  ).values()
);

  const userDept = user?.department?.toLowerCase(); 
  const isWarehouse = userDept === "warehouse";
  const isPurchasing = userDept === "purchasing";
  
  const form = useForm<z.input<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    values: {
      productName: item?.productName || "",
      category1: item?.productCategory1 || "",
      category2: item?.productCategory2 || "",
      category3: item?.productCategory3 || "",
      category4: item?.productCategory4 || "",
      category5: item?.productCategory5 || "",
      productDesc: item?.productDesc || "",
      productQuantity: 0,
      reorderLevel: item?.reorderLevel || 0,
      measurement: item?.measurement || "",
      reason: "Initial edit", 
      projectId: undefined,
    },
  });
  
  const watchReason = form.watch("reason");
  // Track values to calculate the final result
  const watchDeduction = Number(form.watch("productQuantity")) || 0;
  const currentStock = item?.productQuantity || 0;
  const resultingStock = currentStock - watchDeduction;

  // The safeguard condition: 
  // Prevent negative totals unless the reason is a manual 'correction'
  const isInvalidDeduction = resultingStock < 0 && watchReason !== 'correction';

  async function onSubmit(data: z.input<typeof editItemSchema>) {
    setIsSubmitting(true);
    
    await executeAction(async () => {
      if (!item) throw new Error("Missing item context.");

      // 1. Validate the data first
      const validatedData = editItemSchema.parse(data);

      // 2. LOGIC CHANGE: I-subtract ang input sa current quantity bago i-save
      const finalQuantity = currentStock - validatedData.productQuantity;

      const res = await updateItemAction(item.productId, {
        ...validatedData,
        productQuantity: finalQuantity, // Ito ang ise-save na final total sa DB
      });
      if (!res.success) {
        throw res; 
      }
      form.reset();
      onClose();
      return res;
    }, "Item updated successfully!");
  
    setIsSubmitting(false);
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
            
            {!isWarehouse && (
              <>
            {/* SECTION: BASIC INFO */}
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-gray-700">Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Update product name..." className="h-11 rounded-xl border-gray-200 focus-visible:ring-black/5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* SECTION: CATEGORIES */}
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
                            className={cn("h-11 justify-between rounded-xl font-normal border-gray-200 focus-visible:ring-black/5", !field.value && "text-gray-400")}
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
                              {formattedCategories.map((cat) => (
                                <CommandItem
                                  key={cat.name}
                                  value={cat.name}
                                  onSelect={() => {
                                    // Set the value in the form
                                    // If your Zod schema uses .toLowerCase(), it will convert this automatically
                                    form.setValue("category1", cat.name);
                                    setOpenCombobox(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      // Case-insensitive check for the checkmark visibility
                                      cat.name.toLowerCase() === field.value?.toLowerCase() 
                                        ? "opacity-100" 
                                        : "opacity-0"
                                    )}
                                  />
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
                        <Input {...field} placeholder={`${catName} (Optional)`} className="h-10 rounded-xl text-xs border-gray-200 focus-visible:ring-black/5" />
                      </FormControl>
                    </FormItem>
                  )} />
                ))}
              </div>
            </div>

            {/* Unit of Measurement Combobox */}
            <FormField control={form.control} name="measurement" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-bold text-gray-700">Unit of Measurement</FormLabel>
                <Popover open={openCombobox2} onOpenChange={setOpenCombobox2}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-11 justify-between rounded-xl font-normal border-gray-200 focus-visible:ring-black/5",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {field.value || "Select or type unit..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[630px] p-0" align="start">
                    <Command>
                      <CommandInput 
                        placeholder="Search units (e.g., kg, pcs, box)..." 
                        onValueChange={(val) => field.onChange(val)} 
                      />
                      <CommandList>
                        <CommandEmpty>No matching unit. Type to create "{field.value}"</CommandEmpty>
                        <CommandGroup>
                          {measurements.map((unit) => (
                            <CommandItem
                              key={unit.name}
                              value={unit.name}
                              onSelect={() => {
                                form.setValue("measurement", unit.name);
                                setOpenCombobox2(false);
                              }}
                            >
                              <Check 
                                className={cn(
                                  "mr-2 h-4 w-4", 
                                  unit.name === field.value ? "opacity-100" : "opacity-0"
                                )} 
                              />
                              {unit.name}
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
            

            {/* SECTION: DESCRIPTION */}
            <FormField control={form.control} name="productDesc" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="rounded-xl resize-none h-24 border-gray-200 focus-visible:ring-black/5" placeholder="Update details..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
              </>
            )}

            {/* SECTION: STOCK & ADJUSTMENTS */}
            
            {!isPurchasing && (
                <div className="bg-red-50/30 p-6 rounded-2xl border border-red-100 space-y-4">
                  <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
                    <Minus className="w-4 h-4" /> Stock Deduction
                  </h3>
                  {resultingStock < 0 && watchReason !== 'correction' && (
                      <p className="text-[10px] text-red-600 font-bold">
                        Cannot deduct more than current stock.
                      </p>
                    )}
                  <div className="grid grid-cols-3 gap-4 items-end">
                    {/* Current stock (ReadOnly) */}  
                    <div className="space-y-2">
                      <FormLabel className="text-gray-500 text-xs">Current Stock</FormLabel>
                      <Input readOnly value={currentStock} className="h-11 rounded-xl bg-gray-100 border-none text-gray-500 cursor-not-allowed" />
                    </div>

                    {/* Amount to subtract */}
                    <FormField control={form.control} name="productQuantity" render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="font-bold text-red-700 text-xs">Amount to Minus</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min={0}
                            value={(field.value as number | string) ?? ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            className="h-11 rounded-xl border-red-200 focus-visible:ring-red-500/30" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Visual Preview */}
                    <div className="space-y-2">
                      <FormLabel className="text-gray-500 text-xs">Resulting Stock</FormLabel>
                      <div className="h-11 rounded-xl bg-gray-100 text-white flex items-center justify-between px-4">
                        <span className={cn("font-bold font-mono", resultingStock < 0 ? "text-red-400" : "text-green-400")}>
                          {resultingStock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-700 text-xs">Reorder Level</FormLabel>
                      <FormControl>
                        <Input {...field} value={(field.value as string) ?? ""} type="number" className="h-11 rounded-xl" />
                      </FormControl>
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="reason" render={({ field }) => (
                      <FormItem className={watchReason === "project" ? "col-span-1" : "col-span-2"}>
                        <FormLabel className="font-bold text-gray-700 text-xs">Reason for Deduction</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="h-11 rounded-xl bg-white"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="project">Used for a Project</SelectItem>
                            <SelectItem value="audit">Inventory Audit</SelectItem>
                            <SelectItem value="damage">Damaged / Expired</SelectItem>
                            <SelectItem value="manual restock">Manual Restock</SelectItem>
                            <SelectItem value="correction">Typo Correction</SelectItem>
                            <SelectItem value="returned">Returned to Supplier</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />

                    {watchReason === "project" && (
                      <FormField control={form.control} name="projectId" render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="font-bold text-gray-700 text-xs">Target Project</FormLabel>
                          <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                            <FormControl><SelectTrigger className="h-11 rounded-xl bg-white"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              {projects.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    )}
                  </div>
                </div>
              )}
          </div>

          <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="px-10 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isInvalidDeduction}
                className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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