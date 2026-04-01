"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { projectFormSchema, ProjectFormValues } from "@/lib/validations"; // Adjust path if needed

export function NewProjectModal({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const form = useForm<ProjectFormValues>({ resolver: zodResolver(projectFormSchema), defaultValues: { name: "" } });
  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (data: ProjectFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    console.log("Saving to DB:", data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) form.reset(); onOpenChange(isOpen); }}>
      <DialogContent className="max-w-md bg-white p-6 rounded-xl">
        <DialogHeader><DialogTitle className="text-xl font-bold">Create New Project</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Project Name</label>
            <Input {...form.register("name")} placeholder="e.g., Warehouse Expansion" className="h-11 border-slate-200" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 px-6 h-10" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}