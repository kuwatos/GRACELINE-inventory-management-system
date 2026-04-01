"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projectFormSchema, ProjectFormValues } from "@/lib/validations";
import { updateProjectAction } from "@/lib/action/project.action";
import { Project } from "./project-table";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  isViewOnly?: boolean;
}

export function EditProjectModal({ isOpen, onClose, project, isViewOnly = false }: EditProjectModalProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { projectName: "" },
  });

  const { isSubmitting, errors } = form.formState;

  // Pattern: Similar to Supplier, reset form when project is loaded
  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        projectName: project.projectName,
      });
    }
  }, [isOpen, project, form]);

  async function onSubmit(values: ProjectFormValues) {
    if (!project) return;
    try {
      const result = await updateProjectAction(project.projectId, values);
      if (result?.success) {
        onClose();
      } else {
        alert(result?.error || "Failed to update project.");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  }

  const handleFormSubmit = isViewOnly ? (e: React.FormEvent) => e.preventDefault() : form.handleSubmit(onSubmit);
  const title = isViewOnly ? `View Project: ${project?.projectId}` : `Edit Project: ${project?.projectId}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-slate-100 flex justify-center items-center">
          <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit}>
            <div className="p-8 space-y-6">
              <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700 ml-1">Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isViewOnly} 
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-black/5 disabled:bg-slate-50 disabled:text-slate-900" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="px-8 h-12 rounded-xl font-bold text-gray-500">
                {isViewOnly ? "Close" : "Cancel"}
              </Button>
              {!isViewOnly && (
                <Button type="submit" className="bg-black text-white px-10 h-12 rounded-xl font-bold hover:bg-zinc-800" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}