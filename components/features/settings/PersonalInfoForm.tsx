"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { updateProfile } from "@/app/actions/settings.actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface PersonalInfoFormProps {
  defaultName: string
  defaultGoal: string
}

export function PersonalInfoForm({ defaultName, defaultGoal }: PersonalInfoFormProps) {
  const [name, setName] = useState(defaultName)
  const [goal, setGoal] = useState(defaultGoal)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await updateProfile({ name, financialGoal: goal })
    setLoading(false)
    router.refresh()
  }

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your public profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Financial Goal / Job Title</Label>
            <Input 
                id="goal" 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)} 
                placeholder="e.g. Saving for a Tesla"
            />
          </div>
          <div className="flex justify-end">
             <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
