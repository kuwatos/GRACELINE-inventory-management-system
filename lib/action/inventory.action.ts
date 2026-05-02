"use server"; // This magic word tells Next.js to run this strictly on the backend!

import { revalidatePath } from "next/cache";
import { findExistingItem,restoreItem,updateItem, deleteItem } from "@/src/entity/item/item.repository";
import { createItemService } from "@/src/entity/item/item.service";
import { newItemSchema, editItemSchema } from "@/lib/validations";
import * as z from "zod";

export async function createItemAction(values: z.infer<typeof newItemSchema>) {
  try {
    const validData = newItemSchema.parse(values);
   
    const existingItem = await findExistingItem({
      productName: validData.productName, 
      category1: validData.category1, 
      category2: validData.category2, 
      category3: validData.category3, 
      category4: validData.category4, 
      category5: validData.category5,
      measurement: validData.measurement
    });
    
    if (existingItem && existingItem.length > 0) {
      if (!existingItem[0].archived) {
        return { success: false, error: "An item with this name, category, and measurement already exists." };
      }

      await restoreItem(existingItem[0].productId, {
        productName: validData.productName,
        productCategory1: validData.category1,
        productCategory2: validData.category2,
        productCategory3: validData.category3,
        productCategory4: validData.category4,
        productCategory5: validData.category5,
        productDesc: validData.productDesc,
        productQuantity: validData.productQuantity,
        reorderLevel: validData.reorderLevel,
        measurement: validData.measurement,
      });

      revalidatePath("/inventory"); 
      return { success: true , message: "Archived item restored successfully!" };
    }

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
      measurement: validData.measurement,
    });
  

    revalidatePath("/inventory"); 
    return { success: true };
    
  } catch (error: unknown) { 
    // 1. Tell TypeScript to treat this as an object with readable properties
    const err = error as Record<string, unknown>;
    
    // 2. Safely dig out the hidden Postgres 'cause' object
    const cause = err.cause as Record<string, unknown> | undefined;

    // 3. Check both the surface layer AND the hidden cause layer
    // const isDuplicate = 
    //   err.code === '23505' || 
    //   cause?.code === '23505' || 
    //   String(err.message).includes('unique constraint') || 
    //   String(cause?.message).includes('unique constraint');

    // if (isDuplicate) {
    //   return { success: false, error: "Try a different item name." }; 
    // }
    
    // 4. If it's something else, log it and show the generic system error
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- UPDATE SUPPLIER ACTION ---
export async function updateItemAction(itemId: number, values: z.infer<typeof editItemSchema>) {
  try {
    const validData = editItemSchema.parse(values);

    const existingItem = await findExistingItem({
      productName: validData.productName,
      category1: validData.category1,
      category2: validData.category2,
      category3: validData.category3,
      category4: validData.category4,
      category5: validData.category5,
      measurement: validData.measurement
    });

    // 2. If we found a match...
    if (existingItem && existingItem.length > 0) {
      const collision = existingItem[0];

      // 3. ...but the match is NOT the item we are currently editing
      if (collision.productId !== itemId) {
        if (!collision.archived) {
          return { success: false, error: "Update failed: This item name already exists in this category and measurement." };
        } else {
          // It's in the archive!
          return { success: false, error: "Update failed: This name is already reserved by an archived item. Please restore the archived item instead." };
        }
      }
    }
    
    // Hand the updated data to the Robot Butler
    await updateItem({
      id: itemId,
      productName: validData.productName,
      productCategory1: validData.category1,
      productCategory2: validData.category2,
      productCategory3: validData.category3,
      productCategory4: validData.category4,
      productCategory5: validData.category5,
      productDesc: validData.productDesc,
      productQuantity: validData.productQuantity,
      reorderLevel: validData.reorderLevel,
      remarks: validData.reason,
      measurement: validData.measurement,
      projectId: validData.projectId, // Pass projectId for logging
    });

    revalidatePath("/inventory"); 
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
      return { success: false, error: "Try a different item name." }; 
    }
    
    console.error("System crash:", error);
    return { success: false, error: "System error. Please try again later." };
  }
}

// --- DELETE USER ACTION ---
export async function deleteItemAction(itemId: number) {
  try {
    // Tell the Robot Butler to deactivate this user
    await deleteItem(itemId);

    // Refresh the page so they disappear from the table instantly
    revalidatePath("/inventory");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { success: false, error: "Something went wrong" };
  }
}