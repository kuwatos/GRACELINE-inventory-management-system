// CRUD lives here
import { db } from "../../index";
import { passwordsTable } from "../../db/schema";
import { eq, ilike, and } from "drizzle-orm";

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
  const { userId, ...fields } = data;

  return db
    .update(passwordsTable)
    .set(fields)
    .where(eq(passwordsTable.userId, data.userId));
}
