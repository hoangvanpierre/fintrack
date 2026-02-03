"use client"

import { Wallet } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { useTheme } from "next-themes"
import { useEffect } from "react"

export default function LoginPage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-background">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <span className="text-3xl font-bold tracking-[-0.085em] text-foreground">
            fintrack
          </span>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
