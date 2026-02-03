"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export function ThemeRestorer({ userTheme }: { userTheme: string }) {
  const { setTheme, theme } = useTheme()
  const mounted = useRef(false)

  useEffect(() => {
    // Only restore if userTheme is valid and different from current, and we haven't done it yet this session
    // Actually, local storage ("theme") might be "light" because of logout.
    // If userTheme (DB) is "dark", we should set it.
    if (!mounted.current && userTheme && userTheme !== "system") {
       setTheme(userTheme)
       mounted.current = true
    } else if (!mounted.current && userTheme === "system") {
       setTheme("system")
       mounted.current = true
    }
  }, [userTheme, setTheme])

  return null
}
