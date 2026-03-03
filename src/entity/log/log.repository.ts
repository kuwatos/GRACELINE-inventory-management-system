// CRUD lives here
import { db } from "../../index";
import { logsTable } from "../../db/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { User } from "next-auth";

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) throw new Error("Unauthorized");

//CREATE
export async function createLog(data: {
  // userId: number;
  actionId: number;
  targetId: number;
  prevValue?: string;
  newValue: string;
  remarks?: string;
}) {
  return db.insert(logsTable).values(data).returning();
}

//READ
export async function readLogs() {
  return db.select().from(logsTable);
}

//SEARCH
export async function searchLogs(filters: {
  keyword?: string;
  category?: string;
}) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
  if (filters.keyword) {
    conditions.push(
      or(
        ilike(logsTable.targetId, `%${filters.keyword}%`),
        ilike(logsTable.remarks, `%${filters.keyword}%`),
      ),
    );
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(logsTable)
    .where(and(...conditions));
}

//DELETE
export async function deleteLog(id: number) {
  return db.delete(logsTable).where(eq(logsTable.logId, id)).returning();
}
