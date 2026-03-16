"use client";

import { motion } from "framer-motion";
import { ShoppingBasket, Plus } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";

/* Colores por badge */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-blue-500 text-white",
  bestseller: "bg-amber-400 text-white",
  viral: "bg-primary text-white",
  exclusivo: "bg-purple-500 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  bestseller: "Bestseller",
  viral: "Viral 🔥",
  exclusivo: "Exclusivo",
};

export const ProductCard = ({ candy }: { candy: Candy }) => {
  const { addToCart } = useCart();

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
        <div className="relative h-64 overflow-hidden bg-slate-50">
          <img
            src={candy.image}
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
            <span className="text-primary font-black text-lg">${candy.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-7 flex flex-col flex-1 gap-2 bg-white">
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
            {candy.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1 italic font-medium">
            "{candy.description}"
          </p>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(candy)}
            className="mt-4 w-full py-4 rounded-[2rem] bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
          >
            <ShoppingBasket className="w-5 h-5" />
            ¡Lo quiero!
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
