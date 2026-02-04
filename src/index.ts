import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";
import { actionsTable } from "./db/schema";
import { logsTable } from "./db/schema";
import { suppliersTable } from "./db/schema";
import { inventoryTable } from "./db/schema";
import { itemsTable } from "./db/schema";
import { ordersTable } from "./db/schema";
import { orderProductsTable } from "./db/schema";
import { notificationsTable } from "./db/schema";
import { notificationsListTable } from "./db/schema";
import { reportsTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // 1. Setup the data to insert
  const newUser: typeof usersTable.$inferInsert = {
    userType: "Admin",
    username: "Renzo",
    password: "Pogi123",
  };

  // 2. INSERT
  await db.insert(usersTable).values(newUser);
  console.log("New user created!");

  // 3. SELECT - This returns an ARRAY of objects
  const allUsers = await db.select().from(usersTable);
  console.log("Getting all users:", allUsers);

  // 4. UPDATE - Use the TABLE (usersTable)
  await db
    .update(usersTable)
    .set({
      username: "RenzoUpdated",
    })
    .where(eq(usersTable.userType, "Admin"));
  console.log("User info updated!");

  // 5. DELETE - Use the TABLE (usersTable)
  // await db.delete(usersTable).where(eq(usersTable.username, "RenzoUpdated"));
  // console.log("User deleted!");
}

main();
