// CRUD lives here
"use server";
import { db } from "../../index";
import { usersTable } from "../../db/schema";
import { usersTable } from "../../db/schema";
import { and, or, ilike, eq } from "drizzle-orm";
import { createLog } from "../log/log.repository";
import { auth, type User} from "@/lib/auth";
import { headers } from "next/headers";


export async function createUser(data: { 
  firstName: string; 
  username: string;
  lastName: string; 
  userType: string; 
  department: string; 
  passwordStr: string 
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = data.firstName + " " + data.lastName;
  const email = data.username + "@internal.local"; // placeholder only, not used for login
  const role = data.userType === "admin" ? "admin" : "user"; // Basic role assignment based on userType

  // 1. Security Check: Only admins can do this
  if (session?.user.department!== "admin") {
        throw new Error("Unauthorized");
    }

  // 2. Create the user via the API
  try {
    const newUser = await auth.api.createUser({
        body: {
            name,
            email,
            password: data.passwordStr,
            role,
            data: {
              username: data.username,
              displayUsername: name,
              firstName: data.firstName,
              lastName: data.lastName,
              department: data.department,
              active: true, // Default status
            }
        },
        headers: await headers()
    });

    if (newUser.user) {
      for (const [key, val] of Object.entries(newUser.user)) {
        // We only log if the value actually exists (not null/undefined)
        if (val !== null && val !== undefined) {
          await createLog({
            userId: session?.user.id || "unknown", // Who performed the action
            actionId: 3,                    // Added a New Inventory Item
            targetId: newUser.user.id,
            columnName: key,                // Dynamic: productName, productCategory1, etc.
            prevValue: null,                // It's a creation, so previous is always null
            newValue: val.toString(),
            remarks: null
          });
        }
      }
    }
    return { success: true, user: newUser};
  }catch (error: any) {
      console.error("Admin Create User Error:", error);
      return { success: false, message: error.message || "Failed to create user." };
  }
}

// READ
export async function readUsers() {
  return db.select().from(usersTable).where(eq(usersTable.active, true));
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
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  password?: string; // Notice this is optional (?)
}) {
    const { id, password, ...fields } = data;
    const oldUser = await auth.api.getUser({
      query: { id },
      headers: await headers(),
    }) as unknown as User; // Type assertion to include our custom fields
    const session = await auth.api.getSession({ headers: await headers() });

    // 1. Security Check: Only admins can do this
    if (session?.user.department!== "admin") {
          throw new Error("Unauthorized");
      }
    
    // 2. Update the user via the API
    try {
      await auth.api.adminUpdateUser({
          body: { 
            userId: id,
            data: {
              ...fields,
              }
            },
          headers: await headers(),
      }) as unknown as User; // Type assertion to include our custom fields
      // 2.1 IF the admin typed a new password, update the password as well (separate API call since it's a different endpoint)
      if (password) {
        await auth.api.setUserPassword({
          body: {
              newPassword: password, // required
              userId: id, // required
          },
        headers: await headers(),
        })
      }
      // 3. Fetch the updated user to get new values for logging
      const updatedUser = await auth.api.getUser({
        query: { id },
        headers: await headers(),
      }) as unknown as User; // Type assertion to include our custom fields

      // 3. Log the changes (only log fields that were actually updated)
      if (oldUser && updatedUser) {
        for (const [key, val] of Object.entries(updatedUser)) {
          // 1. Grab the previous value from the oldUser object
          const prevVal = (oldUser as Record<string, any>)[key];

          // 2. Only log if the value has actually changed AND it's not the 'id' field
          // We use != instead of !== if you want to ignore type differences (like "1" vs 1)
          if (val !== prevVal && key !== 'id') {
            await createLog({
              userId: session?.user.id || "unknown",
              actionId: 5,
              targetId: updatedUser.id,
              columnName: key,
              // 3. Convert prevValue to string safely (handle null/undefined)
              prevValue: prevVal != null ? prevVal.toString() : null,
              // 4. Convert newValue to string safely
              newValue: val != null ? val.toString() : null,
              remarks: null
            });
          }
        }
      }

    if (password && oldUser && updatedUser) {
      await createLog({
        userId: session?.user.id || "unknown", // Who performed the action
        actionId: 4,                    // Changed User password
        targetId: updatedUser.id,
        columnName: "password",                // Dynamic: productName, productCategory1, etc.
        prevValue: null,                // from oldUser
        newValue: null,
        remarks: "password changed, cannot expose prevValue and newValue in logs for security reasons"
      });
    }

    return { success: true, user: updatedUser};
  }catch (error: any) {
      console.error("Admin Update User Error:", error);
      return { success: false, message: error.message || "Failed to update user details." };
  }
}

// DELETE (True Soft Delete - Enterprise Way)
export async function deleteUser(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  // 1. Security Check: Only admins can do this
  if (session?.user.department!== "admin") {
        throw new Error("Unauthorized");
    }
  try {
    const deletedUser = await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          active: false
        }
      },
      headers: await headers(),
    }) as unknown as User; // Type assertion to include our custom fields

    // 2. Log the deletion action (we log the 'active' field change from true to false)
    if (deletedUser) {
      await createLog({
        userId: session?.user.id || "unknown",
        actionId: 6,
        targetId: deletedUser.id,
        columnName: "active",
        prevValue: "true",
        newValue: deletedUser.active.toString(),
        remarks: null
      });
    }
    return deletedUser;
  }catch (error: any) {
      console.error("Admin Delete User Error:", error);
      return { success: false, message: error.message || "Failed to delete user." };
  }
}

export async function signInAction(data: { username: string; password: string }) {
  try {  
    const signInResult =await auth.api.signInUsername({
          body: {
              username: data.username,
              password: data.password,
          },
    });
    if (signInResult.user) {
      await createLog({
        userId: signInResult.user.id || "unknown",
        actionId: 1, // User Sign In
        targetId: signInResult.user.id || "unknown",
        columnName: "none",
        prevValue: null,
        newValue: null,
        remarks: null
      });
    }
    return { success: true };
  }catch (error: any) {
      console.error("User Sign In Error:", error);
      return { success: false, message: error.message || "Failed to sign in user." };
  }
}

export async function signOutAction() {
  const session = await auth.api.getSession({ headers: await headers() });
    try {
      await auth.api.signOut();
      await createLog({
        userId: session?.user.id || "unknown",
        actionId: 2, // User Sign Out
        targetId: session?.user.id || "unknown",
        columnName: "none",
        prevValue: null,
        newValue: null,
        remarks: null
      });
      return { success: true };
    }catch (error: any) {
      console.error("User Sign Out Error:", error);
      return { success: false, message: error.message || "Failed to sign out user." };
  }

}

export async function validateUser(requiredRole?: string) {
    const session = await auth.api.getSession({headers: await headers()}); // Better Auth session fetch

    if (!session || !session.user.active) {
        throw new Error("Unauthorized: Account inactive or session expired");
    }

    if (requiredRole && session.user.department !== requiredRole) {
        throw new Error("Forbidden: Insufficient permissions");
    }

    return session.user;
}
