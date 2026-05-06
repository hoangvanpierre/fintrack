import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getTotalBalance, getUserAccounts } from "@/services/account.service"
import { 
  getStats, 
  getRecentTransactions, 
  getCashflowData,
  getExpenseByCategory,
  getIncomeVsExpense,
  getUserCategories
} from "@/services/transaction.service"
import { DashboardView } from "@/components/features/dashboard/DashboardView"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  const { from, to, date } = await searchParams as { from?: string, to?: string, date?: string };

  // Parallel Data Fetching
  const [
    totalBalance, 
    monthlyStats, 
    recentTransactions, 
    cashflowData,
    expenseByCategory,
    incomeVsExpense,
    categories,
    accounts,
    dbUser
  ] = await Promise.all([
    getTotalBalance(user.id),
    getStats(user.id, date, from, to),
    getRecentTransactions(user.id, date, from, to),
    getCashflowData(user.id, date, from, to),
    getExpenseByCategory(user.id, date, from, to),
    getIncomeVsExpense(user.id, date, from, to),
    getUserCategories(user.id),
    getUserAccounts(user.id),
    prisma.user.findUnique({ where: { id: user.id }, select: { monthlyBudget: true } })
  ])

  return (
    <DashboardView 
      user={user}
      monthlyBudget={dbUser?.monthlyBudget?.toNumber() || 0}
      totalBalance={totalBalance}
      monthlyStats={monthlyStats}
      recentTransactions={recentTransactions.map(t => ({ ...t, amount: t.amount.toNumber() }))}
      cashflowData={cashflowData}
      expenseByCategory={expenseByCategory}
      incomeVsExpense={incomeVsExpense}
      categories={categories}
      accounts={accounts}
      dateRange={{ from, to }}
      selectedDate={date}
    />
  )
}