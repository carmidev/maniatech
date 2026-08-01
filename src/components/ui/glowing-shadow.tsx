"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowingShadowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "green" | "red" | "custom";
  customColor?: string;
  spread?: number;
  glowOpacity?: number;
}

export const GlowingShadow = ({
  children,
  className,
  glowColor = "purple",
  customColor,
}: GlowingShadowProps) => {
  const getGlowStyles = () => {
    switch (glowColor) {
      case "green":
        return "from-[#00FF00]/30 via-[#00FF00]/10 to-transparent group-hover:from-[#00FF00]/50 group-hover:via-[#00FF00]/20";
      case "red":
        return "from-[#FF0033]/30 via-[#FF0033]/10 to-transparent group-hover:from-[#FF0033]/50 group-hover:via-[#FF0033]/20";
      case "purple":
      default:
        return "from-[#8A2BE2]/35 via-[#6441A5]/20 to-transparent group-hover:from-[#8A2BE2]/60 group-hover:via-[#6441A5]/30";
    }
  };

  return (
    <div className={cn("relative group/shadow rounded-3xl", className)}>
      {/* Background Glowing Aura Layer */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-[inherit] bg-gradient-to-r opacity-70 blur-xl transition-all duration-500 group-hover/shadow:opacity-100 group-hover/shadow:blur-2xl pointer-events-none z-0",
          getGlowStyles()
        )}
      />

      {/* Inner Glowing Border Beam Highlight */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] border border-white/10 bg-gradient-to-tr transition-colors duration-500 pointer-events-none z-10",
          glowColor === "green" && "group-hover/shadow:border-[#00FF00]/50",
          glowColor === "red" && "group-hover/shadow:border-[#FF0033]/50",
          glowColor === "purple" && "group-hover/shadow:border-[#8A2BE2]/50"
        )}
      />

      {/* Content wrapper */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

export default GlowingShadow;
