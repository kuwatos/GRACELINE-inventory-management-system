"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { restoreProject, findExistingProject, createProject,updateProject, deleteProject } from "@/src/entity/projects/projects.repository"; // Update this path to wherever your CRUD file is!
import { editSupplierSchema, projectFormSchema } from "@/lib/validations";
import * as z from "zod";
import { updateSupplier } from "@/src/entity/supplier/supplier.repository";

export async function createProjectAction(values: z.infer<typeof projectFormSchema>) {
  try {
    const validData = projectFormSchema.parse(values);

    const existingProject = await findExistingProject(validData.projectName);
    
    if (existingProject && existingProject.length > 0) {
      if (!existingProject[0].archived) {
        return { success: false, error: "Project already exists." };
      }

      await restoreProject(existingProject[0].projectId, {
        projectName: validData.projectName,
      });

      revalidatePath("/projects");
      return { success: true,message: "Archived project restored successfully!" };
    }
        
    await createProject({
      projectName: validData.projectName,
    });

    revalidatePath("/projects");
    return { success: true };

  } catch (error: unknown) {
    const err = error as Record<string, unknown>;
    const cause = err.cause as Record<string, unknown> | undefined;

    // Check if they tried to change the username to a duplicate
    const isDuplicate = 
      err.code === '23505' || 
      cause?.code === '23505' || 
      String(err.message).includes('unique constraint') || 
      String(cause?.message).includes('unique constraint');

    if (isDuplicate) {
      return { success: false, error: "Try a different project name." }; 
    }
    
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}


// --- UPDATE PROJECT ACTION ---
export async function updateProjectAction(projectId: number, values: z.infer<typeof projectFormSchema>) {
  try {
    const validData = projectFormSchema.parse(values);

    // Hand the updated data to the Robot Butler
    await updateProject(projectId, validData.projectName);

    revalidatePath("/projects"); 
    return { success: true };
    
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      const cause = err.cause as Record<string, unknown> | undefined;

      // Check if they tried to change the username to a duplicate
      const isDuplicate = 
        err.code === '23505' || 
        cause?.code === '23505' || 
        String(err.message).includes('unique constraint') || 
        String(cause?.message).includes('unique constraint');

      if (isDuplicate) {
        return { success: false, error: "Try a different project name." }; 
      }
      
      console.error("System crash:", error);
      return { success: false, error: "System error. Please try again later." };
  }
}

// --- DELETE PROJECT ACTION ---
export async function deleteProjectAction(projectId: number) {
  try {
    // Tell the Robot Butler to deactivate this project
    await deleteProject(projectId);

    // Refresh the page so it disappears from the table instantly
    revalidatePath("/projects");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Something went wrong" };
  }
}