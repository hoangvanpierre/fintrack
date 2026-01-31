"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiquidTabsProps {
  tabs: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
  className?: string
}

export function LiquidTabs({ tabs, activeTab, setActiveTab, className }: LiquidTabsProps) {
  return (
    <div className={cn("inline-flex bg-white/10 backdrop-blur-md backdrop-saturate-150 border border-white/20 p-1 rounded-full", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.toLowerCase()
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10",
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/40 shadow-sm backdrop-blur-sm border border-white/20 rounded-full -z-10"
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 30,
                }}
              />
            )}
            {tab}
          </button>
        )
      })}
    </div>
  )
}