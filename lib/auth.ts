import { 
  usersTable, 
  sessionsTable, 
  accountsTable, 
  verificationTable 
} from "../src/db/schema"
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/index"; // drizzle instance
import { role, username } from "better-auth/plugins" // Plugin for username login
import { nextCookies } from "better-auth/next-js"; // Plugin for Next.js cookie handling
import { createAuthMiddleware, APIError, isAPIError } from "better-auth/api";
import { admin } from "better-auth/plugins"
import { customSession } from "better-auth/plugins";
import { createLog } from "@/src/entity/log/log.repository";
import * as schema from "@/src/db/schema";






// betterAuth instance configuration
const options = {
    // database configuration using Drizzle ORM adapter
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationTable,
        },
    }),

    // user configuration with additional custom fields
    user: {
        additionalFields: {
            firstName: { 
                type: "string", 
                fieldName: "first_name" // This is where the DB mapping happens!
            },
            lastName: { 
                type: "string",  
            },
            active: { 
                type: "boolean", 
                defaultValue: true,
            },
            department: { 
                type: "string" // No fieldName needed since the DB column is also "department"
            },

            // required fields for username login plug-in
            username: {
                type: "string", 
                required: true, // for username login plugin
                
            },
            displayUsername: {
                type: "string", 
                fieldName: "display_username" // for username login plugin
            },

            role: {
                type: "string",
            },
            // required fields for admin plug-in are also included in the schema, but no need to define them here unless you want to set defaults or validations

        },
        // Only use 'fields' for the built-in Better Auth defaults
        fields: {
            // e.g., if you renamed 'email' to 'user_email' in your DB
            // email: "user_email", 
        }
    },

    session: {
        additionalFields: {
            impersonatedBy: {
                type: "string",
            }
        }
    },

    // authentication methods configuration
    emailAndPassword: { 
        enabled: true, 
    }, 

    // custom middleware to check 'active' status before allowing sign-in
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Target the username sign-in endpoint specifically
            if (ctx.path === "/sign-in/username") {
                const { username } = ctx.body;

                // 1. Fetch user using the internal adapter
                const user = await ctx.context.adapter.findOne({
                    model: "user",
                    where: [{ field: "username", value: username }]
                }) as unknown as User; // Type assertion to include our custom 'active' field

                // 2. Check the 'active' boolean field
                // Note: Better Auth adapters usually return custom fields 
                // if they are defined in your 'user.additionalFields'
                if (user && user.active === false) {
                    throw new APIError("UNAUTHORIZED", {
                        message: "Your account is inactive. Please contact your administrator.",
                    });
                }
            }
        }),

        after: createAuthMiddleware(async (ctx) => {
            // 1. Check if the current action is the Admin creating a user
            if (ctx.path === "/admin/create-user" && ctx.method === "POST") {
                
                // 2. Get the performing user (the Admin) from the session
                const adminSession = ctx.context.session; 
                // Note: The response body contains the newly created user
                const result= ctx.context.returned 

                if(isAPIError(result)) {
                    console.error("Error creating user:", result);
                    return; // Exit if there was an error creating the user
                }
                const newUser = result as unknown as User; // Type assertion to access custom fields
                if (newUser && adminSession) {
                    for (const [key, val] of Object.entries(newUser)) {
                        if (val !== null && val !== undefined) {
                            await createLog({
                                userId: adminSession.user.id, // Log the admin's user ID
                                actionId: 3,
                                targetId: newUser.id,
                                columnName: key,
                                prevValue: null,
                                newValue: String(val),
                                // 3. Now you can record WHO did it!
                                remarks: `Created by Admin: ${adminSession.user.email}`
                            });
                        }
                    }
                }
            }
        })
    },

    
    // disable default username availability check route for security, still available in server actions
    disabledPaths: ["/is-username-available"], 
    
    // plugins configuration
    plugins: [ 
        username(),
        admin(), // Admin plugin for user management through admin only routes
        nextCookies() // make sure this is the last plugin in the array
    ]
} satisfies BetterAuthOptions;

// Create the betterAuth instance with the defined options and additional plugins
export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }, ctx) => {
            // now both user and session will infer the fields added by plugins and your custom fields
            return {
                user: {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    department: user.department,
                    active: user.active,
                    role: user.role,
                    // any other fields you defined in user.additionalFields will also be available here
                },
                session
            }
        }, options),
         // pass options here
    ]

});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;