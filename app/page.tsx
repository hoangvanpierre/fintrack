"use client";

import Link from "next/link";
import { ArrowRight, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Custom "premium" ease
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative selection:bg-black selection:text-white">
      
      {/* Subtle Mesh Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-6 md:px-12 py-6 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Wallet className="w-4 h-4" />
          </div>
          FinTrack
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="#" className="hover:text-black transition-colors">Features</Link>
          <Link href="#" className="hover:text-black transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-black transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-slate-600 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/login">
            <Button size="sm" className="rounded-full px-5 bg-black hover:bg-slate-800 text-white transition-all hover:scale-105 active:scale-95">
              Start Free
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          {/* Headline */}
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Financial clarity, <br />
            <span className="text-slate-400">simplified.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-500 max-w-xl mb-10 leading-relaxed"
          >
            Track expenses, visualize income, and master your money flow with a minimalist dashboard designed for focus.
          </motion.p>

          {/* Input Group */}
          <motion.div variants={itemVariants} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
             <div className="relative flex-1">
                <Input 
                   type="email" 
                   placeholder="Enter your email..." 
                   className="h-12 rounded-full border-slate-200 px-6 focus-visible:ring-black focus-visible:ring-offset-0 bg-white shadow-sm"
                />
             </div>
             <Link href="/login" className="flex-shrink-0">
               <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 px-8 rounded-full bg-black text-white font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
               >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
               </motion.button>
             </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-16 flex flex-col items-center gap-4">
             <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Trusted by 10,000+ Users</p>
             <div className="flex gap-8 opacity-40 grayscale">
                {/* Simple geometric logo placeholders */}
                <div className="h-6 w-20 bg-slate-800 rounded opacity-20" />
                <div className="h-6 w-20 bg-slate-800 rounded opacity-20" />
                <div className="h-6 w-20 bg-slate-800 rounded opacity-20" />
                <div className="h-6 w-20 bg-slate-800 rounded opacity-20" />
             </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}