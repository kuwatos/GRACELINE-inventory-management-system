"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ViewProjectModal({ projectId, onOpenChange }: { projectId: string | null; onOpenChange: (open: boolean) => void; }) {
  if (!projectId) return null;

  return (
    <Dialog open={!!projectId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-xl shadow-2xl">
        <DialogHeader className="text-center pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900">Project Details</DialogTitle>
          <p className="text-xs text-slate-400 font-mono mt-1">ID: {projectId}</p>
        </DialogHeader>
        
        <div className="py-8 text-center space-y-2">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Project Name</p>
          <p className="text-lg font-bold text-slate-900">Warehouse Expansion</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={() => onOpenChange(false)} className="bg-slate-900 hover:bg-slate-800 text-white h-10 px-6 gap-2">
            <Check className="h-4 w-4" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}