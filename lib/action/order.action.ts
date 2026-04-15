import { revalidatePath } from "next/cache";
import { createOrderService, updateOrderService } from "@/src/entity/order/order.service";
import { createOrder, deleteOrder, updateOrder } from "@/src/entity/order/order.repository";
import { editOrderSchema, newOrderSchema } from "../validations";
import * as z from "zod";
import { validateSessionUser } from "@/src/entity/user/user.repository";

export async function createOrderAction(values: z.infer<typeof newOrderSchema>) {
    try {

        const user = await validateSessionUser()
        const validData = newOrderSchema.parse(values);
       
        await createOrderService({
            supplierId: validData.supplierId,
            expectedDeliveryDate: validData.deliveryDate,
            projectId: validData.projectId,
            createdBy: user.id,
            items: validData.products,
        });
      
    
        revalidatePath("/orders"); 
        return { success: true };
        
      } catch (error: any) { 
        console.error("Order Creation Error:", error);
        return { success: false, error: "Failed to create order." };
      }
}

export async function updateOrderAction(orderId: number, values: z.infer<typeof editOrderSchema>) {
    try {

        const user = await validateSessionUser()
        const validData = editOrderSchema.parse(values);
       
        await updateOrderService({
            orderId: orderId,
            sessionUserId: user.id,
            expectedDeliveryDate: validData.deliveryDate,
            projectId: validData.projectId,
            items: validData.products,
        });
    
        revalidatePath("/orders"); 
        return { success: true };
        
      } catch (error: any) { 
        console.error("Order Update Error:", error);
        return { success: false, error: "Failed to update order." };
      }
}

export async function deleteOrderAction(orderId: number) {
    try {
        // Tell the Robot Butler to deactivate this user
        await deleteOrder(orderId);
    
        // Refresh the page so they disappear from the table instantly
        revalidatePath("/orders");
        
        return { success: true };
      } catch (error) {
        console.error("Order Deletion Error:", error);
        return { success: false, error: "Failed to delete order" };
      }
}