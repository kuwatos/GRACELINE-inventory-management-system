import { db } from "../../index";
import { userNotificationsTable } from "../../db/schema";
import { eq, and } from "drizzle-orm";

//CREATE
export async function createUserNotification(data: {
  notifId: number;
  userId: number;
  //   createdAt: Date; //removed because it defaults to now() in the schema, so it can be optional in the input
}) {
  return db.insert(userNotificationsTable).values(data).returning();
}

//READ
export async function readUserNotification() {
  return db.select().from(userNotificationsTable);
}

//READ UNSEEN NOTIFICATIONS OF A USER
export async function readUnseenUserNotifications(userId: number) {
  return db
    .select()
    .from(userNotificationsTable)
    .where(
      and(
        eq(userNotificationsTable.userId, userId),
        eq(userNotificationsTable.isRead, false),
      ),
    );
}

//UPDATE
//This is the toggle function for marking a notification as read or unread
export async function updateUserNotification(data: {
  id: number;
  isRead: boolean;
}) {
  return db
    .update(userNotificationsTable)
    .set({
      isRead: data.isRead,
    })
    .where(eq(userNotificationsTable.userNotifId, data.id));
}

//DELETE
// Delete function not needed
