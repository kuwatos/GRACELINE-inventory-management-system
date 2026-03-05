// CRUD lives here
import { db } from "../../index";
import { notificationsTable, usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

//READ
export async function getUsersUnderDepartmentUsingNotifId(data: {
  notificationId: number;
}) {
  return db
    .select({ id: usersTable.userId })
    .from(usersTable)
    .innerJoin(
      notificationsTable,
      eq(usersTable.userType, notificationsTable.department),
    )
    .where(eq(notificationsTable.notifId, data.notificationId));
}
