// CRUD lives here
import { db } from "../../index";
import { reportsTable } from "../../db/schema";
import { eq, count, ilike, or, and } from "drizzle-orm";

//CREATE
export async function createReport(data: {
  userId: number;
  reportType: string;
  //   dateCreated: Date; //removed because it defaults to now() in the schema, so it can be optional in the input
  dateStart: Date;
  dateEnd: Date;
}) {
  return db.insert(reportsTable).values(data).returning();
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
  return db
    .delete(reportsTable)
    .where(eq(reportsTable.reportId, id))
    .returning();
}
