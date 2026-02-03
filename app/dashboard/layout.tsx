import { auth } from "@/lib/auth"
import { getUserAccounts } from "@/services/account.service"
import { getUserCategories } from "@/services/transaction.service"
import { GlassNavbar } from "@/components/features/layout/GlassNavbar"
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background"
import prisma from "@/lib/prisma"
import { ThemeRestorer } from "@/components/features/layout/ThemeRestorer"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user

  // Fetch data for the global Add Transaction button and Theme
  const [accounts, categories, dbUser] = user?.id ? await Promise.all([
    getUserAccounts(user.id),
    getUserCategories(user.id),
    prisma.user.findUnique({ where: { id: user.id }, select: { theme: true } })
  ]) : [[], [], null];

  return (
    <div className="min-h-screen flex flex-col relative">
      <ThemeRestorer userTheme={dbUser?.theme || "system"} />
      <MeshGradientBackground />
      <GlassNavbar user={user} accounts={accounts} categories={categories} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}