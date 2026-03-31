"use client";

import { Check, Package, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface ProjectDetailProps {
  projectId: string;
  onClose: () => void;
}

export function ProjectDetail({ projectId, onClose }: ProjectDetailProps) {
  // Mock data representing materials deducted for this specific project
  const projectMaterials = [
    { code: "PNL-101", name: '3/4" Marine Plywood 4x8', qty: 45, unit: "Sheet" },
    { code: "PNL-102", name: '1/2" MDF Board 4x8', qty: 20, unit: "Sheet" },
    { code: "HW-201", name: "Soft-Close Cabinet Hinge (Pair)", qty: 120, unit: "Pair" },
    { code: "HW-202", name: "18-inch Drawer Slides (Pair)", qty: 60, unit: "Pair" },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white p-0 rounded-xl overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0 text-center">
          <DialogTitle className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Project Materials: Warehouse Expansion
          </DialogTitle>
          <p className="text-xs text-slate-400 font-mono mt-2">ID: {projectId}</p>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Materials List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Deducted Inventory Items</h3>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-slate-900 border-none">
                    <TableHead className="text-white font-bold text-xs py-3">Product Code</TableHead>
                    <TableHead className="text-white font-bold text-xs py-3">Item Name</TableHead>
                    <TableHead className="text-white font-bold text-center text-xs py-3">Quantity</TableHead>
                    <TableHead className="text-white font-bold text-right text-xs py-3 px-6">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectMaterials.map((item) => (
                    <TableRow key={item.code} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-0">
                      <TableCell className="text-xs font-mono font-medium py-3">{item.code}</TableCell>
                      <TableCell className="text-xs py-3">{item.name}</TableCell>
                      <TableCell className="text-xs text-center font-semibold py-3">{item.qty}</TableCell>
                      <TableCell className="text-xs text-right text-slate-500 px-6 py-3">{item.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Footer */}
            <div className="pt-6 text-center">
              <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-400 font-medium">
                — End of Material List for {projectId} —
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50/50 border-t flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="h-11 px-6">
            Cancel
          </Button>
          <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6 rounded-lg font-bold gap-2">
            <Check className="h-4 w-4" /> Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}