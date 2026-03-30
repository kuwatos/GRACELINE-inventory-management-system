import "dotenv/config"; // 👈 Add this at line 1
import { 
  createSupplier,
} from "../entity/supplier/supplier.repository"; // Adjust path as needed

async function testOrderFlow() {
  console.log("📦 Starting Purchase Order Lifecycle Test...");
  let testOrderId: number | null = null;

  try {
    // --- STEP 1: CREATE ---
    console.log("\n1️⃣ Step: Creating new Purchase Order...");
    const newOrder = await  createSupplier
    ({
      supplierName: "Renz",
      supplierMobile: "09123456789", // Replace with actual supplier mobile number
      supplierLandline: "8888-8888", // These might be required by your schema!
      supplierEmail: "renz@example.com"
    });
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

// npx tsx src/test-scripts/test-create-supplier-item.ts