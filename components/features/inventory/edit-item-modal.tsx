"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { editItemSchema } from "@/lib/validations"; // Your shiny new schema!
import { toast } from "sonner";

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

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    code: string; 
    name: string;
    category: string;
    supplierId?: string; // Added this since your schema requires a supplier
    quantity: number;
    reorderLevel: number;
  } | null;
}

export const EditItemModal = ({ isOpen, onClose, item }: EditItemModalProps) => {
  // 1. Setup React Hook Form with your editItemSchema
  const form = useForm<z.infer<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    // THE MAGIC TRICK: We use 'values' here instead of 'defaultValues'. 
    // This forces the form to instantly update whenever you click a different item in the table!
    values: {
      supplierId: item?.supplierId || "",
      category: item?.category || "",
      productName: item?.name || "",
      reorderLevel: item?.reorderLevel || 0,
      newQuantity: item?.quantity || 0, 
      reason: "", 
    },
  });

  const { isSubmitting } = form.formState;

  // 2. The function that runs when you click Submit
  async function onSubmit(data: z.infer<typeof editItemSchema>) {
    try {
      // NOTE: We will replace this console.log with your real Server Action later!
      console.log("Ready to send this to the database:", data);
      
      toast.success("Item updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update item.");
    }
  }

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 py-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">
            Edit Inventory Item: {item.code}
          </DialogTitle>
        </DialogHeader>

        {/* 3. Wrap your form body in the Shadcn <Form> provider */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-10 py-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                
                {/* Product Name (Changed to Input so you can actually edit it!) */}
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Product Name</FormLabel>
                      <FormControl>
                        <Input className=" h-10 rounded-xl border-gray-200 focus-visible:ring-black/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1 bg-">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 focus:ring-black/5">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="office-supplies">Office Supplies</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          {/* Feel free to change these values to your actual Graceline categories! */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reorder Level */}
                <FormField
                  control={form.control}
                  name="reorderLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Reorder Level</FormLabel>
                      <FormControl>
                        <Input type="number" className="w-full h-10 rounded-xl border-gray-200 focus-visible:ring-black/5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock Adjustment Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Current Quantity</FormLabel>
                    <Input 
                      type="number"
                      readOnly
                      value={item.quantity}
                      className="h-10 rounded-xl bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  {/* New Quantity */}
                  <FormField
                    control={form.control}
                    name="newQuantity"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5 gap-0">
                        <FormLabel className="text-sm font-semibold text-gray-700 ml-1">New Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter new quantity..." className="h-10 rounded-xl border-gray-200 focus-visible:ring-black/5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Reason for Adjustment */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Reason for Adjustment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-black/5">
                            <SelectValue placeholder="Choose a reason..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restock">Regular Restock</SelectItem>
                          <SelectItem value="damage">Damaged Goods</SelectItem>
                          <SelectItem value="audit">Inventory Audit</SelectItem>
                          <SelectItem value="return">Customer Return</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

            <DialogFooter className="px-10 py-6 bg-gray-50/50 flex flex-row justify-end gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 h-10 rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-white hover:text-black"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 h-10 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};