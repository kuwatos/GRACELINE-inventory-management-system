import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema"; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

// Single client configuration for the entire app
const client = postgres(connectionString, {
  prepare: false,      // REQUIRED for Supabase Port 6543
  ssl: "require",      // REQUIRED for Supabase
  max: 10,             // Allows up to 10 concurrent transactions
});

// One single, clean export
export const db = drizzle(client, { schema });  