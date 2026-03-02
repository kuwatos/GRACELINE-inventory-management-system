// CRUD lives here
import { db } from "../../index";
import { usersTable } from "../../db/schema";
import { eq, ilike } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { create } from "domain";

//CREATE
export async function createUser(data: { username: string; userType: string }) {
  // TODO: Add passsword
  const [newUser] = await db.insert(usersTable).values(data).returning();
  await createLog({
    actionId: 3,
    targetId: newUser.userId,
    newValue: newUser.username,
  });
}

//READ
export async function readUsers() {
  return db.select().from(usersTable);
}

//SEARCH
export async function searchUsers(name: string) {
  return db
    .select()
    .from(usersTable)
    .where(ilike(usersTable.username, `%${name}%`));
}

//UPDATE
export async function updateUser(data: {
  id: number;
  username?: string;
  userType?: string;
}) {
  const { id, ...fields } = data;

  const [updatedUser] = await db
    .update(usersTable)
    .set(fields)
    .where(eq(usersTable.userId, data.id))
    .returning();

  await createLog({
    actionId: 5,
    targetId: updatedUser.userId,
    prevValue: data.username,
    newValue: updatedUser.username,
  });
}

//DELETE
export async function deleteUser(id: number) {
  const [deletedUser] = await db
    .delete(usersTable)
    .where(eq(usersTable.userId, id))
    .returning();

  if (deletedUser) {
    await createLog({
      actionId: 6,
      targetId: deletedUser.userId,
      prevValue: deletedUser.username,
      newValue: "Deleted User",
    });
  }

  return deletedUser;
}
