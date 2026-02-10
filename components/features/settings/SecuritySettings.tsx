"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Globe, Mail } from "lucide-react"

interface SecuritySettingsProps {
  email: string
  providers: string[]
}

export function SecuritySettings({ email, providers }: SecuritySettingsProps) {
  const isGoogleLinked = providers.includes("google")
  const isEmailLinked = !!email // Simplified assumption, usually true if they have an email

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
      <CardHeader>
        <CardTitle>Session & Security</CardTitle>
        <CardDescription>Manage your sign-in methods and account security.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
            <h3 className="text-sm font-medium">Linked Accounts</h3>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Globe className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Google Account</p>
                        <p className="text-xs text-muted-foreground">{isGoogleLinked ? "Connected" : "Not connected"}</p>
                    </div>
                </div>
                {isGoogleLinked ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                    </Badge>
                ) : (
                    <Button variant="outline" size="sm" disabled>Connect</Button>
                )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-white/50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Mail className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Email Address</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                     <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                </Badge>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50">
             <Button variant="outline" className="w-full" disabled>Change Password (Coming Soon)</Button>
        </div>
      </CardContent>
    </Card>
  )
}
