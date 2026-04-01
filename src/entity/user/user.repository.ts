// CRUD lives here
import { db } from "../../index";
import { usersTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";
import { createLog } from "../log/log.repository";

//CREATE
export async function createUser(data: { username: string; userType: string }) {
  // TODO: Add password
  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(usersTable).values(data).returning();

    if (newUser) {
      for (const [key, val] of Object.entries(newUser)) {
        // We only log if the value actually exists (not null/undefined)
        if (val !== null && val !== undefined) {
          await createLog({
            actionId: 3,                    // Added a New Inventory Item
            targetId: newUser.id,
            columnName: key,                // Dynamic: productName, productCategory1, etc.
            prevValue: null,                // It's a creation, so previous is always null
            newValue: val.toString(),
            remarks: null
          }, tx);
        }
      }
    }

    return newUser;
  });
}

// READ
export async function readUsers() {
  return db.select().from(usersTable).where(eq(usersTable.active, true));
}

// SEARCH
export async function searchUsers(filters: {
  keyword?: string;
  category?: string;
}) {
  // FIX 1 & 2: Start with the active rule so we NEVER show deleted ghosts, 
  // and the conditions array is never completely empty!
  const conditions = [eq(usersTable.active, true)];

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
  const { id, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get current state to compare fields
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!existing) throw new Error("User not found");

    const updates: Record<string, any> = {};

    // 2. Loop and Log individual changes
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      // Ensure we aren't comparing 'undefined' and that values actually differ
      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        // DYNAMIC LOGGING
        await createLog({
          actionId: 5,                  // "Changed User Details"
          targetId: id,
          columnName: key,             // DYNAMIC: This will be "username" or "userType"
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
        }, tx);
      }
    }

    // 3. Finalize update only if something actually changed
    if (Object.keys(updates).length === 0) return { message: "No changes" };

    const [updatedUser] = await tx
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, id))
      .returning();

    return updatedUser;
  });
}

// DELETE (True Soft Delete - Enterprise Way)
export async function deleteUser(id: number) {
  return await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!existing) throw new Error("User not found");

    const [deletedUser] = await tx
      .update(usersTable)
      .set({ active: false })
      .where(eq(usersTable.id, id))
      .returning();

    if (deletedUser) {
      await createLog({
        actionId: 6,
        targetId: id,
        columnName: "username",
        prevValue: existing.username,
        newValue: null,
      }, tx);
    }

    return deletedUser;
  });
}
