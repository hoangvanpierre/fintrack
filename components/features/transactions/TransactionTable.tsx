"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { TransactionActions } from "./TransactionActions"

interface Transaction {
  id: string
  description: string | null
  amount: any
  date: Date
  type: "INCOME" | "EXPENSE"
  category: {
    name: string
    color: string | null
  }
  account: {
    name: string
  }
}

interface Props {
  data: Transaction[]
  categories: any[]
  accounts: any[]
}

export function TransactionTable({ data, categories, accounts }: Props) {
  return (
    <div className="rounded-md border border-white/20 bg-transparent overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium">{t.description || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: t.category.color || "#ccc" }}
                    />
                    {t.category.name}
                  </div>
                </TableCell>
                <TableCell>{t.account.name}</TableCell>
                <TableCell className={`text-right font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(Number(t.amount))}
                </TableCell>
                <TableCell>
                  <TransactionActions 
                    transaction={t} 
                    categories={categories} 
                    accounts={accounts} 
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
