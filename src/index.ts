import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";
import "dotenv/config"; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing!");
}

// Disable prefetch for Supabase's Transaction pool mode
const client = postgres(connectionString, { prepare: false });

// Export the db so the rest of your Next.js app can use it!
export const db = drizzle({ client, schema });