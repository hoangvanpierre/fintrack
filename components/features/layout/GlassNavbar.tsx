"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TransactionDialog } from "@/components/features/transactions/TransactionDialog"
import { UserNav } from "@/components/features/layout/UserNav"
import { MobileNav } from "@/components/features/layout/MobileNav"
import { cn } from "@/lib/utils"

interface GlassNavbarProps {
  user: any
  accounts: any[]
  categories: any[]
}

export function GlassNavbar({ user, accounts, categories }: GlassNavbarProps) {
  const pathname = usePathname()

  const navLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/transactions", label: "Transactions" },
    { href: "/dashboard/accounts", label: "Accounts" },
    { href: "/dashboard/settings", label: "Settings" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-8">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden mr-4">
          <MobileNav user={user || {}} />
        </div>

        {/* Logo - Desktop */}
        <div className="hidden md:flex items-center gap-2 mr-8">
          <Link 
            href="/dashboard" 
            className="text-xl font-bold tracking-[-0.085em] text-gray-900 transition-opacity hover:opacity-80"
          >
            fintrack
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium p-1 rounded-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full transition-all duration-200",
                  isActive 
                    ? "text-gray-900 bg-white/40 shadow-sm backdrop-blur-sm font-semibold border border-white/20" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-4">
          {pathname !== "/dashboard/accounts" && (
            <TransactionDialog categories={categories} accounts={accounts} />
          )}
          <UserNav user={user || {}} />
        </div>
      </div>
    </header>
  )
}