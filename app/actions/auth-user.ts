"use client";
import { authClient } from "@/lib/auth-client";

export async function validateUserSessionClient() {
  // ✅ USE THIS INSTEAD:
  const { data: session } = await authClient.getSession();
  
  if (!session) {
    console.log("No active session found");
    return null;
  }
  
  return session;
}

