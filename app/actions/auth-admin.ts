"use server";
import { auth, type User} from "@/lib/auth";
import { headers } from "next/headers";

export async function adminCreateUser(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const department = formData.get("department") as string;
    const password = formData.get("password") as string;
    const name = firstName + " " + lastName;
    const username = firstName.toLowerCase() + "." + lastName.toLowerCase(); // simple username generation, you can customize this
    const email = username + "@internal.local"; // placeholder only, not used for login
    
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
                password,
                role: "user",
                data: {
                    username,
                    firstName,
                    lastName,
                    department,
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


export async function adminChangePassword(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = formData.get("userId") as string;
    const newPassword = formData.get("newPassword") as string;

    // 1. Security Check: Only admins can do this
    if (session?.user.department!== "admin") {
        throw new Error("Unauthorized");
    }

    // 2. Change the password via the API
    try {
        const data = await auth.api.setUserPassword({
            body: {
                newPassword,
                userId
            },
            headers: await headers(),
            });
        return { success: true, message: "Password changed successfully."};
    }catch (error: any) {
        console.error("Admin Change Password Error:", error);
        return { success: false, message: error.message || "Failed to change password." };
    }    
}

export async function adminUpdateUserDetails(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = formData.get("userId") as string;
    const newDepartment = formData.get("newDepartment") as string;
    const newFirstname = formData.get("newFirstName") as string;
    const newLastname = formData.get("newLastName") as string;

    // 1. Security Check: Only admins can do this
    if (session?.user.department!== "admin") {
        throw new Error("Unauthorized");
    }
    
    // 2. Change the password via the API
    try {
        const data = await auth.api.adminUpdateUser({
            body: {
                userId, // required
                data: { 
                    firstName: newFirstname,
                    lastName: newLastname,
                    department: newDepartment,
                }, // only include fields you want to update, all are optional
            },
        headers: await headers(),
    });
    return { success: true, message: "User details updated successfully."};
    }catch (error: any) {
        console.error("Admin Update User Details Error:", error);
        return { success: false, message: error.message || "Failed to update user details." };
    }    
}

export async function adminToggleUserActiveStatus(id: string) {
    const session = await auth.api.getSession({ headers: await headers() });

    // 1. Security Check: Only admins can do this
    if (session?.user.department!== "admin") {
        throw new Error("Unauthorized");
    }

    try {
        // 2. Fetch the user to get current status
        const userToUpdate = await auth.api.getUser({ 
            query: {
                id: id, // required
            },
            headers: await headers(), 
        }) as unknown as User;
        const data = await auth.api.adminUpdateUser({
            body: {
                userId: id, // required
                data: { 
                    // toggle active status
                    active: userToUpdate.active === true ? false : true, 
                },
            },
            headers: await headers(),
        });
        return { success: true, message: "User archived successfully."};
    }catch (error: any) {
        console.error("Admin Toggle User Active Status Error:", error);
        return { success: false, message: error.message || "Failed to archive user." };
    }

}