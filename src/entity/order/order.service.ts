import { changeOrderStatus, createOrder, deleteOrder, updateOrder } from "./order.repository";
import { inputDeliveredItemQuantity, createOrderProducts, deleteOrderProducts, readOrderProducts, verifyDeliveryCompletion } from "../order_product/order_product.repository";
import { db } from "../../index";
import { ordersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { success } from "zod";

export async function createOrderService(data: {
  supplierId: number;
  expectedDeliveryDate: Date;
  projectId?: number | null;
  createdBy: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: string;
  }[],
  orderedValue : string
}) {
  const order = await createOrder({
    orderStatus: "Draft",
    supplierId: data.supplierId,
    expectedDeliveryDate: data.expectedDeliveryDate,
    actualDeliveryDate: null,
    projectId: data.projectId ?? null,
    createdBy: data.createdBy,
    approvedBy: null,
    orderedValue: data.orderedValue,
  });

  const orderId = order.orderId;

  await Promise.all(
    data.items.map(async (item) => {
      await createOrderProducts({
        orderId,
        productId: item.productId,
        expectedOrderProductQuantity: item.quantity,
      });
    }),
  );
}

export async function updateOrderService( data: {
  orderId : number, 
  sessionUserId: string;
  expectedDeliveryDate?: Date;
  projectId?: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: string;
  }[];
  orderedValue: string;
}) {

  const orderId = data.orderId

  await updateOrder( {
    sessionUserId: data.sessionUserId,
    id: orderId,
    expectedDeliveryDate: data.expectedDeliveryDate,
    projectId: data.projectId,
    orderedValue: data.orderedValue,
})

  const deleted =  await deleteOrderProducts(orderId)
  
  if(deleted.success)
  {
    await Promise.all(
    data.items.map(async (item) => {
      await createOrderProducts({
        orderId,
        productId: item.productId,
        expectedOrderProductQuantity: item.quantity,
      });
    }),
  );
  }
  
}

export async function deleteOrderService(orderId:number) {
  
  const deleted =  await deleteOrderProducts(orderId)

  if(deleted.success)
  {
    await deleteOrder(orderId)
  }
  return {success:true}
}


export async function recieveOrder(data: {
  orderId: number,
  userId: string,
  items: {
    productId: number;
    quantity: number;
  }[],
  receivedValue: string;

}) {
    return await db.transaction(async (tx) => {
      const results = await Promise.all(
            data.items.map(async (item) => {
              const result = await inputDeliveredItemQuantity({
                orderId: data.orderId,
                orderProductId: item.productId,
                quantity: item.quantity,
                userId: data.userId,
              }, tx); // Ensuring 'tx' is passed here
              
              if (!result) throw new Error(`Failed to update item ${item.productId}`);

              return result;
            }),
          );
      
      
      if(results.length !== data.items.length) throw new Error("Failed to add all delivered items, changes not saved.");

      // STATUS CHECKER
      const recievedProducts = await readOrderProducts( {
        id: data.orderId
      }, tx)

      // 1. Get the verification results for all products in the order
      const verificationResults = await Promise.all(
        recievedProducts.map((product) => 
          verifyDeliveryCompletion(product.expectedOrderProductQuantity, product.deliveredOrderProductQuantity)
        )
      );
      // 2. Check if EVERY item returned isFullyDelivered: true
      const isOrderComplete = verificationResults.every(result => result.isFullyDelivered === true);

      await changeOrderStatus({
        id: data.orderId,
        orderStatus: isOrderComplete ? "Complete" : "Incomplete",
        receivedValue: data.receivedValue
      }, tx)
      
    return {success:true, message: "Items recieved successfully."};
  });
}