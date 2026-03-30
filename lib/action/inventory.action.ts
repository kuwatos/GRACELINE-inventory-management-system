"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { updateItem, deleteItem } from "@/src/entity/item/item.repository";
import { createItemService } from "@/src/entity/item/item.service";
import { editItemSchema, newSupplierSchema } from "@/lib/validations";
import { newItemSchema } from "@/lib/validations";
import * as z from "zod";

export async function createItemAction(values: z.infer<typeof newItemSchema>) {
  try {
    const validData = newItemSchema.parse(values);
   
    await createItemService({
      productName: validData.productName,
      productCategory1: validData.category1,
      productCategory2: validData.category2,
      productCategory3: validData.category3,
      productCategory4: validData.category4,
      productCategory5: validData.category5,
      productDesc: validData.productDesc,
      productQuantity: validData.productQuantity,
      reorderLevel: validData.reorderLevel,
      supplierId: validData.supplierId,
      unitPrice: validData.unitPrice,
    });
  

    revalidatePath("/inventory"); 
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
      return { success: false, error: "Try a different item name." }; 
    }
    
    // 4. If it's something else, log it and show the generic system error
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- UPDATE SUPPLIER ACTION ---
export async function updateSupplierAction(supplierId: number, values: z.infer<typeof editItemSchema>) {
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