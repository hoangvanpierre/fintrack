import { auth, signOut } from "@/lib/auth"
import Link from "next/link"
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserAccounts } from "@/services/account.service"
import { getUserCategories } from "@/services/transaction.service"
import { TransactionDialog } from "@/components/features/transactions/TransactionDialog"
import { UserNav } from "@/components/features/layout/UserNav"
import { MobileNav } from "@/components/features/layout/MobileNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user

  // Fetch data for the global Add Transaction button
  const [accounts, categories] = user?.id ? await Promise.all([
    getUserAccounts(user.id),
    getUserCategories(user.id)
  ]) : [[], []];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold tracking-[-0.085em] text-gray-900">
            fintrack
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </Button>
          </Link>
          <Link href="/dashboard/accounts">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Wallet className="h-4 w-4" />
              Accounts
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </form>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:hidden">
          <span className="text-xl font-bold tracking-[-0.085em] text-gray-900">fintrack</span>
          <MobileNav user={user || {}} />
        </header>

        {/* Header - Desktop (User Menu) */}
        <header className="h-16 border-b bg-white hidden md:flex items-center justify-end px-8 gap-4">
           <TransactionDialog categories={categories} accounts={accounts} />

           <UserNav user={user || {}} />
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}