import { createUserNotification } from "./user_notifications.repository";
import { getUsersUnderDepartmentUsingNotifId } from "../notifcation/notification.repository";

export async function createUserNotificationService(data: { notifId: number }, tx?: any) {
  const affectedUsers = await getUsersUnderDepartmentUsingNotifId({
    notificationId: data.notifId,
  }, tx);

  interface AffectedUser {
    id: number;
  }

  await Promise.all(
    affectedUsers.map(async (user: AffectedUser) => {
      await createUserNotification({ notifId: data.notifId, userId: user.id }, tx);
    }),
  );
}
