import { 
  approveOrder,
} from "../entity/order/order.repository"; // Adjust path as needed

async function testOrderFlow() {
  console.log("📦 Starting Purchase Order Lifecycle Test...");
  let testOrderId: number | null = null;

  try {
    // --- STEP 1: CREATE ---
    console.log("\n1️⃣ Step: Creating new Purchase Order...");
    const newOrder = await  approveOrder
({
      id: 3000001, // Replace with actual order ID to approve
      approvedBy: 1 // Replace with actual user ID who approves
    });
    

  } catch (error) {
    console.error("\n❌ TEST FAILED!");
    console.error("Error details:", error instanceof Error ? error.message : error);
  } finally {
    console.log("\n🏁 Order Test Sequence Complete.");
    process.exit();
  }
}

testOrderFlow();