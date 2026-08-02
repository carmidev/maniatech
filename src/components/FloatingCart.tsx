"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle2, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export const FloatingCart = ({ onClick }: { onClick: () => void }) => {
  const router = useRouter();
  const { totalItems, totalPrice } = useCart();
  const [shouldPulse, setShouldPulse] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const prevItemsRef = useRef(totalItems);

  // Prefetch preventivo del checkout cuando hay items
  useEffect(() => {
    if (totalItems > 0) {
      router.prefetch("/checkout");
    }
  }, [totalItems, router]);

  // Efecto de pulso y notificación cuando se agregan items
  useEffect(() => {
    if (totalItems > prevItemsRef.current) {
      setShouldPulse(true);
      setShowToast(true);
      
      const pulseTimer = setTimeout(() => setShouldPulse(false), 300);
      const toastTimer = setTimeout(() => setShowToast(false), 4000); // Se oculta a los 4s
      
      prevItemsRef.current = totalItems;
      
      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(toastTimer);
      };
    } else {
      prevItemsRef.current = totalItems;
    }
  }, [totalItems]);

  return (
    <div className="fixed bottom-[90px] md:bottom-[100px] right-6 md:right-8 z-[50] flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Notificación (Toast) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="pointer-events-auto origin-bottom-right"
          >
            <button 
              onClick={() => {
                setShowToast(false);
                onClick();
              }}
              className="bg-[#141418] border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl shadow-black/50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all text-white cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#00FF00]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-black text-white leading-none">¡Agregado a tu carrito!</span>
                <span className="text-[10px] text-gray-400 font-medium mt-1">Toca aquí para ver tu pedido</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ 
              scale: shouldPulse ? 1.05 : 1, 
              opacity: 1, 
              y: 0 
            }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="pointer-events-auto flex items-center justify-between gap-4 bg-[#8A2BE2] hover:bg-[#6441A5] text-white pl-6 pr-4 py-3 md:py-3.5 rounded-full shadow-2xl shadow-[#8A2BE2]/40 group relative shrink-0 min-w-[180px] border border-white/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-display font-bold text-sm md:text-base whitespace-nowrap">Ir al carrito</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="font-numbers font-black text-sm md:text-base leading-none pt-0.5">$ {totalPrice.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Badge superior opcional para seguir viendo la cantidad total visualmente (Verde Neón con texto negro ultra nítido) */}
            <motion.span 
              key={totalItems}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-[#00FF00] text-[#0B0B0C] text-[11px] md:text-xs font-black w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full shadow-lg shadow-[#00FF00]/50 border-2 border-[#0B0B0C]"
            >
              {totalItems}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
