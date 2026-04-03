// lib/error-handler.ts
import { toast } from "sonner";

/**
 * A centralized error handler for try/catch blocks.
 * @param error The error caught in the catch block
 * @param fallbackMessage A generic message if the error is unreadable
 */
export function handleError(error: unknown, fallbackMessage = "Something went wrong. Please try again.") {
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