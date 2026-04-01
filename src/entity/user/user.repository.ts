// CRUD lives here
"use server";
import { db } from "../../index";
import { usersTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { auth, type User} from "@/lib/auth";
import { headers } from "next/headers";


export async function createUser(data: { firstName: string; lastName: string; userType: string; department: string; passwordStr: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = data.firstName + " " + data.lastName;
  const username = data.firstName.toLowerCase() + "." + data.lastName.toLowerCase(); // simple username generation, you can customize this
  const email = username + "@internal.local"; // placeholder only, not used for login

  // 1. Security Check: Only admins can do this
  

  // 2. Create the user via the API
  try {
      const newUser = await auth.api.createUser({
          body: {
              name,
              email,
              password: data.passwordStr,
              role: "user",
              data: {
                  username,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  department: data.department,
                  status: "active", // Default status
                  }
          }
      });
      return { success: true, user: newUser};
  }catch (error: any) {
      console.error("Admin Create User Error:", error);
      return { success: false, message: error.message || "Failed to create user." };
  }
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
      ilike(usersTable.first_name, `%${filters.keyword}%`),
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
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  password?: string; // Notice this is optional (?)
}) {
  const { id, password, ...fields } = data;

  return await db.transaction(async (tx) => {
    // 1. Update the profile info in the usersTable
    const [updatedUser] = await tx
      .update(usersTable)
      .set(fields)
      .where(eq(usersTable.id, id))
      .returning();

    // 2. IF the admin typed a new password, update the passwordsTable!
    /*if (password) {
      await tx
        .update(passwordsTable)
        .set({ password: password }) // Remember: We will hash this later!
        .where(eq(passwordsTable.userId, id));
    } */

    return updatedUser;
  });
}

// DELETE (True Soft Delete - Enterprise Way)
export async function deleteUser(id: string) {
  const [deletedUser] = await db
    .update(usersTable)
    .set({ active: false })
    .where(eq(usersTable.id, id))
    .returning();

  return deletedUser;
}

