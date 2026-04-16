// CRUD lives here
import { db } from "../../index";
import { reportsTable } from "../../db/schema";
import { eq, count, ilike, or, and } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { createUserNotificationService } from "../user_notifications/user_notifications.service";
import { validateSessionUser } from "../user/user.repository";

//CREATE
export async function createReport(data: {
  userId: string;
  reportType: string; 
  dateStart: Date;
  dateEnd: Date;
}) {
  return await db.transaction(async (tx) => {
      // Insert the new supplier
          const user = await validateSessionUser()
      const [newReport] = await tx.insert(reportsTable).values(data).returning();
  
      if (newReport) {
        // Loop through every field in the newly created supplier
        for (const [key, val] of Object.entries(newReport)) {
          // Log every column that has a value
          if (val !== null && val !== undefined) {
            await createLog({
              userId: user.id,
              actionId: 20,                  
              targetId: newReport.reportId,
              columnName: key,               
              prevValue: null,
              newValue: val instanceof Date ? val.toISOString() : val.toString(),
              remarks: null
            }, tx);
          }
        }
        await createUserNotificationService({ notifId: 7, targetId: newReport.reportId }, tx);
      }
  
      return newReport;
    });
}

//READ
export async function readReport() {
  return db.select().from(reportsTable);
}

//SEARCH
export async function searchReports(filters: {
  keyword?: string;
  category?: string;
}) {
  // Create a list of conditions
  const conditions = [];

  // Add keyword if it exists
  if (filters.keyword) {
    conditions.push(
      or(
        ilike(reportsTable.dateStart, `%${filters.keyword}%`),
        ilike(reportsTable.dateEnd, `%${filters.keyword}%`),
        ilike(reportsTable.userId, `%${filters.keyword}%`),
      ),
    );
  }

  // Add condition
  if (filters.category) {
    conditions.push(eq(reportsTable.reportType, filters.category));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(reportsTable)
    .where(and(...conditions));
}

//DELETE
export async function deleteReport(id: number) {
  await db
    .delete(reportsTable)
    .where(eq(reportsTable.reportId, id))
    .returning();
  return { success: true };
}
