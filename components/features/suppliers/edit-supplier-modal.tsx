"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { editSupplierSchema } from "@/lib/validations";
import { Package, Plus, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkProductModal } from "./link-product-modal";

export const EditSupplierModal = ({ isOpen, onClose, supplier, isViewOnly = false }: any) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof editSupplierSchema>>({
    resolver: zodResolver(editSupplierSchema),
    defaultValues: { name: "", contact: "", email: "" },
  });

  const fetchData = async () => {
    if (!supplier) return;
    setIsLoading(true);
    try {
      const [prodRes, invRes] = await Promise.all([
        fetch(`/api/suppliers/${supplier.id}/products`),
        fetch(`/api/inventory/minimal`) // Get item_tb list
      ]);
      setSupplierProducts(await prodRes.json());
      setInventoryItems(await invRes.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (isOpen && supplier) {
      form.reset({ name: supplier.name, contact: supplier.contact, email: supplier.email });
      fetchData();
    }
  }, [isOpen, supplier]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
          <Tabs defaultValue="info" className="w-full">
            <DialogHeader className="px-8 py-8 border-b border-gray-100 flex flex-row items-center justify-between">
              <div className="flex flex-col text-left">
                <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight leading-none uppercase">Manage Supplier</DialogTitle>
                <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">ID: {supplier?.id}</p>
              </div>
              <TabsList className="bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="info" className="rounded-lg px-6 py-2 font-bold text-xs">General Info</TabsTrigger>
                <TabsTrigger value="products" className="rounded-lg px-6 py-2 font-bold text-xs">Products & Pricing</TabsTrigger>
              </TabsList>
            </DialogHeader>

            <TabsContent value="info" className="m-0">
               {/* Same form as before, just connected to onSubmit backend */}
               <Form {...form}>
                <form onSubmit={form.handleSubmit(async (v) => {
                    await fetch(`/api/suppliers/${supplier.id}`, { method: 'PATCH', body: JSON.stringify(v) });
                    onClose();
                })}>
                  <div className="p-8 space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Supplier Name</FormLabel>
                        <FormControl><Input {...field} disabled={isViewOnly} className="h-12 rounded-xl border-gray-100 font-bold" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                    <Button type="button" variant="outline" onClick={onClose} className="font-bold text-gray-500">Cancel</Button>
                    {!isViewOnly && <Button type="submit" className="bg-black text-white px-10 h-11 rounded-xl font-bold">Save Changes</Button>}
                  </DialogFooter>
                </form>
               </Form>
            </TabsContent>

            <TabsContent value="products" className="m-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
                    <Package className="w-4 h-4" /> Supplied Items Catalog
                  </h3>
                  {!isViewOnly && (
                    <Button onClick={() => setIsLinkModalOpen(true)} className="bg-black text-white rounded-xl h-10 px-4 font-bold text-xs">
                      <Plus className="w-3 h-3 mr-2" /> Link New Product
                    </Button>
                  )}
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white min-h-[200px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-gray-300" /></div>
                  ) : (
                    <Table className="text-sm">
                      <TableHeader className="bg-gray-50/50">
                        <TableRow>
                          <TableHead className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Product Name</TableHead>
                          <TableHead className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Unit Price</TableHead>
                          {!isViewOnly && <TableHead className="px-6 py-4"></TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {supplierProducts.map((prod: any) => (
                          <TableRow key={prod.product_id} className="border-b border-gray-50 last:border-none">
                            <TableCell className="px-6 py-5 font-bold text-gray-800 text-left">{prod.product_name}</TableCell>
                            <TableCell className="px-6 py-5 text-right font-mono font-bold text-green-600">₱{prod.unit_price.toLocaleString()}</TableCell>
                            {!isViewOnly && (
                              <TableCell className="px-6 py-5 text-right">
                                <button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
              <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                <Button variant="outline" onClick={onClose} className="px-8 h-11 rounded-xl font-bold text-gray-500">Close Catalog</Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <LinkProductModal 
        isOpen={isLinkModalOpen} 
        onClose={() => setIsLinkModalOpen(false)} 
        supplierId={supplier?.id} 
        inventoryItems={inventoryItems}
        onSuccess={fetchData}
      />
    </>
  );
};