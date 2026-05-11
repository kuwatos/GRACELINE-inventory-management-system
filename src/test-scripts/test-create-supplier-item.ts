import "dotenv/config"; 
import { 
  createSupplier,
} from "../entity/supplier/supplier.repository"; 
import { createItem } from "../entity/item/item.repository";

async function testOrderFlow() {
  console.log("📦 Starting Purchase Order Lifecycle Test...");
  
  try {
    // --- STEP 1: CREATE ---
    console.log("\n1️⃣ Step: Creating new Purchase Order...");
    
    const newOrder = await createItem({
      productName: "Test Product",
      productCategory1: "Test Category",
      productDesc: "This is a test product",
      measurement: "Unit", // ✨ Added this to fix the Type Error
    });

    console.log("✅ Created Item:", newOrder);
    return newOrder;

  } catch (error) {
    console.error("\n❌ TEST FAILED!");
    console.error("Error details:", error instanceof Error ? error.message : error);
  } finally {
    console.log("\n🏁 Order Test Sequence Complete.");
    process.exit();
  }
}

testOrderFlow();

// Run with: npx tsx src/test-scripts/test-create-supplier-item.ts
