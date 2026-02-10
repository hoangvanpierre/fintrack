"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileJson } from "lucide-react"

export function DataManagement() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export your financial data or manage your privacy.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <div className="font-medium text-sm">Export Data</div>
                <div className="text-xs text-muted-foreground">Download all your transactions as a CSV file.</div>
            </div>
            <Button variant="outline" size="sm" disabled>
                <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
         </div>
      </CardContent>
    </Card>
  )
}
