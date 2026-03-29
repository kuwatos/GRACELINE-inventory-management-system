import { 
  usersTable, 
  sessionsTable, 
  accountsTable, 
  verificationTable 
} from "../src/db/schema"
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/index"; // drizzle instance
import { username } from "better-auth/plugins" // Plugin for username login
import { usernameClient } from "better-auth/client/plugins" // Client-side plugin for username login


export const auth = betterAuth({
    
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: usersTable,
            session: sessionsTable,
            account: accountsTable,
            verification: verificationTable,
        }
    }),

    user: {
    additionalFields: {
        firstName: { 
            type: "string", 
            fieldName: "first_name" // This is where the DB mapping happens!
        },
        lastName: { 
            type: "string", 
            fieldName: "last_name" 
        },
        status: { 
            type: "string", 
            fieldName: "user_status" 
        },
        department: { 
            type: "string" // No fieldName needed since the DB column is also "department"
        },
    },
    // Only use 'fields' for the built-in Better Auth defaults
    fields: {
        // e.g., if you renamed 'email' to 'user_email' in your DB
        // email: "user_email", 
    }

    
    },

    emailAndPassword: { 
        enabled: true, 
    }, 
    plugins: [ 
        username() 
    ] 
});