import { createItemService } from "../entity/item/item.service";

async function testCreateItem() {
  try {
    const result = await createItemService({
      productName: "Hellooo",
      productCategory1: "Screw",
      productCategory2: "Gadgets",
      supplierId: 2, // Make sure this supplier exists
      unitPrice: "29.99",
    });
    console.log("✅ Item created successfully:", result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testCreateItem();

//TO RUN:
// npx tsx src/test-scripts/test-create-supplier-item.ts
