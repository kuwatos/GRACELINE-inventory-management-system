// CRUD lives here
import { db } from "../../index";
import { logsTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { User } from "next-auth";

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) throw new Error("Unauthorized");

//CREATE
export async function createLog(data: {
  // Change the value of userId to user.id once we have the auth system in place
  // userId: number;
  actionId: number;
  targetId: number;
  prevValue?: string;
  newValue: string;
  remarks?: string;
}) {
  return db.insert(logsTable).values(data).returning();
}

//READ
export async function readLogs() {
  return db.select().from(logsTable);
}

//DELETE
export async function deleteLog(id: number) {
  return db.delete(logsTable).where(eq(logsTable.logId, id)).returning();
}
