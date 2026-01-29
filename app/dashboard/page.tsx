import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getTotalBalance } from "@/services/account.service"
import { getMonthlyStats, getRecentTransactions, getCashflowData } from "@/services/transaction.service"
import { format } from "date-fns"

// Helper to format money
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Client Component for Chart (Recharts needs client-side wrapper)
// We define it inline or separate file. For simplicity, we'll make a small wrapper component here?
// Actually, Recharts works in Server Components IF the component using it is 'use client'.
// But we want this page to be Server Side to fetch data.
// So we must extract the Chart to a separate Client Component.

import { DashboardCharts } from "@/components/features/dashboard/DashboardCharts"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  // Parallel Data Fetching
  const [totalBalance, monthlyStats, recentTransactions, cashflowData] = await Promise.all([
    getTotalBalance(user.id),
    getMonthlyStats(user.id),
    getRecentTransactions(user.id),
    getCashflowData(user.id)
  ])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across all accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyStats.income)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(monthlyStats.expense)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <WalletIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyStats.income - monthlyStats.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyStats.income - monthlyStats.expense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Chart Section (Client Component) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow History</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <DashboardCharts data={cashflowData} />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {recentTransactions.length === 0 ? (
                 <p className="text-sm text-gray-500">No transactions yet.</p>
               ) : (
                 recentTransactions.map((t) => (
                   <div key={t.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${t.category.color}20` }} // 20% opacity background
                        >
                          <span role="img" aria-label={t.category.name}>
                             {/* Basic mapping, in real app we use the icon slug */}
                             {t.category.icon === 'home' ? '🏠' : 
                              t.category.icon === 'utensils' ? '🍔' : 
                              t.category.icon === 'car' ? '🚗' : 
                              t.category.icon === 'wallet' ? '💰' : '📝'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.description || t.category.name}</p>
                          <p className="text-xs text-gray-500">{format(t.date, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                      </span>
                   </div>
                 ))
               )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function WalletIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-8Z" />
    </svg>
  )
}
