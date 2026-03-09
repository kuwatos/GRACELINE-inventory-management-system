import { db } from "../../index";
import { notificationsTable, userNotificationsTable } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export async function readUserNotifications(userId: number) {
  return await db
    .select({
      description: notificationsTable.description,
      createdAt: userNotificationsTable.createdAt,
    })
    .from(userNotificationsTable)
    .leftJoin(
      notificationsTable,
      eq(userNotificationsTable.notifId, notificationsTable.notifId),
    )
    .where(
      and(
        eq(userNotificationsTable.userId, userId),
        eq(userNotificationsTable.isRead, false), // 0 in SQL is false in JS/TS
      ),
    );
}
