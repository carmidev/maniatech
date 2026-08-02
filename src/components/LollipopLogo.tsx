"use client";

import { motion } from "framer-motion";
import { getImagePath } from "@/utils/imagePath";

export const LollipopLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <motion.div 
      className={`relative ${className} flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={getImagePath("/images/logo maniatech.png")}
        alt="Mania Tech Logo"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain drop-shadow-lg"
      />
    </motion.div>
  );
};
