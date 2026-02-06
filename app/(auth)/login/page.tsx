import { LoginForm } from "@/components/login-form";

const name = "GraceLine"

function page() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10 gap-2">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default page