"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 character")
    .max(30, "Password must be at most 30 characters")
})

export function LoginForm({
  className,
  ...props

}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      username: "",
      password: ""
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>){

  }

  const company = "Graceline";
  return (
    <div className={cn("flex flex-col gap-6 bg", className)} {...props}>
      <Card className="flex justify-center overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your {company}  account
                </p>
              </div>
              <Controller 
              name="username"
              control={form.control}
              render={({field, fieldState}) => (
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="username"
                    type="text"
                    placeholder="username"
                  />
                  <div className="h-1">
                    {fieldState.invalid &&(
                      <FieldError errors = {[fieldState.error]}/>
                    )}
                  </div>
                </Field>
              )}
              />
              <Controller
              name="password"
              control={form.control}
              render={({field, fieldState}) => (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                   id="password" 
                   type="password" 
                   placeholder="password"
                   />
                   <div className="h-1">
                    {fieldState.invalid &&(
                      <FieldError errors = {[fieldState.error]}/>
                    )}
                  </div>
                </Field>
                )}
              />
              <Field>
                <Button type="submit">Login</Button>
              </Field>
              
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Contact Admin</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block p9">
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
