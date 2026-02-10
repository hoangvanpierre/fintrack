"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Mail, CalendarDays } from "lucide-react"
import { useState } from "react"
import { updateProfile } from "@/app/actions/settings.actions"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/lib/uploadthing"

interface ProfileCardProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    createdAt: Date
  }
}

export function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter()

  return (
    <Card className="bg-white/40 backdrop-blur-md border-white/20 shadow-sm overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20" />
      <CardContent className="relative pt-0 pb-8 px-6 text-center">
        <div className="relative -mt-16 mb-4 inline-block group">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={user.image || ""} className="object-cover" />
                <AvatarFallback className="text-4xl bg-slate-100 text-slate-400">
                    {user.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            
            {/* Upload Button Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                 <div className="transform scale-75">
                    <UploadButton
                        endpoint="imageUploader"
                        appearance={{
                            button: "bg-transparent text-white border-none hover:bg-transparent shadow-none p-0 text-xs font-semibold uppercase tracking-wider",
                            allowedContent: "hidden" 
                        }}
                        content={{
                            button({ ready }) {
                                if (ready) return <span className="text-xs">Change</span>;
                                return "..."
                            }
                        }}
                        onClientUploadComplete={async (res) => {
                            if (res && res[0]) {
                                await updateProfile({ name: user.name || "", financialGoal: "", imageUrl: res[0].url });
                                router.refresh();
                            }
                        }}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                 </div>
            </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-4">
            <Mail className="h-3 w-3" />
            <span>{user.email}</span>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <CalendarDays className="h-3 w-3" />
            <span>Member since {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
