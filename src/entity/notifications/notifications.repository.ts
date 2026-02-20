// CRUD lives here
import { db } from "../../index";
import { notificationsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

//READ
export async function readNotifications() {
  return db.select().from(notificationsTable);
}

//NOTE: Create, Update, and Delete functions not needed for notifications,
//as they are created by the developers and not needed to be updated or deleted by the users.
