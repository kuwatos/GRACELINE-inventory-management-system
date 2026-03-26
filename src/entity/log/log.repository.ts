// CRUD lives here
import { db } from "../../index";
import { logsTable } from "../../db/schema";
import { eq, ilike, or, and } from "drizzle-orm";

//CREATE
// logs.service.ts or similar
export async function createLog(
  data: {
    actionId: number;
    targetId: number;
    columnName: string;
    prevValue?: string | null;
    newValue?: string | null;
    remarks?: string | null;
  },
  tx?: any // Optional Transaction Client
) {
  // If 'tx' is provided, use it. Otherwise, use the standard 'db'.
  const client = tx || db; 
  return client.insert(logsTable).values(data);
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
