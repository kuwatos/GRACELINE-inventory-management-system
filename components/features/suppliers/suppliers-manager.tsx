// app/components/features/suppliers/suppliers-manager.tsx
"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SupplierModal } from "./supplier-modal";

const MOCK_SUPPLIERS = [
  { id: "SUP-001", name: "Office Supplies Co.", contact: "John Doe", email: "john@office.com", category: "Stationery" },
  { id: "SUP-002", name: "Tech Solutions Ltd.", contact: "Jane Smith", email: "jane@tech.com", category: "Hardware" },
  { id: "SUP-003", name: "Furniture Plus", contact: "Mike Ross", email: "mike@furniture.com", category: "Furniture" },
];

export const SuppliersManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "view">("new");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const openModal = (mode: "new" | "edit" | "view", supplier?: any) => {
    setModalMode(mode);
    setSelectedSupplier(supplier || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800">Supplier Directory</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by supplier name or ID..." 
                className="pl-9 h-11 border-gray-200 focus-visible:ring-black rounded-xl"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none h-11 px-5 bg-[#E5E7EB] rounded-xl text-sm font-medium pr-10 focus:outline-none cursor-pointer">
                <option>Filter Category</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <Button 
              onClick={() => openModal("new")}
              className="bg-black text-white hover:bg-zinc-800 h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-black/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Supplier
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supplier ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supplier Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Contact Person</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_SUPPLIERS.map((sup) => (
                <tr key={sup.id} className="group hover:bg-black transition-colors cursor-default">
                  <td className="px-6 py-6 font-mono text-xs text-gray-500 group-hover:text-zinc-400">{sup.id}</td>
                  <td className="px-6 py-6 font-medium text-gray-800 group-hover:text-white">{sup.name}</td>
                  <td className="px-6 py-6 text-gray-600 group-hover:text-zinc-300">{sup.contact}</td>
                  <td className="px-6 py-6">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase group-hover:bg-white/10 group-hover:text-white">
                      {sup.category}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal("view", sup)} className="text-zinc-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openModal("edit", sup)} className="text-zinc-400 hover:text-white transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-zinc-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        supplier={selectedSupplier}
      />
    </div>
  );
};