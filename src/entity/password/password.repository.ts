// CRUD lives here
import { db } from "../../index";
import { passwordsTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { createLog } from "../log/log.repository";

//CREATE
export async function createPassword(data: {
  userId: number;
  password: string;
}) {
  return db.insert(passwordsTable).values(data).returning();
}

//UPDATE
export async function updatePassword(data: {
  userId: number;
  password: string;
}) {
  const { userId, password } = data;

  return await db.transaction(async (tx) => {
    // Perform the update within the transaction
    const result = await tx
      .update(passwordsTable)
      .set({ password })
      .where(eq(passwordsTable.userId, userId))
      .returning();

    if (result && result.length > 0) {
      // Log the change using the transaction client 'tx'
      await createLog({
        actionId: 4, // Changed User Password
        targetId: userId,
      }, tx);
    }

    return result;
  });
}
