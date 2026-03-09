import { db } from "../../index";
import { logsTable, usersTable, actionsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function readLogsWithUser() {
  return await db
    .select({
      date: logsTable.logDate,
      username: usersTable.username,
      departmemt: usersTable.userType,
      actionPerformed: actionsTable.actionDesc,
      targetId: logsTable.targetId,
      previousValue: logsTable.prevValue,
      newValue: logsTable.newValue,
      remarks: logsTable.remarks,
    })
    .from(logsTable)
    .innerJoin(usersTable, eq(logsTable.userId, usersTable.userId))
    .innerJoin(actionsTable, eq(logsTable.actionId, actionsTable.actionId));
}
