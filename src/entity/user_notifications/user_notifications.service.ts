import { createUserNotification } from "./user_notifications.repository";
import { getUsersUnderDepartmentUsingNotifId } from "../notifcation/notification.repository";

export async function createUserNotificationService(data: { notifId: number }) {
  const affectedUsers = await getUsersUnderDepartmentUsingNotifId({
    notificationId: data.notifId,
  });

  await Promise.all(
    affectedUsers.map(async (users) => {
      await createUserNotification({ notifId: data.notifId, userId: users.id });
    }),
  );
}
