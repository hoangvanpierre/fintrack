"use client"

import { motion } from "framer-motion"

export function MeshGradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white overflow-hidden isolate">
      {/* Texture Layer for Glass Effect */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Top Left - Blue/Cyan Orb */}
      <motion.div 
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/20 blur-[120px]"
      />

      {/* Top Right - Pink/Reddish Orb */}
      <motion.div 
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -top-[5%] -right-[5%] w-[45vw] h-[45vw] rounded-full bg-pink-400/20 blur-[120px]"
      />

      {/* Center/Bottom - Purple Blend Orb */}
      <motion.div 
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-400/20 blur-[130px] opacity-70"
      />
      
      {/* Optional: Extra subtle orb for more complexity */}
      <motion.div 
        animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
        }}
        transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-indigo-300/10 blur-[100px]"
      />
    </div>
  )
}
