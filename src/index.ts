import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

// 👇 declare global type
declare global {
  // eslint-disable-next-line no-var
  var postgresClient: ReturnType<typeof postgres> | undefined;
}

// 👇 reuse client if it already exists
const client =
  global.postgresClient ??
  postgres(connectionString, {
    prepare: false,
    ssl: "require",
    max: 10,
  });

// 👇 store it globally in dev to prevent duplication
if (process.env.NODE_ENV !== "production") {
  global.postgresClient = client;
}

// 👇 export db normally
export const db = drizzle(client, { schema });