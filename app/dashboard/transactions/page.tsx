import { auth } from "@/lib/auth"
import { getTransactionsByUserId } from "@/services/transaction.service"
import { TransactionTable } from "@/components/features/transactions/TransactionTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TransactionsPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  const rawTransactions = await getTransactionsByUserId(user.id)
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

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable data={transactions as any[]} />
        </CardContent>
      </Card>
    </div>
  )
}
