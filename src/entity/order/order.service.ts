import { createOrder } from "./order.repository";
import { createOrderProducts } from "../order_product/order_product.repository";

export async function createOrderService(data: {
  orderStatus: string;
  orderDate: Date;
  supplierId: number;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  projectId: number;
  createdBy: string;
  approvedBy?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: string;
  }[];
}) {
  const order = await createOrder({
    orderStatus: data.orderStatus,
    orderDate: data.orderDate,
    supplierId: data.supplierId,
    expectedDeliveryDate: data.expectedDeliveryDate,
    actualDeliveryDate: data.actualDeliveryDate,
    projectId: data.projectId,
    createdBy: data.createdBy,
    approvedBy: data.approvedBy,
  });

  const orderId = order.orderId;

  await Promise.all(
    data.items.map(async (item) => {
      await createOrderProducts({
        orderId,
        productId: item.productId,
        orderProductQuantity: item.quantity,
      });
    }),
  );
}
