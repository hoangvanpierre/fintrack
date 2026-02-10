"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { updateBudget } from "@/app/actions/settings.actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { CurrencySelector } from "./CurrencySelector"

interface FinancialSettingsFormProps {
  defaultBudget: number
  defaultCurrency: string
}

export function FinancialSettingsForm({ defaultBudget, defaultCurrency }: FinancialSettingsFormProps) {
  const [budget, setBudget] = useState(defaultBudget.toString())
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBudgetSave = async () => {
    setLoading(true)
    await updateBudget(parseFloat(budget) || 0)
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
      <CardHeader>
        <CardTitle>Financial Settings</CardTitle>
        <CardDescription>Configure your budget and currency preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5">
                <Label className="text-base">Primary Currency</Label>
                <p className="text-sm text-muted-foreground">Used for all calculations and displays.</p>
            </div>
            <CurrencySelector defaultCurrency={defaultCurrency} />
        </div>
        
        <div className="space-y-2 pt-4 border-t border-slate-200/50">
           <Label htmlFor="budget">Monthly Spending Limit Target</Label>
           <div className="flex gap-2">
              <Input 
                id="budget"
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
                placeholder="10000000"
              />
              <Button onClick={handleBudgetSave} disabled={loading}>
                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
           </div>
           <p className="text-xs text-muted-foreground">We&apos;ll show you a progress bar on the dashboard.</p>
        </div>
      </CardContent>
    </Card>
  )
}
