import { auth } from "@/lib/auth"
import { getUserAccounts } from "@/services/account.service"
import { getUserCategories } from "@/services/transaction.service"
import { GlassNavbar } from "@/components/features/layout/GlassNavbar"
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background"

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
    <div className="min-h-screen flex flex-col relative">
      <MeshGradientBackground />
      <GlassNavbar user={user} accounts={accounts} categories={categories} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}