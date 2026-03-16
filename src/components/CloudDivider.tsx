"use client";

import { motion } from "framer-motion";

export const CloudDivider = ({ 
  color = "fill-white", 
  flip = false 
}: { 
  color?: string, 
  flip?: boolean 
}) => {
  return (
    <div className={`relative w-full overflow-hidden leading-[0] z-20 ${flip ? '-mb-2 rotate-180' : '-mt-2'}`}>
      <svg
        viewBox="0 0 1440 240"
        className={`relative block w-[102%] h-[120px] md:h-[240px] ${color}`}
        preserveAspectRatio="none"
      >
        {/* Triple layered organic clouds for maximum depth and smoothness */}
        <path d="M0,200 C150,150 300,240 450,200 C600,160 750,220 900,180 C1050,140 1200,230 1350,190 C1400,180 1440,190 1440,190 L1440,240 L0,240 Z" opacity="0.2" />
        <path d="M0,160 C250,200 500,120 750,160 C1000,200 1250,140 1440,180 L1440,240 L0,240 Z" opacity="0.4" />
        <path d="M0,190 C200,150 400,210 600,180 C800,150 1000,210 1200,170 C1350,150 1440,180 1440,180 L1440,240 L0,240 Z" />
      </svg>
    </div>
  );
};
