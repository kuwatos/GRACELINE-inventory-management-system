"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { newItemSchema } from "@/lib/validations";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createItemAction } from "@/lib/action/inventory.action";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: { id: number; name: string }[];
  categories: { name: string }[];
  measurements: { name: string }[];
}

export const NewItemModal = ({ isOpen, onClose, suppliers = [], categories = [], measurements = [] }: NewItemModalProps) => {
  const [openCombobox, setOpenCombobox] = useState(false);
  const [openCombobox2, setOpenCombobox2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.input<typeof newItemSchema>>({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      productName: "",
      category1: "",
      category2: "",
      category3: "",
      category4: "",
      category5: "",
      productDesc: "",
      productQuantity: 0,
      reorderLevel: 1,
      supplierId: 1,
      unitPrice: "1.00",
    },
  });

  async function onSubmit(values: z.input<typeof newItemSchema>) {
    setIsSubmitting(true);
    try {
      const validatedData = newItemSchema.parse(values);
      const result = await createItemAction(validatedData);

      if (result.success) {
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Server error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <DialogTitle className="text-xl font-bold text-gray-900">Add New Inventory Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* SECTION: BASIC INFO */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="productName" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-bold text-gray-700">Product Name</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Ultra-Slim Keyboard" className="h-11 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="supplierId" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-bold text-gray-700">Supplier</FormLabel>
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Choose a supplier..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* SECTION: CATEGORIES */}
              <div className="space-y-3">
                <FormLabel className="font-bold text-gray-700">Categorization</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Category 1: Typable Combobox */}
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
                              placeholder="Search or type new category..." 
                              onValueChange={(val) => field.onChange(val)} // Allows typing new values
                            />
                            <CommandList>
                              <CommandEmpty>No existing category found. Type to create new.</CommandEmpty>
                              <CommandGroup>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.name}
                                    value={category.name}
                                    onSelect={() => {
                                      form.setValue("category1", category.name);
                                      setOpenCombobox(false);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", category.name === field.value ? "opacity-100" : "opacity-0")} />
                                    {category.name}
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
                  
                  {/* Optional Categories 2-5 */}
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

              {/* MEASUREMENT */}
              <FormField control={form.control} name="measurement" render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col">
                  <FormLabel className="font-bold text-gray-700">Measurement</FormLabel>
                  <Popover open={openCombobox2} onOpenChange={setOpenCombobox2}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("h-11 justify-between rounded-xl font-normal border-gray-200", !field.value && "text-gray-400")}
                        >
                          {field.value || "Select or type unit..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[630px] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Search unit..." 
                          onValueChange={(val) => field.onChange(val)} 
                        />
                        <CommandList>
                          <CommandEmpty>No existing measurement found. Type to create new.</CommandEmpty>
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
                                <Check className={cn("mr-2 h-4 w-4", unit.name === field.value ? "opacity-100" : "opacity-0")} />
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
              {/* SECTION: DESCRIPTION & QUANTITY */}
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="productDesc" render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel className="font-bold text-gray-700">Description</FormLabel>
                    <FormControl><Textarea {...field} className="rounded-xl resize-none" placeholder="Dimensions, specs..." /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="unitPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Unit Price</FormLabel>
                    <FormControl><Input {...field} value={(field.value as string) ?? ""} placeholder="0.00" className="h-11 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="productQuantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Current Qty</FormLabel>
                    <FormControl><Input {...field} value={(field.value as string) ?? ""} type="number" className="h-11 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Reorder At</FormLabel>
                    <FormControl><Input {...field} value={(field.value as string) ?? ""} type="number" className="h-11 rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 gap-3">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl text-gray-500">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#0f172a] hover:bg-black text-white px-8 rounded-xl font-bold">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};