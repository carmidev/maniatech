"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Plus, Check } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";

/* Colores por badge */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-brand-blue text-brand-darkgray",
  bestseller: "bg-secondary text-white",
  viral: "bg-primary text-white",
  exclusivo: "bg-brand-brown text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  bestseller: "Bestseller",
  viral: "Viral 🔥",
  exclusivo: "Exclusivo",
};

export const ProductCard = ({ 
  candy, 
  onOpenDetails 
}: { 
  candy: Candy;
  onOpenDetails?: (candy: Candy) => void; 
}) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(candy);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative group bg-white shadow-soft transition-all duration-500 overflow-hidden"
      style={{ 
        borderRadius: '3.5rem 1.5rem 3.5rem 1.5rem',
      }}
    >
      <div className="flex flex-col h-full rounded-[3.5rem_1.5rem_3.5rem_1.5rem] border border-black/5 bg-white overflow-hidden relative">
        
        {/* Imagen con Aspect Ratio divertido */}
        <div 
          className="relative h-64 overflow-hidden bg-slate-50 cursor-pointer"
          onClick={() => onOpenDetails?.(candy)}
        >
          <img
            src={getImagePath(candy.images[0]) || undefined}
            alt={candy.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badge flotante */}
          {candy.badge && (
            <span
              className={`absolute top-5 left-5 text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg ${BADGE_STYLES[candy.badge]}`}
            >
              {BADGE_LABELS[candy.badge]}
            </span>
          )}

          {/* Precio Flotante */}
          <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-3 py-1 rounded-2xl shadow-md border border-white/50">
            <span className="text-primary font-numbers font-semibold text-xl">${candy.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-7 flex flex-col flex-1 gap-2 bg-white">
          <h3 className="text-xl font-display text-brand-darkgray leading-tight group-hover:text-primary transition-colors">
            {candy.name}
          </h3>
          <p className="text-sm font-body font-normal text-brand-darkgray/70 line-clamp-2 leading-relaxed flex-1">
            {candy.description}
          </p>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`mt-4 w-full py-4 rounded-[2rem] font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
              isAdded 
                ? "bg-green-500 text-white shadow-green-500/30" 
                : "bg-brand-red text-white hover:opacity-90 shadow-brand-red/20"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>¡Agregado a la cesta!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="basket"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBasket className="w-5 h-5" />
                  <span>¡Lo quiero!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
