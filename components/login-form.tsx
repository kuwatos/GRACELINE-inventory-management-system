"use client"

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

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Login Success! Data:", data)
    // You will add your authentication logic here
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

              <Button type="submit" className="w-full mt-2">Login</Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                Don&apos;t have an account? <a href="#" className="underline underline-offset-4 hover:text-black">Contact Admin</a>
              </div>

            </form>
          </Form>

          {/* Right Side Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/logo.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}