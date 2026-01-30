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
}

export function TransactionTable({ data }: Props) {
  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
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
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(Number(t.amount))}
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
