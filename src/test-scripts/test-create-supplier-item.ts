import { create } from "domain";
import { createUserNotificationService } from "../entity/user_notifications/user_notifications.service";

async function testCreateItem() {
  try {
    const result = await createUserNotificationService({
      notifId: 1,
    });
    console.log("✅ Item created successfully:", result);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testCreateItem();

//TO RUN:
// npx tsx src/test-scripts/test-create-supplier-item.ts
