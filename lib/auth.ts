import { 
  usersTable, 
  sessionsTable, 
  accountsTable, 
  verificationTable 
} from "../src/db/schema"
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../src/index"; // drizzle instance
import { username } from "better-auth/plugins" // Plugin for username login
import { nextCookies } from "better-auth/next-js"; // Plugin for Next.js cookie handling
import { createAuthMiddleware, APIError, isAPIError } from "better-auth/api";
import { admin } from "better-auth/plugins"
import { customSession } from "better-auth/plugins";
import { createLog } from "@/src/entity/log/log.repository";
import { openAPI } from "better-auth/plugins"
import { eq } from "drizzle-orm";


// betterAuth instance configuration
const options = {
    // database configuration using Drizzle ORM adapter
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationTable,
        },
    }),

    // user configuration with additional custom fields
    user: {
        additionalFields: {
            firstName: { 
                type: "string", 
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
            },

            role: {
                type: "string",
            }

            // required fields for admin plug-in, temporarily disabled
            // required fields for admin plug-in are also included in the schema, but no need to define them here unless you want to set defaults or validations

        },
        // Only use 'fields' for the built-in Better Auth defaults
        fields: {
            // e.g., if you renamed 'email' to 'user_email' in your DB
            // email: "user_email", 
        }
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // expires in 7 days
        updateAge: 60 * 60 * 24, // checks in 1 day, then extends session validity with the value of expiresIn

        additionalFields: {
            impersonatedBy: {
                type: "string",
            }
        }
    },

    // authentication methods configuration
    emailAndPassword: { 
        enabled: true,
        autoSignIn: false, 
    }, 

    // custom middleware to check 'active' status before allowing sign-in
   databaseHooks: {
        session: {
            create: {
                before: async (session, ctx) => {
                    // 1. Fetch the user associated with this new session
                    // We use the adapter directly for the most efficient query
                    const user = await ctx?.context?.adapter.findOne({
                        model: "user",
                        where: [{ field: "id", value: session.userId }]
                    });

                    // 2. Check if the user is active
                    // Better Auth uses 'user' as the base type, 
                    // but your schema includes 'active'
                    if (user && (user as User).active === false) {
                        throw new APIError("UNAUTHORIZED", {
                            message: "Your account is inactive. Please contact your administrator.",
                        });
                    }

                    // 3. Delete all other existing sessions for the user
                    await db
                        .delete(sessionsTable)
                        .where(eq(sessionsTable.userId, session.userId));

                    // Return the session data to continue
                    return { data: session };
                },
            },

            delete: {
                after: async (session, ctx) => {
                    try {
                        // 1. Fetch the user associated with the session being deleted
                        const user = await ctx?.context?.adapter.findOne({
                            model: "user",
                            where: [{ field: "id", value: session.userId }]
                        }) as unknown as User;

                        if (user) {
                            console.log(`Audit: User ${user.name} logged out (Session Deleted).`);
                            
                            // 2. Create the log entry
                            await createLog({
                                userId: user.id || "unknown",
                                actionId: 2, // User Sign Out
                                targetId: user.id || "unknown",
                                columnName: "none",
                                prevValue: null,
                                newValue: null,
                                remarks: null
                            });
                        }
                    } catch (error: any) {
                        // We log the error but don't throw, as the session is already deleted
                        console.error("User Sign Out Audit Error:", error);
                    }
                }
            }
        },
    },
    hooks: {
        after: createAuthMiddleware( async (ctx) => {
            if (ctx.path.startsWith("/sign-out")) {
                console.log("signed out")
                // At this point, the session is being terminated.
                // You can access the user performing the action from the context.
                const user = ctx.context.session?.user;
                if (user) {
                    console.log(`Audit: User ${user.name} (${user.email}) logged out.`);
                    try {
                        await createLog({
                            userId: user.id || "unknown",
                            actionId: 2, // User Sign Out
                            targetId: user.id || "unknown",
                            columnName: "none",
                            prevValue: null,
                            newValue: null,
                            remarks: null
                        });
                        return { success: true };
                        }catch (error: any) {
                        console.error("User Sign Out Error:", error);
                        return { success: false, message: error.message || "Failed to sign out user." };
                    }
                }
            }
        }),
           
    },
    
    // disable default username availability check route for security, still available in server actions
    disabledPaths: ["/is-username-available"], 
    
    // plugins configuration
    plugins: [ 
        username(),
        ...(process.env.NODE_ENV !== "production" ? [openAPI()] : []),
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
                    name: user.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
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