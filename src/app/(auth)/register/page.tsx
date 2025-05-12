import { MessageCircle } from "lucide-react"

import { RegisterForm } from "@/components/RegisterForm"
import { appName } from "@/lib/constants"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MessageCircle className="size-4" />
          </div>
          {appName}
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
