import { db } from "../../index";
import { notificationsTable, userNotificationsTable } from "../../db/schema";
import { eq, and,desc } from "drizzle-orm";
import { validateSessionUser } from "../user/user.repository";

export async function readUserNotifications() {
  const user = await validateSessionUser();
  return await db
    .select({
      userNotifId: userNotificationsTable.userNotifId,
      description: notificationsTable.description,
      additionalDescription: userNotificationsTable.additionalDescription,
      createdAt: userNotificationsTable.createdAt,
      targetId: userNotificationsTable.targetId,
    })
    .from(userNotificationsTable)
    .innerJoin(
      notificationsTable,
      eq(userNotificationsTable.notifId, notificationsTable.notifId),
    )
    .where(
      and(
        eq(userNotificationsTable.userId, user.id),
        eq(userNotificationsTable.isRead, false), // 0 in SQL is false in JS/TS
      ),
    )
    .orderBy(desc(userNotificationsTable.createdAt));
}
