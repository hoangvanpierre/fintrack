import { auth } from "@/lib/auth"
import { getTransactionsByUserId, getUserCategories } from "@/services/transaction.service"
import { getUserAccounts } from "@/services/account.service"
import { TransactionTable } from "@/components/features/transactions/TransactionTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TransactionsPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  // Parallel fetching
  const [rawTransactions, categories, accounts] = await Promise.all([
    getTransactionsByUserId(user.id),
    getUserCategories(user.id),
    getUserAccounts(user.id)
  ])

  const transactions = rawTransactions.map((t) => ({
    ...t,
    amount: t.amount.toNumber(),
    account: {
      ...t.account,
      balance: t.account.balance.toNumber(),
    },
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable 
            data={transactions as any[]} 
            categories={categories}
            accounts={accounts}
          />
        </CardContent>
      </Card>
    </div>
  )
}
