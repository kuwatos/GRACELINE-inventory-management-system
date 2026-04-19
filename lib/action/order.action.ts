"use server";

import { revalidatePath } from "next/cache";
import { createOrderService, deleteOrderService, recieveOrder, updateOrderService } from "@/src/entity/order/order.service";
import { approveOrder, changeOrderStatus } from "@/src/entity/order/order.repository";
import { editOrderSchema, newOrderSchema, receiveOrderSchema } from "../validations";
import * as z from "zod";
import { validateSessionUser } from "@/src/entity/user/user.repository";

import { OrderRecord } from "@/components/features/orders/order-history-table";
import { readPurchaseOrderHistory } from "@/src/entity/order/order.query";
import { readOrderProducts } from "@/src/entity/order_product/order_product.query";
import { readSuppliersAndIdHavingProducts } from "@/src/entity/supplier/supplier.query";
import { readSupplierProducts } from "@/src/entity/supplier_item/supplier_item.query";
import { readProjecstNameAndId } from "@/src/entity/projects/projects.repository";

export async function createOrderAction(values: z.infer<typeof newOrderSchema>) {
    try {
        console.log("creating.....")
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

         // Catch the Postgres unique constraint violation specifically
        if (error?.cause?.code === "23505" || error?.code === "23505") {
          return { success: false, error: "Duplicate product detected. Each product can only appear once per order." };
        }

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

         if (error?.cause?.code === "23505" || error?.code === "23505") {
          return { success: false, error: "Duplicate product detected. Each product can only appear once per order." };
        }

        return { success: false, error: "Failed to update order." };
      }
}

export async function receiveOrderAction(orderId :number, values: z.infer<typeof receiveOrderSchema>) {
  try {
    const user = await validateSessionUser()
    const validData = receiveOrderSchema.parse(values);

    await recieveOrder({
            orderId: orderId,
            userId: user.id,
            items: validData.products,
        });
    
        revalidatePath("/orders"); 
        return { success: true };
        
      } catch (error: any) { 
        console.error("Order Receive Error:", error);
        return { success: false, error: "Failed to recieve order." };
      }
}



export async function approveOrderAction(orderId: number) {
    try {
        // Tell the Robot Butler to approve this user
        await approveOrder({id: orderId});
    
        // Refresh the page so they disappear from the table instantly
        revalidatePath("/orders");
        
        return { success: true };
      } catch (error) {
        console.error("Order Aprrove Error:", error);
        return { success: false, error: "Failed to approve order" };
      }
}


export async function changeOrderStatusAction(orderId: number, orderStatus: string) {
    try {
        // Tell the Robot Butler to deactivate this user
        await changeOrderStatus({id: orderId, orderStatus: orderStatus});
    
        // Refresh the page so they disappear from the table instantly
        revalidatePath("/orders");
        
        return { success: true };
      } catch (error) {
        console.error("Order Status Change Error:", error);
        return { success: false, error: "Failed to change order status" };
      }
}


export async function deleteOrderAction(orderId: number) {
    try {
        // Tell the Robot Butler to deactivate this order
        await deleteOrderService(orderId);
    
        // Refresh the page so they disappear from the table instantly
        revalidatePath("/orders");
        
        return { success: true };
      } catch (error) {
        console.error("Order Deletion Error:", error);
        return { success: false, error: "Failed to delete order" };
      }
}


export async function getOrdersAction(): Promise<OrderRecord[]> {
  try {
    const orders = await readPurchaseOrderHistory();

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const products = await readOrderProducts({ id: order.poId });

        return {
          id: String(order.poId),
          poId: order.poId,
          supplierId: order.supplierId,
          projectId: order.projectId ?? undefined,
          projectName: order.projectName ?? undefined,   // ADD
          supplierName: order.supplierName,
          dateCreated: order.dateCreated
            ? new Date(order.dateCreated).toLocaleDateString()
            : "—",
          expectedDelivery: order.expectedDelivery
            ? new Date(order.expectedDelivery).toLocaleDateString()
            : "—",
          dateReceived: order.actualDelivery
            ? new Date(order.actualDelivery).toLocaleDateString()
            : undefined,
          status: order.status as OrderRecord["status"],
          products: products.map((p) => ({
            orderProductId: p.orderProductId,
            productId: p.productId!,
            productName: p.productName,
            expectedQty: p.expectedQty,
            unitPrice: p.unitPrice ? parseFloat(p.unitPrice) : 0,
            receivedQty: p.receivedQty ?? undefined,
          })),
        };
      })
    );

    return ordersWithProducts;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export type SupplierOption = { supplierId: number; supplierName: string };
export type SupplierProduct = {
  supplierId: number;
  productId: number;
  productName: string;
  unitPrice: string;
};

export async function getSuppliersAction(): Promise<SupplierOption[]> {
  try {
    return await readSuppliersAndIdHavingProducts();
  } catch {
    return [];
  }
}

export async function getSupplierProductsAction(): Promise<SupplierProduct[]> {
  try {
    const rows = await readSupplierProducts();
    return rows.map((r) => ({
      supplierId: r.supplierId!,
      productId: r.productId!,
      productName: r.productName,
      unitPrice: r.unitPrice ?? "0.00",
    }));
  } catch {
    return [];
  }
}


export type ProjectOption = { projectId: number; projectName: string };

export async function getProjectsAction(): Promise<ProjectOption[]> {
  try {
    return await readProjecstNameAndId();
  } catch {
    return [];
  }
}