"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Menu, 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  Settings, 
  LogOut 
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { logout } from "@/app/actions/auth.actions"
import { useTheme } from "next-themes"

interface MobileNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const { setTheme } = useTheme()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="text-left text-2xl font-bold tracking-[-0.085em] text-foreground">
                fintrack
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-2 flex-1">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/transactions" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="h-5 w-5" />
              Transactions
            </Button>
          </Link>
          <Link href="/dashboard/accounts" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wallet className="h-5 w-5" />
              Accounts
            </Button>
          </Link>
          <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        
        <div className="pt-4 mt-auto border-t space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={async () => {
                    setTheme("light");
                    await logout();
                    setOpen(false);
                }}
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
