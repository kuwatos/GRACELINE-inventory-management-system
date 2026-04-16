"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { restoreSupplierItem, createSupplierItem, findSupplierItemLink, updateSupplierItem,deleteSupplierItem } from "@/src/entity/supplier_item/supplier_item.repository"; // Update this path to wherever your CRUD file is!
import { newSupplierItemSchema } from "@/lib/validations";
import { editSupplierItemSchema } from "@/lib/validations";
import * as z from "zod";

export async function createSupplierItemAction(values: z.infer<typeof newSupplierItemSchema>) {
  try {
    const validData = newSupplierItemSchema.parse(values);

    const existing = await findSupplierItemLink(values.supplierId, values.productId);
    
    if (existing && existing.length > 0) {
      if (!existing[0].archived) {
        return { success: false, error: "This supplier-product link already exists." };
      }
      await restoreSupplierItem({
        id: existing[0].supplierItemId,
        supplierId: validData.supplierId,
        unitPrice: validData.unitPrice
      });

      revalidatePath("/supplier-items");
      return { success: true, message: "Archived supplier-item link restored successfully!" };
    }

    await createSupplierItem({
      supplierId: validData.supplierId,
      productId: validData.productId,
      unitPrice: validData.unitPrice,
    });

    revalidatePath("/supplier-items"); 
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
      return { success: false, error: "This supplier-product link already exists." }; 
    }
    
    // 4. If it's something else, log it and show the generic system error
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- UPDATE SUPPLIER ACTION ---
export async function updateSupplierItemAction(supplierItemId: number, values: z.infer<typeof editSupplierItemSchema>) {
  try {
    const validData = editSupplierItemSchema.parse(values);
    const existing = await findSupplierItemLink(validData.supplierId, validData.productId);

    if (existing && existing[0].supplierItemId !== supplierItemId) {
      if (!existing[0].archived) {
        return { success: false, error: "Update failed: This supplier-product link already exists." };
      } else {
        return { success: false, error: "Update failed: This link is archived. Please restore the archived link instead." };
      }
    }
    // Hand the updated data to the Robot Butler
    await updateSupplierItem({
      id:supplierItemId ,
      supplierId: validData.supplierId,
      unitPrice: validData.unitPrice,
    });

    revalidatePath("/supplier-items"); 
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
export async function deleteSupplierItemAction(supplierItemId: number) {
  try {
    // Tell the Robot Butler to deactivate this user
    await deleteSupplierItem(supplierItemId);

    // Refresh the page so they disappear from the table instantly
    revalidatePath("/supplier-items");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete supplier item:", error);
    return { success: false, error: "Something went wrong" };
  }
}