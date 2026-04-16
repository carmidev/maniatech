"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export const FloatingCart = ({ onClick }: { onClick: () => void }) => {
  const { totalItems } = useCart();
  const [shouldPulse, setShouldPulse] = useState(false);

  // Efecto de pulso cuando cambia el número de items
  useEffect(() => {
    if (totalItems > 0) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ 
            scale: shouldPulse ? 1.1 : 1, 
            opacity: 1, 
            y: 0 
          }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className="fixed bottom-8 right-8 z-[50] w-16 h-16 bg-brand-red text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white group"
        >
          <div className="relative">
            <ShoppingBasket className="w-7 h-7" />
            
            {/* Badge */}
            <motion.span 
              key={totalItems}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-primary"
            >
              {totalItems}
            </motion.span>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-brand-red/20 animate-ping -z-10 group-hover:hidden" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
