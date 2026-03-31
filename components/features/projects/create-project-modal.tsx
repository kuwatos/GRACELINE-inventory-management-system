"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Package } from "lucide-react";

export function CreateProjectModal({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [supplier, setSupplier] = useState<string>("");
  const [materials, setMaterials] = useState([{ id: Date.now(), itemId: "", qty: 0 }]);

  const addMaterial = () => setMaterials([...materials, { id: Date.now(), itemId: "", qty: 0 }]);
  const removeMaterial = (id: number) => setMaterials(materials.filter(m => m.id !== id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-8 rounded-xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Project Setup</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Step 1: Choose Primary Supplier</label>
            <Select onValueChange={setSupplier}>
              <SelectTrigger className="h-12 border-slate-200">
                <SelectValue placeholder="Select supplier for this project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buildpro">BuildPro Supplies</SelectItem>
                <SelectItem value="hardware-solutions">Hardware Solutions Inc.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Step 2: Add Materials (To Deduct)</label>
              <Button 
                variant="outline" size="sm" onClick={addMaterial} disabled={!supplier}
                className="h-8 gap-2 border-slate-200 text-slate-600"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </Button>
            </div>

            {/* If no supplier is chosen, show a hint */}
            {!supplier ? (
              <div className="h-32 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-sm italic">
                Choose a supplier first to view available materials
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {materials.map((m) => (
                  <div key={m.id} className="flex gap-3 items-center animate-in slide-in-from-left-2">
                    <div className="flex-1">
                      <Select>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Material" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* These items would filter based on supplier in the backend */}
                          <SelectItem value="plywood">3/4" Marine Plywood</SelectItem>
                          <SelectItem value="mdf">1/2" MDF Board</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input type="number" placeholder="Qty" className="w-24 h-10" />
                    <Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)} className="text-slate-300 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-zinc-900 px-8 h-12" disabled={!supplier}>Deduct & Create Project</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}