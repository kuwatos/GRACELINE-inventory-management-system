// import * as PasswordService from "../entity/password/password.repository";
// import * as UserService from "../entity/user/user.repository";


// async function runPasswordTest() {
//   console.log("🔐 Starting Password Update Test...\n");

//   // Force exit after 10 seconds to prevent hanging
//   setTimeout(() => {
//     console.error("⏱️ Test timeout exceeded. Force exiting...");
//     process.exit(1);
//   }, 100000);

//   try {
//     // 1. Create a temporary user to test against
//     console.log("Step 1: Creating a test user...");
//     const user = await UserService.createUser({
//       username: "pass_test_user",
//       userType: "Admin",
//     });

//     // 2. Update the password
//     console.log("Step 2: Updating password (Action ID 4)...");
//     const updateResult = await PasswordService.updatePassword({
//       userId: user.userId,
//       password: "new_secure_password_123",
//     });

//     await UserService.updateUser({
//       id: user.userId,
//       username: "updated_tech_user", // Change 1
//       userType: "Admin",             // Change 2
//     });

//     const result = await UserService.updateUser({
//       id: user.userId,
//       username: "updated_tech_user", // Same as current
//     });


//   } catch (error) {
//     console.error("❌ Test Failed:", error);
//   } finally {
//     process.exit();
//   }
// }

// runPasswordTest();

// //npx tsx src/test-scripts/test-create-supplier-item.ts

import { db } from "../index"; // Ensure this points to where your 'db' is initialized
import { sql } from "drizzle-orm";

async function ping() {
  console.log("🔗 Attempting to connect to Supabase...");
  console.log("URL:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":****@")); // Safe print

  try {
    // A simple query that doesn't depend on your tables
    const result = await db.execute(sql`SELECT now()`);
    console.log("✅ Connection Successful!");
  } catch (error: any) {
    console.error("❌ Connection Failed!");
    console.error("Error Code:", error.code);
    console.error("Message:", error.message);
    
    if (error.message.includes("Tenant or user not found")) {
      console.log("\n💡 TIP: Check your DATABASE_URL username. It must be 'postgres.ayzpefuyluhelbeakpjp'");
    }
    if (error.code === 'ENOTFOUND') {
      console.log("\n💡 TIP: Your computer cannot find the host. Try using the 'aws-0...' pooler address instead.");
    }
  } finally {
    process.exit();
  }
}

ping();