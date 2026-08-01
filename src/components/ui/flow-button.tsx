"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FlowButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  glowColor?: "purple" | "green" | "red";
  children: React.ReactNode;
  className?: string;
}

export const FlowButton = React.forwardRef<HTMLButtonElement, FlowButtonProps>(
  (
    {
      variant = "primary",
      glowColor = "purple",
      children,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "secondary":
          return "bg-[#141416] text-white border border-white/15 hover:border-white/30";
        case "outline":
          return "bg-transparent text-white border border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/10";
        case "ghost":
          return "bg-transparent text-gray-300 hover:text-white hover:bg-white/5";
        case "primary":
        default:
          return "bg-gradient-to-r from-[#6441A5] via-[#8A2BE2] to-[#6441A5] text-white shadow-lg shadow-[#8A2BE2]/25";
      }
    };

    const getGlowStyles = () => {
      switch (glowColor) {
        case "green":
          return "from-[#00FF00] via-[#00FF00]/50 to-[#00FF00]";
        case "red":
          return "from-[#FF0033] via-[#FF0033]/50 to-[#FF0033]";
        case "purple":
        default:
          return "from-[#8A2BE2] via-[#6441A5] to-[#00FF00]";
      }
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        whileHover={disabled ? {} : { scale: 1.03 }}
        whileTap={disabled ? {} : { scale: 0.96 }}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-xl px-7 py-3.5 font-display font-bold text-sm tracking-wide transition-all duration-300 group cursor-pointer border border-transparent",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none shadow-none",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        {/* Animated Liquid Flow Border Aura */}
        <span
          className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-0 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none",
            getGlowStyles()
          )}
        />

        {/* Moving Flow Shimmer Light */}
        <span className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-marquee pointer-events-none" />

        {/* Content Container */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

FlowButton.displayName = "FlowButton";

export default FlowButton;
