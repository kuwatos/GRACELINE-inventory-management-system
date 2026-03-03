import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./db/schema"; // Path to your schema file

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the db instance with the schema included
export const db = drizzle(pool, { schema });
