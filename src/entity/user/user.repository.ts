// CRUD lives here
import { db } from "../../index";
import { usersTable, passwordsTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";
import { createLog } from "../log/log.repository";

// CREATE
export async function createUser(data: { 
  username: string; 
  firstName: string; 
  lastName: string; 
  department: string; 
  passwordStr: string; 
}) {
  return await db.transaction(async (tx) => {
    // 1. Insert into usersTable
    const [newUser] = await tx.insert(usersTable).values({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      department: data.department,
    }).returning();

    // 2. Insert into passwordsTable
    await tx.insert(passwordsTable).values({
      userId: newUser.userId,
      password: data.passwordStr, 
    });

    // 3. Log the creation of the user
    if (newUser) {
      for (const [key, val] of Object.entries(newUser)) {
        // We only log if the value actually exists (not null/undefined)
        if (val !== null && val !== undefined) {
          await createLog({
            actionId: 3,                    // Action ID for creation
            targetId: newUser.userId,
            columnName: key,                
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

  // Add category filter if selected
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
  const { id, password, ...incomingFields } = data;

  return await db.transaction(async (tx) => {
    // 1. Get current state to compare fields
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, id))
      .limit(1);

    if (!existing) throw new Error("User not found");

    const updates: Record<string, any> = {};

    // 2. Loop and Log individual changes for the usersTable fields
    for (const [key, val] of Object.entries(incomingFields)) {
      const oldValue = (existing as any)[key];

      // Ensure we aren't comparing 'undefined' and that values actually differ
      if (val !== undefined && String(val) !== String(oldValue)) {
        updates[key] = val;

        // DYNAMIC LOGGING
        await createLog({
          actionId: 5,                  // "Changed User Details"
          targetId: id,
          columnName: key,             
          prevValue: oldValue?.toString() || null,
          newValue: val.toString(),
        }, tx);
      }
    }

    let updatedUser = existing;

    // 3. Finalize usersTable update only if something actually changed
    if (Object.keys(updates).length > 0) {
      const [result] = await tx
        .update(usersTable)
        .set(updates)
        .where(eq(usersTable.userId, id))
        .returning();
      
      updatedUser = result;
    }

    // 4. IF the admin typed a new password, update the passwordsTable!
    if (password) {
      await tx
        .update(passwordsTable)
        .set({ password: password }) // Remember: We will hash this later!
        .where(eq(passwordsTable.userId, id));

      // Log the password change securely (don't log the actual password string)
      await createLog({
        actionId: 5,                  
        targetId: id,
        columnName: "password",             
        prevValue: "****",
        newValue: "****",
      }, tx);
    }

    if (Object.keys(updates).length === 0 && !password) {
        return { message: "No changes" };
    }

    return updatedUser;
  });
}

// DELETE (True Soft Delete - Enterprise Way)
export async function deleteUser(id: number) {
  return await db.transaction(async (tx) => {
    // 1. Check if user exists first
    const [existing] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.userId, id))
      .limit(1);

    if (!existing) throw new Error("User not found");

    // 2. Perform the soft delete using the correct schema ("status" instead of "active")
    const [deletedUser] = await tx
      .update(usersTable)
      .set({ status: "inactive" })
      .where(eq(usersTable.userId, id))
      .returning();

    // 3. Log the deletion
    if (deletedUser) {
      await createLog({
        actionId: 6,
        targetId: id,
        columnName: "status",
        prevValue: existing.status,
        newValue: "inactive",
      }, tx);
    }

    return deletedUser;
  });
}