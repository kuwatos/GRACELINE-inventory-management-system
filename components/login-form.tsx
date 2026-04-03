"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// 1. Import the Shadcn Form wrappers (Consistent with your Inventory code!)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signInAction, validateUserSession } from "@/src/entity/user/user.repository"; // Import the server action for signing in
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"


const formSchema = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters") // Fixed typo here (added 's')
    .max(30, "Password must be at most 30 characters")
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await signInAction(data);
    if (result.success) {
      // Redirect to dashboard or home
      const { data: session } = await authClient.getSession();
      console.log("Login successful, session data:", session);

      if (session) {
        console.log("User session after login:", session);
        console.log("User department:", session.user.department);
        switch (session.user.department) {
          case "admin":
            console.log("Redirecting to admin dashboard...");
            redirect("/admin/dashboard");
          case "purchasing":
            console.log("Redirecting to purchasing dashboard...");
            redirect("/purchasing/dashboard");
          case "warehouse":
            console.log("Redirecting to warehouse dashboard...");
            redirect("/warehouse/dashboard");
          case "finance":
            redirect("/finance/dashboard");
        }
      }

    } else {
      // Set a manual error on the password field or a global toast
      form.setError("root", { 
        message: result.message 
      });
    }
  }

  const company = "Graceline";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex justify-center overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 w-full">
          
          {/* 2. Wrap the form in Shadcn's <Form> provider */}
          <Form {...form}>
            <form className="p-6 md:p-8 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your {company} account
                </p>
              </div>

              {/* --- USERNAME FIELD --- */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field} // 👈 That's it! No manual error wiring.
                      />
                    </FormControl>
                    <FormMessage /> {/* 👈 Zod errors automatically appear here */}
                  </FormItem>
                )}
              />

              {/* --- PASSWORD FIELD --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage /> 
                  </FormItem>
                )}
              />
              
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive text-center">
                  {form.formState.errors.root.message}
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have an account? <a href="#" className="underline underline-offset-4 hover:text-black">Contact Admin</a>
              </div>

            </form>
          </Form>

          {/* Right Side Image */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/logo.jpg"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}