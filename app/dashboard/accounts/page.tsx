import { auth } from "@/lib/auth"
import { getUserAccounts } from "@/services/account.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Building2, CreditCard } from "lucide-react"
import { AccountDialog } from "@/components/features/accounts/AccountDialog"

export default async function AccountsPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  const accounts = await getUserAccounts(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <AccountDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
              {account.type === 'BANK' ? <Building2 className="h-4 w-4 text-muted-foreground" /> :
               account.type === 'WALLET' ? <CreditCard className="h-4 w-4 text-muted-foreground" /> :
               <Wallet className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(account.balance)}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {account.type.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
