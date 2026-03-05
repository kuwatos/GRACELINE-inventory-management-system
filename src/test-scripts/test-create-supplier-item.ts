import { create } from "domain";
import { createOrderService } from "../entity/order/order.service";

async function testCreateItem() {
  try {
    const result = await createOrderService({
      orderStatus: "Testing",
      orderDate: new Date(),
      expectedDeliveryDate: new Date(),
      projectId: 1, // Make sure this project exists
      supplierId: 2, // Make sure this supplier exists
      createdBy: 1, // Make sure this user exists
      items: [
        { productId: 1, quantity: 2, unitPrice: "10.00" },
        { productId: 2, quantity: 2, unitPrice: "99.00" }, // Make sure this product exists
      ],
    });
    console.log("✅ Item created successfully:", result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testCreateItem();

//TO RUN:
// npx tsx src/test-scripts/test-create-supplier-item.ts
