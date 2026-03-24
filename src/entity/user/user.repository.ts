// CRUD lives here
import { db } from "../../index";
<<<<<<< HEAD
import { usersTable, passwordsTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";

// CREATE
export async function createUser(data: { 
  username: string; 
  firstName: string; 
  lastName: string; 
  department: string; 
  passwordStr: string; 
}) {
  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(usersTable).values({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      department: data.department,
    }).returning();

    await tx.insert(passwordsTable).values({
      userId: newUser.userId,
      password: data.passwordStr, 
    });

    return newUser; 
=======
import { usersTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";
import { createLog } from "../log/log.repository";

//CREATE
export async function createUser(data: { username: string; userType: string }) {
  // TODO: Add password
  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(usersTable).values(data).returning();

    if (newUser) {
      await createLog({
        actionId: 3,
        targetId: newUser.userId,
        newValue: newUser.username,
        // Remarks: null (per instructions)
      }, tx); // Passing tx for atomicity
    }

    return newUser;
>>>>>>> 590ef90 (Added log functions but still encounters errors with db connection. Will continue to debug and fix the issue.)
  });
}

// READ
export async function readUsers() {
  return db.select().from(usersTable).where(eq(usersTable.status, "active"));
}

// SEARCH
export async function searchUsers(filters: {
  keyword?: string;
  category?: string;
}) {
  // FIX 1 & 2: Start with the active rule so we NEVER show deleted ghosts, 
  // and the conditions array is never completely empty!
  const conditions = [eq(usersTable.status, "active")];

  // Add keyword if it exists (now searches username, first name, OR last name)
  if (filters.keyword) {
    const keywordCondition = or(
      ilike(usersTable.username, `%${filters.keyword}%`),
      ilike(usersTable.firstName, `%${filters.keyword}%`),
      ilike(usersTable.lastName, `%${filters.keyword}%`)
    );
    if (keywordCondition) {
      conditions.push(keywordCondition);
    }
  }

  // Add category filter if selected (Swapped userType for department!)
  if (filters.category) {
    conditions.push(eq(usersTable.department, filters.category));
  }

  // Run the query with all active conditions
  return db
    .select()
    .from(usersTable)
    .where(and(...conditions));
}

// UPDATE
export async function updateUser(data: {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  password?: string; // Notice this is optional (?)
}) {
<<<<<<< HEAD
  const { id, password, ...fields } = data;

  return await db.transaction(async (tx) => {
    // 1. Update the profile info in the usersTable
    const [updatedUser] = await tx
      .update(usersTable)
      .set(fields)
      .where(eq(usersTable.userId, id))
      .returning();

    // 2. IF the admin typed a new password, update the passwordsTable!
    if (password) {
      await tx
        .update(passwordsTable)
        .set({ password: password }) // Remember: We will hash this later!
        .where(eq(passwordsTable.userId, id));
    }

=======
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get current state to compare fields
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, id))
      .limit(1);

    if (!existing) throw new Error("User not found");

    const updates: Record<string, any> = {};

    // 2. Loop and Log individual changes
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        await createLog({
          actionId: 5, // Changed User Details
          targetId: id,
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
          // Remarks: null (per instructions)
        }, tx);
      }
    }

    if (Object.keys(updates).length === 0) return { message: "No changes" };

    const [updatedUser] = await tx
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.userId, id))
      .returning();

>>>>>>> 590ef90 (Added log functions but still encounters errors with db connection. Will continue to debug and fix the issue.)
    return updatedUser;
  });
}

// DELETE (True Soft Delete - Enterprise Way)
export async function deleteUser(id: number) {
<<<<<<< HEAD
  const [deletedUser] = await db
    .update(usersTable)
    .set({ status: "inactive" })
    .where(eq(usersTable.userId, id))
    .returning();
=======
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, id))
      .limit(1);
>>>>>>> 590ef90 (Added log functions but still encounters errors with db connection. Will continue to debug and fix the issue.)

    if (!existing) throw new Error("User not found");

    const [deletedUser] = await tx
      .delete(usersTable)
      .where(eq(usersTable.userId, id))
      .returning();

    if (deletedUser) {
      await createLog({
        actionId: 6,
        targetId: id,
        prevValue: existing.username,
        newValue: null,
      }, tx);
    }

    return deletedUser;
  });
}

