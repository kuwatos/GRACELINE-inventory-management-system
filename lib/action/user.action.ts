"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { createUser } from "@/src/entity/user/user.repository"; // Update this path to wherever your CRUD file is!
import { updateUser, deleteUser } from "@/src/entity/user/user.repository"; 
import { editUserSchema } from "@/lib/validations";
import { newUserSchema } from "@/lib/validations";
import * as z from "zod";

export async function createUserAction(values: z.infer<typeof newUserSchema>) {
  try {
    const validData = newUserSchema.parse(values);

    await createUser({
      username: validData.username,
      firstName: validData.firstName,
      lastName: validData.lastName,
      department: validData.department,
      passwordStr: validData.password, 
    });

    revalidatePath("/users"); 
    return { success: true };
    
  } catch (error: unknown) { 
    // 1. Tell TypeScript to treat this as an object with readable properties
    const err = error as Record<string, unknown>;
    
    // 2. Safely dig out the hidden Postgres 'cause' object
    const cause = err.cause as Record<string, unknown> | undefined;

    // 3. Check both the surface layer AND the hidden cause layer
    const isDuplicate = 
      err.code === '23505' || 
      cause?.code === '23505' || 
      String(err.message).includes('unique constraint') || 
      String(cause?.message).includes('unique constraint');

    if (isDuplicate) {
      return { success: false, error: "Try a different username." }; 
    }
    
    // 4. If it's something else, log it and show the generic system error
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- UPDATE USER ACTION ---
export async function updateUserAction(userId: number, values: z.infer<typeof editUserSchema>) {
  try {
    const validData = editUserSchema.parse(values);

    // Hand the updated data to the Robot Butler
    await updateUser({
      id: userId,
      firstName: validData.firstName,
      lastName: validData.lastName,
      username: validData.username,
      department: validData.department,
      password: validData.password, // If the UI toggle was off, this is safely 'undefined'
    });

    revalidatePath("/users"); 
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
      return { success: false, error: "Try a different username." }; 
    }
    
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- DELETE USER ACTION ---
export async function deleteUserAction(userId: number) {
  try {
    // Tell the Robot Butler to deactivate this user
    await deleteUser(userId);

    // Refresh the page so they disappear from the table instantly
    revalidatePath("/users");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Something went wrong" };
  }
}