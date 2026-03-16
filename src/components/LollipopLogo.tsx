"use client";

import { motion } from "framer-motion";

export const LollipopLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <motion.div 
      className={`relative ${className} flex items-center justify-center`}
      whileHover={{ rotate: 15, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Background Circle (Red) */}
        <circle cx="50" cy="50" r="48" fill="#E31B23" stroke="white" strokeWidth="2" />
        
        {/* Spirals (Simplified and curved like the reference) */}
        <g opacity="0.9">
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C 60 30, 85 45, 95 50"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${i * 45} 50 50)`}
              className="opacity-80"
            />
          ))}
        </g>

        {/* Glossy Overlay */}
        <defs>
          <linearGradient id="gloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#gloss)" />
        
        {/* Small reflection dot */}
        <circle cx="30" cy="30" r="6" fill="white" fillOpacity="0.3" />
      </svg>
    </motion.div>
  );
};
