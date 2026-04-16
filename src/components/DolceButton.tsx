"use client";

import * as React from "react";
import { HTMLMotionProps, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dolceButtonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-black text-sm tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E31B23]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-red text-white shadow-xl shadow-brand-red/40 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-white/10 before:to-transparent before:opacity-0 before:transition-opacity hover:shadow-2xl hover:shadow-brand-red/50 hover:before:opacity-100 active:shadow-lg",
        secondary:
          "border-[3px] border-brand-red bg-white text-brand-red shadow-lg shadow-brand-red/10 backdrop-blur-sm hover:bg-brand-red hover:text-white hover:shadow-xl hover:shadow-brand-red/40 active:shadow-md",
        ghost:
          "text-brand-red backdrop-blur-sm hover:bg-brand-red/10 hover:shadow-lg hover:shadow-brand-red/20 active:bg-brand-red/20",
      },
      size: {
        default: "h-14 px-8 py-4 rounded-full",
        sm: "h-11 px-6 py-2 rounded-full",
        lg: "h-16 px-10 py-5 rounded-full text-base",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface DolceButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof dolceButtonVariants> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

const DolceButton = React.forwardRef<HTMLButtonElement, DolceButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    };

    const background = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.2), transparent 70%)`;

    return (
      <motion.button
        className={cn(dolceButtonVariants({ variant, size, className }))}
        ref={ref}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {variant === "primary" && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {Icon && iconPosition === "left" && <Icon className={cn(size === 'sm' ? "w-4 h-4" : "w-5 h-5")} />}
          {children}
          {Icon && iconPosition === "right" && <Icon className={cn(size === 'sm' ? "w-4 h-4" : "w-5 h-5")} />}
        </span>
      </motion.button>
    );
  }
);

DolceButton.displayName = "DolceButton";

export { DolceButton, dolceButtonVariants };
