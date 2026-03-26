import { 
  createReport
} from "../entity/reports/reports.repository"; // Adjust path as needed

async function testOrderFlow() {
  console.log("📦 Starting Purchase Order Lifecycle Test...");
  let testOrderId: number | null = null;

  try {
    // --- STEP 1: CREATE ---
    console.log("\n1️⃣ Step: Creating new Purchase Order...");
    const newOrder = await   createReport
({
      userId: 3,        // Your admin user ID
      reportType: "Month-end",
      dateStart: new Date(),
      dateEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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