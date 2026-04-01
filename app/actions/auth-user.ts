"use server";
import { auth } from "@/lib/auth";

export async function signInAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await auth.api.signInUsername({
        body: {
            username,
            password,
        },
    });
}

export async function signOutAction() {
    await auth.api.signOut();   
}