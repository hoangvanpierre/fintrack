import { auth } from "@/lib/auth"
import { getTotalBalance } from "@/services/account.service"
import { 
  getStats, 
  getRecentTransactions, 
  getCashflowData,
  getExpenseByCategory,
  getIncomeVsExpense
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

  const { from, to } = await searchParams as { from?: string, to?: string };

  // Parallel Data Fetching
  const [
    totalBalance, 
    monthlyStats, 
    recentTransactions, 
    cashflowData,
    expenseByCategory,
    incomeVsExpense
  ] = await Promise.all([
    getTotalBalance(user.id),
    getStats(user.id, from, to),
    getRecentTransactions(user.id, from, to),
    getCashflowData(user.id, from, to),
    getExpenseByCategory(user.id, from, to),
    getIncomeVsExpense(user.id, from, to)
  ])

  return (
    <DashboardView 
      totalBalance={totalBalance}
      monthlyStats={monthlyStats}
      recentTransactions={recentTransactions.map(t => ({ ...t, amount: t.amount.toNumber() }))}
      cashflowData={cashflowData}
      expenseByCategory={expenseByCategory}
      incomeVsExpense={incomeVsExpense}
    />
  )
}