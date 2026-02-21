/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {toast} from "sonner"

const FAKE_SUPPLIERS = [
  { id: "office-supplies", name: "Office Supplies Co." },
  { id: "global-parts", name: "Global Parts Ltd" },
  { id: "tech-supply", name: "TechSupply Co." },
];

const INITIAL_CATEGORIES = [
  { id: "panels", name: "Panels" },
  { id: "hardware", name: "Hardware" },
  { id: "finishes", name: "Finishes" },
  { id: "adhesives", name: "Adhesives" },
];

const formSchema = z.object({
  supplierId: z.string().min(1, "Please select a supplier"),
  category: z.string().min(1, "Invalid category").max(25, "Invalid category"),
  productName: z.string().min(3, "Product name must be at least 3 characters").max(100, "Product name must be at most 100 characters"),
  reorderLevel: z.coerce.number<number>().int("Reorder level must be a whole number").min(1, "Level must at least be 1").max(1000, "You exceeded the maximum level"),
});

export const NewItemModal = ({ isOpen, onClose }: any) => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [categorySearch, setCategorySearch] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      category: "",
      productName: "",
      reorderLevel: 0,
    },
  });
  
  const { isSubmitting} = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Simulate a database call
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      
      // 1. Show the success message!
      toast.success("Item Added Successfully", {
        description: `${data.productName} has been saved to your inventory.`,
      });

      form.reset();
      onClose();

    } catch (error) {
      // 2. Show an error message if the "database" fails
      toast.error("Failed to add item", {
        description: "There was a problem connecting to the server. Please try again.",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            New Inventory Item: TI-2001
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-10 py-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              
              {/* --- SUPPLIER SELECT --- */}
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(
                          "w-full h-10 rounded-xl border-gray-200 focus:ring-black/5",
                          !field.value ? "text-gray-400" : "text-gray-900"
                        )}>
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FAKE_SUPPLIERS.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              {/* --- CATEGORY COMBOBOX --- */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-10 rounded-xl border-gray-200 font-normal hover:bg-transparent",
                              !field.value ? "text-gray-400" : "text-gray-900"
                            )}
                          >
                            {field.value
                              ? categories.find((c) => c.name === field.value)?.name || field.value
                              : "Select or type a category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search or add category..." 
                            onValueChange={setCategorySearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <div 
                                className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded-sm text-blue-600 font-medium text-center"
                                onClick={() => {
                                  if (categorySearch.trim()) {
                                    field.onChange(categorySearch.trim());
                                    if (!categories.find(c => c.name === categorySearch.trim())) {
                                       setCategories([...categories, { id: categorySearch.trim().toLowerCase(), name: categorySearch.trim() }]);
                                    }
                                  }
                                }}
                              >
                                {categorySearch.trim() ? `Create "${categorySearch}"` : "Add a new category"}
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue === field.value ? "" : currentValue);
                                  }}
                                  className="flex items-center justify-between group"
                                >
                                  <div className="flex items-center">
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === category.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {category.name}
                                  </div>
                                  
                                  {/* Delete Button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 rounded-md"
                                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation(); 
                                      setCategories(categories.filter((c) => c.id !== category.id));
                                      if (field.value === category.name) field.onChange("");
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              {/* --- PRODUCT NAME INPUT --- */}
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Product Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the product name..."
                        className="w-full h-10 rounded-xl border-gray-200 focus-visible:ring-black/5"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              {/* --- REORDER LEVEL INPUT --- */}
              <FormField
                control={form.control}
                name="reorderLevel"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Reorder Level</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        className="w-full h-10 rounded-xl border-gray-200 focus-visible:ring-black/5"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting} // Disable cancel while saving too
              >
                Cancel
              </Button>

              <Button 
                type="submit" 
                className="bg-black text-white"
                disabled={isSubmitting} // 2. Prevents double-clicking
              >
                {/* 3. Dynamic text feedback */}
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </span>
                ) : (
                  "Add Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};