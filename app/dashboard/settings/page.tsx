import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ProfileCard } from "@/components/features/settings/ProfileCard"
import { PersonalInfoForm } from "@/components/features/settings/PersonalInfoForm"
import { FinancialSettingsForm } from "@/components/features/settings/FinancialSettingsForm"
import { SecuritySettings } from "@/components/features/settings/SecuritySettings"
import { DataManagement } from "@/components/features/settings/DataManagement"
import { DangerZone } from "@/components/features/settings/DangerZone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/theme-toggle"

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  // Fetch full user profile
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
        accounts: {
            select: { provider: true }
        }
    }
  });

  if (!dbUser) return null;

  // Convert Decimal to Number for Client Components
  const serializedUser = {
    ...dbUser,
    monthlyBudget: dbUser.monthlyBudget ? dbUser.monthlyBudget.toNumber() : null,
  }

  const providers = dbUser.accounts.map(a => a.provider);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: 1/3 */}
        <div className="md:col-span-1 space-y-6">
            <ProfileCard user={serializedUser} />
        </div>

        {/* Right Column: 2/3 */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Card 1: Personal Info */}
            <PersonalInfoForm 
                defaultName={dbUser.name || ""} 
                defaultGoal={dbUser.financialGoal || ""} 
            />

            {/* Card 2: Financial Settings (Budget + Currency) */}
            <FinancialSettingsForm 
                defaultBudget={serializedUser.monthlyBudget || 0}
                defaultCurrency={dbUser.currency}
            />

            {/* Appearance (Moved here to fill space) */}
            <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">Theme Preference</div>
                        <div className="text-sm text-muted-foreground">Switch between light and dark mode.</div>
                    </div>
                    <ModeToggle />
                </CardContent>
            </Card>

            {/* Security Settings */}
            <SecuritySettings 
                email={dbUser.email || ""} 
                providers={providers} 
            />

            {/* Card 3: Data Management */}
            <DataManagement />

            {/* Card 4: Danger Zone */}
            <DangerZone />
        </div>
      </div>
    </div>
  )
}