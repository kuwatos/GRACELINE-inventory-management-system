/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// 1. Setup the Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Supplier name must be at least 2 characters"),
  contact: z.string().min(2, "Contact person must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  email: z.string().email("Please enter a valid email address"),
});

export const SupplierModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  supplier 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  mode: "new" | "edit" | "view"; 
  supplier: any 
}) => {
  const isView = mode === "view";
  const title = mode === "new" 
    ? "Add New Supplier" 
    : mode === "edit" 
      ? `Edit Supplier: ${supplier?.id}` 
      : `View Supplier: ${supplier?.id}`;

  // 2. Initialize React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      category: "",
      email: "",
    },
  });

  // 3. Dynamically inject the supplier data when the modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: supplier?.name || "",
        contact: supplier?.contact || "",
        category: supplier?.category || "",
        email: supplier?.email || "",
      });
    }
  }, [isOpen, supplier, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("SUCCESS! Ready for DB:", values);
    form.reset();
    onClose();
  }

  // Prevent form submission if we are just "viewing" the data
  const handleFormSubmit = isView 
    ? (e: React.FormEvent) => e.preventDefault() 
    : form.handleSubmit(onSubmit);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* We removed createPortal, Shadcn handles it and applies the blur globally now! */}
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* --- SUPPLIER NAME --- */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Supplier Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isView} // Disables the input in view mode
                        className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                {/* --- CONTACT PERSON --- */}
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Contact Person</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={isView}
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" 
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )}
                />

                {/* --- CATEGORY SELECT --- */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value} // Controlled value so reset() works cleanly
                        disabled={isView}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(
                            "h-12 rounded-xl border-gray-200 focus:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900 disabled:opacity-100",
                            !field.value ? "text-gray-400" : "text-gray-900"
                          )}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Stationery">Stationery</SelectItem>
                          <SelectItem value="Hardware">Hardware</SelectItem>
                          <SelectItem value="Furniture">Furniture</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- EMAIL ADDRESS --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        disabled={isView}
                        className="h-12 rounded-xl border-gray-200 focus-visible:ring-black/5 disabled:bg-gray-50 disabled:text-gray-900" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onClose();
                }} 
                className="px-8 h-12 rounded-xl font-bold text-gray-500 hover:text-gray-900"
              >
                {isView ? "Close" : "Cancel"}
              </Button>
              
              {/* Only show the submit button if we are NOT in view mode */}
              {!isView && (
                <Button 
                  type="submit"
                  className="bg-black text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-zinc-800"
                >
                  {mode === "new" ? "Add Supplier" : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};