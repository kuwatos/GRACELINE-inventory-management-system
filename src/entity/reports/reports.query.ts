import { db } from "../../index";
import { reportsTable, usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readReportHistory() {
  return await db
    .select({
      reportId: reportsTable.reportId,
      reportType: reportsTable.reportType,
      dateGenerated: reportsTable.dateCreated,
      generatedBy: usersTable.username, // Joined from User table
      startDate: reportsTable.dateStart,
      endDate: reportsTable.dateEnd,
    })
    .from(reportsTable)
    .leftJoin(usersTable, eq(reportsTable.userId, usersTable.id));
}
