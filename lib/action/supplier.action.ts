"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { restoreSupplier,createSupplier,findExistingSupplier, updateSupplier,deleteSupplier } from "@/src/entity/supplier/supplier.repository"; // Update this path to wherever your CRUD file is!
import { editSupplierSchema } from "@/lib/validations";
import { newSupplierSchema } from "@/lib/validations";
import * as z from "zod";

export async function createSupplierAction(values: z.infer<typeof newSupplierSchema>) {
  try {
    const validData = newSupplierSchema.parse(values);

    const existingSupplier = await findExistingSupplier(validData.name);
    
    if (existingSupplier && existingSupplier.length > 0) {
      if (existingSupplier[0].active) {
        return { success: false, error: "A supplier with this name already exists." };
      }
      // If the supplier exists but is inactive, restore it instead of creating a new one
      await restoreSupplier(existingSupplier[0].supplierId, {
        supplierName: validData.name,
        supplierLandline: validData.supplierLandline,
        supplierEmail: validData.supplierEmail,
        supplierMobile: validData.supplierMobile
      });

      revalidatePath("/suppliers");
      return { success: true,message: "Archived supplier restored successfully!" };
    }

    // If no existing supplier, create a new one
    await createSupplier({
      supplierName: validData.name,
      supplierLandline: validData.supplierLandline,
      supplierEmail: validData.supplierEmail,
      supplierMobile: validData.supplierMobile,
    });

    revalidatePath("/suppliers"); 
    return { success: true };
    
  } catch (error: unknown) { 
    // 1. Tell TypeScript to treat this as an object with readable properties
    const err = error as Record<string, unknown>;
    
    // 2. Safely dig out the hidden Postgres 'cause' object
    const cause = err.cause as Record<string, unknown> | undefined;
``
    // 3. Check both the surface layer AND the hidden cause layer
    const isDuplicate = 
      err.code === '23505' || 
      cause?.code === '23505' || 
      String(err.message).includes('unique constraint') || 
      String(cause?.message).includes('unique constraint');

    if (isDuplicate) {
      return { success: false, error: "Try a different supplier name." }; 
    }
    
    // 4. If it's something else, log it and show the generic system error
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- UPDATE SUPPLIER ACTION ---
export async function updateSupplierAction(supplierId: number, values: z.infer<typeof editSupplierSchema>) {
  try {
    const validData = editSupplierSchema.parse(values);

    // Hand the updated data to the Robot Butler
    await updateSupplier({
        id:supplierId ,
      supplierName: validData.name,
      supplierLandline: validData.supplierLandline,
      supplierEmail: validData.supplierEmail,
      supplierMobile: validData.supplierMobile,
    });

    revalidatePath("/suppliers"); 
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
      return { success: false, error: "Try a different supplier name." }; 
    }
    
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- DELETE USER ACTION ---
export async function deleteSupplierAction(supplierId: number) {
  try {
    // Tell the Robot Butler to deactivate this user
    await deleteSupplier(supplierId);

    // Refresh the page so they disappear from the table instantly
    revalidatePath("/suppliers");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete supplier:", error);
    return { success: false, error: "Something went wrong" };
  }
}