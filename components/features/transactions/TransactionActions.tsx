"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { TransactionDialog } from "./TransactionDialog"
import { deleteTransaction } from "@/app/actions/transaction.actions"

interface TransactionActionsProps {
  transaction: any;
  categories: any[];
  accounts: any[];
}

export function TransactionActions({ transaction, categories, accounts }: TransactionActionsProps) {
   return (
     <div className="flex items-center justify-end">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <TransactionDialog 
                    categories={categories}
                    accounts={accounts}
                    initialData={transaction}
                    trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    }
                />
                
                <DropdownMenuItem onSelect={async () => {
                     if (confirm("Are you sure you want to delete?")) {
                        await deleteTransaction(transaction.id);
                     }
                }} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     </div>
   )
}
