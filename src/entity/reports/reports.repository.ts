// CRUD lives here
import { db } from "../../index";
import { reportsTable } from "../../db/schema";
import { eq, count } from "drizzle-orm";

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

//DELETE
export async function deleteReport(id: number) {
  return db
    .delete(reportsTable)
    .where(eq(reportsTable.reportId, id))
    .returning();
}
