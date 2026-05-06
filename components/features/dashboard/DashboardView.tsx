"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"
import { DashboardCharts, IncomeExpenseBarChart, ExpensePieChart } from "@/components/features/dashboard/DashboardCharts"
import { LiquidTabs } from "@/components/ui/liquid-tabs"
import { format } from "date-fns"

import { CalendarDateRangePicker } from "@/components/features/dashboard/DateRangePicker"
import { TransactionActions } from "../transactions/TransactionActions"

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
  user?: {
    name?: string | null
  }
  monthlyBudget: number
  totalBalance: number
  monthlyStats: { income: number; expense: number }
  recentTransactions: any[]
  cashflowData: any[]
  expenseByCategory: any[]
  incomeVsExpense: any[]
  categories: any[]
  accounts: any[]
  dateRange?: { from?: string; to?: string }
  selectedDate?: string
}

export function DashboardView({
  user,
  monthlyBudget,
  totalBalance,
  monthlyStats,
  recentTransactions,
  cashflowData,
  expenseByCategory,
  incomeVsExpense,
  categories,
  accounts,
  dateRange,
  selectedDate
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const isRangeFiltered = dateRange?.from || dateRange?.to
  const isSingleFiltered = !!selectedDate
  const isFiltered = isRangeFiltered || isSingleFiltered

  // Auto-refresh logic for month change
  useEffect(() => {
    const currentMonth = new Date().getMonth()
    
    // Check every hour if the month has changed
    const interval = setInterval(() => {
      const now = new Date()
      if (now.getMonth() !== currentMonth) {
        router.refresh()
      }
    }, 1000 * 60 * 60) // 1 hour check

    return () => clearInterval(interval)
  }, [router])

  const dateLabel = isSingleFiltered 
    ? format(new Date(selectedDate), 'MMMM d, yyyy')
    : isRangeFiltered
    ? `${dateRange?.from ? format(new Date(dateRange.from), 'MMM d, yyyy') : '...'} - ${dateRange?.to ? format(new Date(dateRange.to), 'MMM d, yyyy') : 'Present'}`
    : format(new Date(), 'MMMM yyyy') // Shows e.g. "May 2026"

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }
  
  // Budget Logic
  const budgetPercentage = monthlyBudget > 0 ? (monthlyStats.expense / monthlyBudget) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;
  const progressColor = isOverBudget ? 'bg-red-500' : 'bg-slate-900 dark:bg-slate-100';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
          {getTimeGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
            {isFiltered && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing results for <span className="font-medium text-primary">{dateLabel}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CalendarDateRangePicker />
            <LiquidTabs 
              tabs={["Overview", "Analytics", "Reports"]} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Budget Progress Bar (Only if budget is set and not filtered) */}
          {monthlyBudget > 0 && !isFiltered && (
            <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm overflow-hidden">
               <div className={`h-1 w-full ${isOverBudget ? 'bg-red-100' : 'bg-slate-100'}`}>
                  <div 
                    className={`h-full transition-all duration-500 ${progressColor}`} 
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }} 
                  />
               </div>
               <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Budget Status</p>
                    <p className="text-2xl font-bold">{formatCurrency(monthlyStats.expense)} <span className="text-muted-foreground text-sm font-normal">/ {formatCurrency(monthlyBudget)}</span></p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
                        {budgetPercentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{isOverBudget ? 'Over Budget' : 'Used'}</p>
                  </div>
               </CardContent>
            </Card>
          )}

          {/* Stats Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
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
            
            <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income ({isFiltered ? (isSingleFiltered ? 'Day' : 'Period') : 'Month'})</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyStats.income)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses ({isFiltered ? (isSingleFiltered ? 'Day' : 'Period') : 'Month'})</CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">-{formatCurrency(monthlyStats.expense)}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Savings ({isFiltered ? (isSingleFiltered ? 'Day' : 'Period') : 'Month'})</CardTitle>
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
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader>
                <CardTitle>Cash Flow {isFiltered ? (isSingleFiltered ? '(Day View)' : '(Filtered View)') : 'History'}</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                 <DashboardCharts data={cashflowData} />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader>
                <CardTitle>{isFiltered ? (isSingleFiltered ? 'Transactions for Date' : 'Transactions for Period') : 'Recent Transactions'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-[300px] overflow-y-auto pr-2 glass-scrollbar">
                   {recentTransactions.length === 0 ? (
                     <p className="text-sm text-muted-foreground">No transactions yet.</p>
                   ) : (
                     recentTransactions.map((t) => (
                       <div key={t.id} className="flex items-center justify-between group">
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
                              <p className="text-sm font-medium text-foreground">{t.category.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {t.description ? `${t.description} • ` : ''}{format(new Date(t.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(Number(t.amount))}
                            </span>
                            
                            <TransactionActions 
                                transaction={t} 
                                categories={categories} 
                                accounts={accounts} 
                            />
                          </div>
                       </div>
                     ))
                   )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Income vs Expense & Expense Breakdown */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
              <CardHeader>
                <CardTitle>Income vs Expense (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                 <IncomeExpenseBarChart data={incomeVsExpense} />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
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
