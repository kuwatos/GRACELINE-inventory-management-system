"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditProjectModal({ projectId, onOpenChange }: { projectId: string | null, onOpenChange: (o: boolean) => void }) {
  const [supplier, setSupplier] = useState<string>("TechSupply Co.");
  const [materials, setMaterials] = useState([
    { id: 1, itemId: "pnl-101", qty: 45 }
  ]);

  const addMaterial = () => setMaterials([...materials, { id: Date.now(), itemId: "", qty: 1 }]);
  const removeMaterial = (id: number) => setMaterials(materials.filter(m => m.id !== id));

  return (
    <Dialog open={!!projectId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white p-0 rounded-xl overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0 text-center">
          <DialogTitle className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Edit Project: {projectId}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Supplier Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Supplier</label>
            <Select defaultValue={supplier} onValueChange={setSupplier}>
              <SelectTrigger className="h-11 border-slate-200 bg-white">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TechSupply Co.">TechSupply Co.</SelectItem>
                <SelectItem value="BuildPro">BuildPro Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Products</h3>
            
            <div className="space-y-3">
              {materials.map((m, index) => (
                <div key={m.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product {index + 1}</span>
                    <button onClick={() => removeMaterial(m.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Select defaultValue={m.itemId}>
                        <SelectTrigger className="h-10 bg-white border-slate-200">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pnl-101">3/4" Marine Plywood 4x8</SelectItem>
                          <SelectItem value="pnl-102">1/2" MDF Board 4x8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input type="number" defaultValue={m.qty} className="h-10 bg-white border-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Product Row Button */}
            <button 
              onClick={addMaterial}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:border-slate-400 hover:text-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Product Row
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50/50 border-t flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6">
            Cancel
          </Button>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white h-11 px-8 rounded-lg font-bold">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}