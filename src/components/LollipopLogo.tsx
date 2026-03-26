"use client";

import { motion } from "framer-motion";
import { getImagePath } from "@/utils/imagePath";

export const LollipopLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <motion.div 
      className={`relative ${className} flex items-center justify-center`}
      whileHover={{ rotate: 15, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={getImagePath("/images/logo-oficial.png")}
        alt="Dolce Candy Oficial Logo"
        className="w-full h-full object-contain drop-shadow-md"
      />
    </motion.div>
  );
};
