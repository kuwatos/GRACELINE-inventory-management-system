import { db } from "../../index";
import { usersTable } from "../../db/schema";

export async function readUsers() {
  return db.select().from(usersTable);
}
