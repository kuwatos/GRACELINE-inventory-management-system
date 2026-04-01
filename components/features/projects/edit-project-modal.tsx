"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectFormSchema, ProjectFormValues } from "@/lib/validations"; // Adjust path if needed

export function EditProjectModal({ projectId, onOpenChange }: { projectId: string | null, onOpenChange: (o: boolean) => void }) {
  const [isFetching, setIsFetching] = useState(false);
  const form = useForm<ProjectFormValues>({ resolver: zodResolver(projectFormSchema), defaultValues: { name: "" } });
  const { isSubmitting, errors } = form.formState;

  useEffect(() => {
    if (projectId) {
      setTimeout(() => { setIsFetching(true); form.reset({ name: "Warehouse Expansion" }); setIsFetching(false); }, 500);
    } else {
      form.reset();
    }
  }, [projectId, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    console.log("Updating DB:", { id: projectId, ...data });
    onOpenChange(false);
  };

  return (
    <Dialog open={!!projectId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-6 rounded-xl border-none shadow-2xl">
        <DialogHeader><DialogTitle className="text-xl font-bold">Edit Project</DialogTitle></DialogHeader>
        {isFetching ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Name</label>
              <Input {...form.register("name")} className="h-11 border-slate-200 bg-white" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="bg-zinc-900 text-white h-10 px-6" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}