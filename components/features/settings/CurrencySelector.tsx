"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateCurrency } from "@/app/actions/settings.actions"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function CurrencySelector({ defaultCurrency }: { defaultCurrency: string }) {
    const [loading, setLoading] = useState(false);

    const handleValueChange = async (value: string) => {
        setLoading(true);
        await updateCurrency(value);
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-4">
            <Select onValueChange={handleValueChange} defaultValue={defaultCurrency} disabled={loading}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="VND">VND (₫)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
            </Select>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
    )
}
