import { db } from "../../index";
import { logsTable, usersTable, actionsTable, projectsTable } from "../../db/schema";
import { desc, eq } from "drizzle-orm";

export async function readLogsWithUser() {
  return await db
    .select({
      id: logsTable.logId,
      timestamp: logsTable.logDate,
      user: usersTable.username,
      dept: usersTable.department,
      action: actionsTable.actionDesc,
      target: logsTable.targetId,
      prev: logsTable.prevValue,
      next: logsTable.newValue,
      remarks: logsTable.remarks,
      column: logsTable.columnName,
      project: projectsTable.projectName, 
    })
    .from(logsTable)
    .leftJoin(usersTable, eq(logsTable.userId, usersTable.id)) // 👈 Change to leftJoin
    .leftJoin(actionsTable, eq(logsTable.actionId, actionsTable.actionId))
    .leftJoin(projectsTable, eq(logsTable.projectId, projectsTable.projectId)) // 👈 Join with projectsTable for project info;
    .orderBy(desc(logsTable.logDate)); // 👈 newest first
}
