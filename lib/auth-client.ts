import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { usernameClient } from "better-auth/client/plugins" // Client-side plugin for username login
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"; // Import your server auth instance as a type
import { adminClient } from "better-auth/client/plugins" // Client-side plugin for admin features (optional, only if you want to use admin features on the client)
import { customSessionClient } from "better-auth/client/plugins" // Client-side plugin for custom session handling

export const authClient =  createAuthClient({
    //you can pass client configuration here
    
    // disable default username availability check route for security, still available in server actions
    disabledPaths: ["/is-username-available"], // Disable the default username availability check route for security, still available in server actions
    

    // plugins configuration
    plugins: [
        customSessionClient<typeof auth>(), // Client-side plugin for custom session handling
        adminClient(),
        inferAdditionalFields<typeof auth>(), // Client-side plugin to infer additional fields in the session
        usernameClient(), // Client-side plugin for username login
    ],
});

const { data } = authClient.useSession();
const { data: sessionData } = await authClient.getSession();