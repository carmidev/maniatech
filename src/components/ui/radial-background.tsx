"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const RadialBackground = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 -z-10 size-full overflow-hidden bg-[#0B0B0C] pointer-events-none", className)}>
      
      {/* 1. Main Animated Radial Gradient Mesh */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 size-full [background:radial-gradient(125%_125%_at_50%_10%,#0B0B0C_35%,#8A2BE2_100%)] opacity-90"
      />

      {/* 2. Floating Animated Light Orbs */}
      <motion.div
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8A2BE2]/30 rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          x: [50, -50, 50],
          y: [30, -30, 30],
          scale: [0.9, 1.15, 0.9],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#6441A5]/25 rounded-full blur-[150px]"
      />

      {/* 3. Subtle Animated Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
};
