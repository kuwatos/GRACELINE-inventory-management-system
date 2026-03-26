import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./db/schema"; // Path to your schema file

// // Create a connection pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // Export the db instance with the schema included
// export const db = drizzle(pool, { schema });
import "dotenv/config"; // This loads the .env file automatically
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema"; // Import your schema for type-safety

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

// Single client configuration for the entire app
const client = postgres(connectionString, {
  prepare: false,      // REQUIRED for Supabase Port 6543
  ssl: "require",      // REQUIRED for Supabase
  max: 10,             // Allows up to 10 concurrent users/transactions

});

export const db = drizzle(client, { schema });