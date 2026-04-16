import { changeOrderStatus, createOrder, updateOrder } from "./order.repository";
import { inputDeliveredItemQuantity, createOrderProducts, deleteOrderProducts, readOrderProducts, verifyDeliveryCompletion } from "../order_product/order_product.repository";
import { db } from "../../index";
import { ordersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function createOrderService(data: {
  supplierId: number;
  expectedDeliveryDate: Date;
  projectId: number;
  createdBy: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number; // to be changed because needed for addition and stuff
  }[];
}) {
  const order = await createOrder({
    orderStatus: "Draft",
    orderDate: null,
    supplierId: data.supplierId,
    expectedDeliveryDate: data.expectedDeliveryDate,
    actualDeliveryDate: null,
    projectId: data.projectId,
    createdBy: data.createdBy,
    approvedBy: null,
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
    unitPrice: number;
  }[];
}) {

  const orderId = data.orderId

  await updateOrder( {
    sessionUserId: data.sessionUserId,
    id: orderId,
    expectedDeliveryDate: data.expectedDeliveryDate,
    projectId: data.projectId,
})

  const deleted = deleteOrderProducts(orderId)
  
  if((await deleted).success)
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

export async function recieveOrder(data: {
  orderId: number,
  userId: string,
  items: {
    orderProductId: number;
    recievedQuantity: number;
  }[];

}) {
    return await db.transaction(async (tx) => {
      const results = await Promise.all(
            data.items.map(async (item) => {
              const result = await inputDeliveredItemQuantity({
                orderProductId: item.orderProductId,
                quantity: item.recievedQuantity,
                userId: data.userId,
              }, tx); // Ensuring 'tx' is passed here
              
              if (!result) throw new Error(`Failed to update item ${item.orderProductId}`);
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
        sessionUserId: data.userId,
        id: data.orderId,
        orderStatus: isOrderComplete ? "Complete" : "Incomplete"
      }, tx)
      
    return {success:true, message: "Items recieved successfully."};
  });
}