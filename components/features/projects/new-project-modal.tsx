"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { projectFormSchema, ProjectFormValues } from "@/lib/validations"; 
import { createProjectAction } from "@/lib/action/project.action";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const form = useForm<ProjectFormValues>({ 
    resolver: zodResolver(projectFormSchema), 
    defaultValues: { projectName: "" } 
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const result = await createProjectAction(data);

      if (result?.success) {
        form.reset();
        onClose();
      } else {
        // You can use form.setError here if the action returns a specific field error
        console.error("Failed to create project:", result?.error);
        alert(result?.error || "Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
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

            <DialogFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-row justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isSubmitting}
                className="px-8 h-12 rounded-xl font-bold text-gray-500"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white px-10 h-12 rounded-xl font-bold hover:bg-zinc-800 shadow-lg shadow-black/10 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}