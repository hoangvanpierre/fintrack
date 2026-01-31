"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import { DashboardCharts, IncomeExpenseBarChart, ExpensePieChart } from "@/components/features/dashboard/DashboardCharts"
import { LiquidTabs } from "@/components/ui/liquid-tabs"
import { format } from "date-fns"

import { CalendarDateRangePicker } from "@/components/features/dashboard/DateRangePicker"

// Helper to format money
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
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

interface DashboardViewProps {
  totalBalance: number
  monthlyStats: { income: number; expense: number }
  recentTransactions: any[]
  cashflowData: any[]
  expenseByCategory: any[]
  incomeVsExpense: any[]
}

export function DashboardView({
  totalBalance,
  monthlyStats,
  recentTransactions,
  cashflowData,
  expenseByCategory,
  incomeVsExpense
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CalendarDateRangePicker />
          <LiquidTabs 
            tabs={["Overview", "Analytics", "Reports"]} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
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
            
            <Card className="bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income (This Month)</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyStats.income)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses (This Month)</CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">-{formatCurrency(monthlyStats.expense)}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
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

          {/* Row 2: Cash Flow & Recent Transactions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle>Cash Flow History</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                 <DashboardCharts data={cashflowData} />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-[300px] overflow-y-auto pr-2 glass-scrollbar">
                   {recentTransactions.length === 0 ? (
                     <p className="text-sm text-gray-500">No transactions yet.</p>
                   ) : (
                     recentTransactions.map((t) => (
                       <div key={t.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm"
                              style={{ backgroundColor: t.category.color || '#eee' }} 
                            >
                              <span role="img" aria-label={t.category.name} className="text-white drop-shadow-sm">
                                 {/* Basic mapping */}
                                 {t.category.icon === 'home' ? '🏠' : 
                                  t.category.icon === 'utensils' ? '🍔' : 
                                  t.category.icon === 'car' ? '🚗' : 
                                  t.category.icon === 'wallet' ? '💰' : '📝'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t.description || t.category.name}</p>
                              <p className="text-xs text-gray-500">{format(new Date(t.date), 'MMM d, yyyy')}</p>
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

          {/* Row 3: Income vs Expense & Expense Breakdown */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle>Income vs Expense (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                 <IncomeExpenseBarChart data={incomeVsExpense} />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/20 backdrop-blur-md border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                 <ExpensePieChart data={expenseByCategory} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="h-[400px] flex items-center justify-center border rounded-lg bg-white/20 backdrop-blur-md border-dashed border-white/20">
          <p className="text-muted-foreground">Analytics dashboard is coming soon.</p>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="h-[400px] flex items-center justify-center border rounded-lg bg-white/20 backdrop-blur-md border-dashed border-white/20">
          <p className="text-muted-foreground">Reports and exports are coming soon.</p>
        </div>
      )}
    </div>
  )
}
