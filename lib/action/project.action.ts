"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { createProject,updateProject, deleteProject } from "@/src/entity/projects/projects.repository"; // Update this path to wherever your CRUD file is!
import { editSupplierSchema, projectFormSchema } from "@/lib/validations";
import * as z from "zod";
import { updateSupplier } from "@/src/entity/supplier/supplier.repository";

export async function createProjectAction(values: z.infer<typeof projectFormSchema>) {
  try {
    const validData = projectFormSchema.parse(values);

    await createProject({
      projectName: validData.projectName,
    });

    revalidatePath("/projects");
    return { success: true };

  } catch (error: unknown) {
    const err = error as Record<string, unknown>;

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