import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ModeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/features/settings/CurrencySelector"

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return null

  // Fetch fresh user data to get currency
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { currency: true }
  });

  const currency = dbUser?.currency || "VND";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how FinTrack looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">Theme</div>
                        <div className="text-sm text-muted-foreground">Select your preferred theme (Light, Dark, or System).</div>
                    </div>
                    <ModeToggle />
                </div>
            </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="bg-white/20 backdrop-blur-md border-white/20 shadow-sm">
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your regional and display preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="text-sm font-medium">Currency</div>
                        <div className="text-sm text-muted-foreground">Select the currency for your transactions and reports.</div>
                    </div>
                    <CurrencySelector defaultCurrency={currency} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
