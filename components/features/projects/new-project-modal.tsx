"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { projectFormSchema, ProjectFormValues } from "@/lib/validations"; 
import { createProjectAction } from "@/lib/action/project.action";
import { executeAction } from "@/lib/error.handler";
import { LoadingOverlay } from "@/components/ui/loading-overlay";


interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProjectFormValues>({ 
    resolver: zodResolver(projectFormSchema), 
    defaultValues: { projectName: "" } 
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true);
    await executeAction(async () => {
    
    // If THIS line fails (Zod Error), it stops and goes to the wrapper's catch.
    const validatedData = projectFormSchema.parse(data);

    const res = await createProjectAction(validatedData);

    // If THIS line runs, we manually trigger the wrapper's catch by throwing the result.
    if (!res.success) {
      throw res; 
    }
    form.reset();
    onClose();
    return res;
  }, "Project added successfully!");

  setIsSubmitting(false);
};

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl bg-white">
        <DialogHeader className="px-8 py-8 border-b border-slate-100 flex justify-center items-center bg-slate-50/50">
          <DialogTitle className="text-xl font-bold text-gray-900">Create New Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-8 space-y-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 ml-1">Project Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., Warehouse Expansion" 
                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-black/5" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="px-10 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <LoadingOverlay isLoading={isSubmitting} message="Creating Project..." />
      </DialogContent>
    </Dialog>
  );
}