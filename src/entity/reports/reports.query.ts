import { db } from "../../index";
import { reportsTable, usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readReportHistory() {
  return await db
    .select({
      reportId: reportsTable.reportId,
      reportType: reportsTable.reportType,
      dateCreated: reportsTable.dateCreated,
      username: usersTable.username, // Joined from User table
      dateStart: reportsTable.dateStart,
      dateEnd: reportsTable.dateEnd,
    })
    .from(reportsTable)
    .innerJoin(usersTable, eq(reportsTable.userId, usersTable.id));
}
