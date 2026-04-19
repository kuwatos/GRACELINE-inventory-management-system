// lib/error-handler.ts
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * A centralized error handler for try/catch blocks.
 * @param error The error caught in the catch block
 * @param fallbackMessage A generic message if the error is unreadable
 */
export function handleError(error: unknown, fallbackMessage = "Something went wrong. Please try again.") {
  // for redirection handling
  if (isRedirectError(error)) {
    throw error; // Re-throw so the browser actually redirects but does not toast
  }

  // Always log to console for developer sanity
  console.error("DEBUG [Error Handler]:", error);

  // 1. If it's a standard JavaScript Error (e.g., throw new Error("Item out of stock"))
  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  // 2. If your server action returns an object like { error: "Custom message" }
  if (typeof error === "object" && error !== null && "error" in error) {
    toast.error((error as Record<string, string>).error);
    return;
  }

  // 3. If someone just threw a string (e.g., throw "Bad request")
  if (typeof error === "string") {
    toast.error(error);
    return;
  }

  // 4. If we have no idea what it is, show the safe fallback message
  toast.error(fallbackMessage);
}


//How to Use:

/** 
 *  import { handleError } from "@/lib/error-handler";
    import { toast } from "sonner";

    const onSubmit = async (data: FormValues) => {
      try {
        await createItemAction(data);
        toast.success("Item created!"); // Success is still simple
      } catch (error) {
        // Pass the error, and optionally a custom fallback!
        handleError(error, "Could not save the inventory item."); 
      }
  };
*/


//A wrapper function to save you typing
export async function executeAction(
  action: () => Promise<any>, 
  successMessage?: string
) {
  try {
    const result = await action();

    // 1. If the action returned a failure object (e.g., success: false)
    // Route it to handleError to trigger a red toast
    if (result?.success === false) {
      handleError(result.error || result.message || "Action failed");
      return result;
    }

    // 2. Only show success toast if we are actually successful
    const message = result?.message || successMessage;
    if (message) toast.success(message);
    
    return result;
  } catch (error) {
    // 3. Handles thrown exceptions and redirects
    handleError(error);
  }
}

// Usage in your component:
//const onSubmit = () => executeAction(() => createItem(data), "Saved!");   
