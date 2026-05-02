"use server";

import { db } from "@/src/index";
import { userNotificationsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {updateUserNotification, markAllAsReadNotfification} from "@/src/entity/user_notifications/user_notifications.repository";

export async function updateUserNotificationAction(id: number) {
  try {
    await updateUserNotification({ id });

    revalidatePath("/notifications"); // Update any sidebar badges or home counters
    return { success: true };
  } catch (error) {
    console.error("Failed to update notification:", error);
    return { success: false };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    await markAllAsReadNotfification();
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return { success: false };
  }
}