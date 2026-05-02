"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signIn, validateSessionUser} from "@/src/entity/user/user.repository"; // Import the server action for signing in
import { redirectToDashboard } from "@/lib/action/user.action"
import { executeAction } from "@/lib/error.handler"
import { useRouter } from "next/navigation"


const formSchema = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be at most 30 characters")
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
  // 1. Capture the returned result from executeAction
  const result = await executeAction(
    async () => {
      // The action must return the response so executeAction can access result.message
      return await signIn(data);
    },
    "Logging you in..." // Optional: explicitly pass a successMessage
  );

  // 2. Handle specific "Expected" Login Logic (Navigation)
  // We check result?.success because executeAction returns undefined if it catches an error
  if (result?.success) {
    const user = await validateSessionUser();
    const path = await redirectToDashboard(user.department);
    window.location.href = path;
  }
}
  const company = "Graceline";

  return (
    <div className={cn("flex flex-col gap-6 min-h-screen items-center justify-center p-6", className)} {...props}>
      {/* 👇 Added max-w-md to keep the card from stretching */}
      <Card className="w-full max-w-md overflow-hidden border border-gray-200 shadow-sm rounded-2xl bg-white">
        <CardContent className="p-0">
          <Form {...form}>
            <form className="p-8 md:p-10 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your {company} account
                </p>
              </div>

              {/* --- USERNAME FIELD --- */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-semibold text-gray-900">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-black/5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- PASSWORD FIELD --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-semibold text-gray-900">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        className="h-11 rounded-xl border-gray-200 focus-visible:ring-black/5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full h-11 bg-[#0f172a] hover:bg-[#0f172a]/90 text-white rounded-xl font-bold shadow-sm mt-2 transition-all active:scale-95"
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-2">
                Don&apos;t have an account? Contact Admin
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}