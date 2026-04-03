import { LoginForm } from "@/components/login-form";
import { checkLoginStatus } from "@/lib/action/user.action";

const name = "GraceLine"

async function page() {
  // 1. Check status on the SERVER before the page even sends HTML to the browser
  // This function should call redirect() if a session exists.
  await checkLoginStatus();

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10 gap-2">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default page