"use client";

import Link from "next/link";
import { ArrowRight, Wallet, CheckCircle2, BarChart3, ShieldCheck, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Home() {
  return (
    <div className="bg-white text-slate-900 selection:bg-black selection:text-white">
      
      {/* Navbar - Fixed or Absolute? Keeping Absolute for Hero merge */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-6 md:px-12 py-6 z-50">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-[-0.085em] text-slate-900">
          fintrack
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="#" className="hover:text-black transition-colors">Home</Link>
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="#" className="text-lg font-medium">Home</Link>
                <Link href="#features" className="text-lg font-medium">Features</Link>
                <Link href="#pricing" className="text-lg font-medium">Pricing</Link>
                <hr />
                <Link href="/login" className="text-lg font-medium">Log in</Link>
                <Link href="/login">
                  <Button className="w-full rounded-full">Get Started</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4 hidden md:flex">
          <Link href="/login" className="text-sm font-medium hover:text-slate-600 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/login">
            <Button size="sm" className="rounded-full px-5 bg-black hover:bg-slate-800 text-white transition-all hover:scale-105 active:scale-95">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* SECTION 1: Hero (Original Style) */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
        {/* Subtle Mesh Gradients - Localized to Hero */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl flex flex-col items-center relative z-10"
        >
          {/* Headline */}
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl font-serif tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Master Your Money <br />
            <span className="text-slate-400">Without the Stress</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl font-serif text-slate-500 max-w-2xl mb-10 leading-relaxed"
          >
            Track expenses, visualize income, and master your money flow with a minimalist dashboard designed for focus.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
               <Button className="rounded-full h-12 px-8 text-base bg-black text-white hover:bg-slate-800 w-full">
                 Start Tracking Free
               </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
               <Button variant="outline" className="rounded-full h-12 px-8 text-base w-full">
                 Learn More
               </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: Features (Different Color: Slate-50) */}
      <section id="features" className="py-24 bg-slate-50 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Everything you need, nothing you don't.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We stripped away the clutter to focus on the three pillars of personal finance: Clarity, Control, and Consistency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: BarChart3, title: "Visual Analytics", desc: "See exactly where your money goes with beautiful, interactive charts." },
               { icon: ShieldCheck, title: "Secure & Private", desc: "Your financial data is encrypted and never sold to third parties." },
               { icon: Zap, title: "Lightning Fast", desc: "Add transactions in seconds with our optimized keyboard-first interface." }
             ].map((feature, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                   <feature.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                 <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Stats / Trust (Different Color: White) */}
      <section className="py-24 bg-white px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif">Join thousands of smart savers.</h2>
            <p className="text-slate-500 text-lg">FinTrack helps users save an average of $200/month by simply making their spending visible.</p>
            
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold">$2M+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Tracked</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-100 rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
             {/* Abstract placeholder visual */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50" />
             <div className="relative z-10 text-center">
                <span className="text-6xl">🙌</span>
                <p className="mt-4 font-medium text-slate-600">"Finally, a finance app that doesn't feel like a spreadsheet."</p>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA (Different Color: Black/Dark) */}
      <section className="py-24 bg-slate-900 text-white px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
           <h2 className="text-3xl md:text-5xl font-serif">Ready to take control?</h2>
           <p className="text-slate-400 text-lg">Start tracking your expenses today. No credit card required.</p>
           <Link href="/login" className="inline-block">
             <Button className="rounded-full h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-200">
               Create Free Account
             </Button>
           </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-500 border-t border-slate-800 text-center text-sm">
        <p>© {new Date().getFullYear()} FinTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
