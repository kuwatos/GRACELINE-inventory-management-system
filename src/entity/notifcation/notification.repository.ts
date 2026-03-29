// CRUD lives here
import { db } from "../../index";
import { notificationDepartmentsTable, notificationsTable, usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

//READ
export async function getUsersUnderDepartmentUsingNotifId(
  data: { notificationId: number },
  tx?: any 
) {
  const client = tx || db; // 👈 CRITICAL: This picks the right "channel"
  return client
    .select({ id: usersTable.userId })
    .from(usersTable)
    .innerJoin(
      notificationDepartmentsTable,
      eq(usersTable.userType, notificationDepartmentsTable.department),
    )
    .where(eq(notificationDepartmentsTable.notifId, data.notificationId));
}
