"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Trash2, Edit3, Check, X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// --- MOCK DATA ---
const MOCK_INVENTORY_POOL = [
  { id: 101, name: "3/4 Marine Plywood" },
  { id: 102, name: "1/2 Marine Plywood" },
  { id: 103, name: "Steel Bars 12mm" },
  { id: 104, name: "Common Wire Nails 2\"" },
];

const INITIAL_SUPPLIER_PRODUCTS = [
  { id: 101, name: "3/4 Marine Plywood", price: 1450 },
  { id: 102, name: "1/2 Marine Plywood", price: 1100 },
];

export const EditSupplierModal = ({ isOpen, onClose, supplier, isViewOnly = false }: any) => {
  const [catalog, setCatalog] = useState(INITIAL_SUPPLIER_PRODUCTS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  
  const [selectedNewItem, setSelectedNewItem] = useState<string>("");
  const [newPrice, setNewPrice] = useState("");

  const handleLinkProduct = () => {
    if (!selectedNewItem || !newPrice) return;
    const item = MOCK_INVENTORY_POOL.find(i => i.id.toString() === selectedNewItem);
    if (item) {
      setCatalog([...catalog, { id: item.id, name: item.name, price: parseFloat(newPrice) }]);
      setSelectedNewItem("");
      setNewPrice("");
    }
  };

  const handleSaveEdit = (id: number) => {
    setCatalog(catalog.map(item => item.id === id ? { ...item, price: parseFloat(tempPrice) } : item));
    setEditingId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 border-none shadow-2xl rounded-2xl bg-white overflow-hidden text-left">
        <Tabs defaultValue="products" className="w-full">
          <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-100 bg-white">
            <div className="flex justify-between items-center w-full">
              <div className="text-left">
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  {isViewOnly ? "Supplier Details" : "Edit Supplier"}
                </DialogTitle>
                <p className="text-xs font-medium text-gray-400 mt-1">
                  ID: {supplier?.supplierId || "101"}
                </p>
              </div>
              <TabsList className="bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="info" className="rounded-lg px-4 py-2 text-xs font-semibold">General Info</TabsTrigger>
                <TabsTrigger value="products" className="rounded-lg px-4 py-2 text-xs font-semibold">Products & Pricing</TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>

          {/* TAB 1: General Info */}
          <TabsContent value="info" className="m-0 p-8 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 ml-1">Supplier Name</Label>
              <Input defaultValue={supplier?.supplierName} disabled={isViewOnly} className="h-11 rounded-xl border-gray-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 ml-1">Contact Person</Label>
              <Input defaultValue={supplier?.contact} disabled={isViewOnly} className="h-11 rounded-xl border-gray-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700 ml-1">Email Address</Label>
              <Input defaultValue={supplier?.email} disabled={isViewOnly} className="h-11 rounded-xl border-gray-200" />
            </div>
          </TabsContent>

          {/* TAB 2: Products & Pricing */}
          <TabsContent value="products" className="m-0 p-8 space-y-6">
            {/* LINK PRODUCT SECTION - Hidden in View Mode */}
            {!isViewOnly && (
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Link New Product</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select value={selectedNewItem} onValueChange={setSelectedNewItem}>
                      <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200">
                        <SelectValue placeholder="Select product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_INVENTORY_POOL.map(item => (
                          <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-36 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₱</span>
                    <Input 
                      type="number" 
                      placeholder="Price" 
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="h-11 pl-7 rounded-xl bg-white border-gray-200"
                    />
                  </div>
                  <Button onClick={handleLinkProduct} className="bg-[#0f172a] text-white rounded-xl px-6 font-semibold h-11">
                    Link Product
                  </Button>
                </div>
              </div>
            )}

            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Product Name</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400 text-right tracking-wider">Unit Price</TableHead>
                    {!isViewOnly && <TableHead className="px-6 py-4"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalog.map((item) => (
                    <TableRow key={item.id} className="border-b border-gray-50 last:border-none">
                      <TableCell className="px-6 py-4 font-medium text-gray-800 text-left">{item.name}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        {/* THE FIX: Only show input if NOT view-only AND this row is being edited */}
                        {!isViewOnly && editingId === item.id ? (
                          <Input 
                            type="number" 
                            value={tempPrice} 
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="h-9 w-24 ml-auto text-right font-bold border-gray-300"
                            autoFocus
                          />
                        ) : (
                          <span className="font-bold text-green-600">₱{item.price.toLocaleString()}</span>
                        )}
                      </TableCell>
                      
                      {/* ACTIONS: Hidden in View Mode */}
                      {!isViewOnly && (
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {editingId === item.id ? (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(item.id)} className="h-8 w-8 text-green-600"><Check className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-red-600"><X className="w-4 h-4" /></Button>
                              </>
                            ) : (
                              <>
                                <Button size="icon" variant="ghost" onClick={() => { setEditingId(item.id); setTempPrice(item.price.toString()); }} className="h-8 w-8 text-gray-300 hover:text-black"><Edit3 className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-300 hover:text-red-500" onClick={() => setCatalog(catalog.filter(c => c.id !== item.id))}><Trash2 className="w-4 h-4" /></Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end">
          <Button onClick={onClose} className="rounded-xl font-semibold px-8 h-11 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50">
            Close Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};