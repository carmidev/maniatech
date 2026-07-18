"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Plus, Check, Coffee } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";

/* Colores por badge */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-brand-blue text-brand-darkgray",
  bestseller: "bg-secondary text-white",
  viral: "bg-brand-blue text-brand-darkgray",
  exclusivo: "bg-brand-brown text-white",
  top: "bg-primary text-white",
  menu: "bg-brand-darkgray text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  bestseller: "Bestseller",
  viral: "Nuevo",
  exclusivo: "Exclusivo",
  top: "🔥 Lo más vendido",
  menu: "Menú",
};

const renderWithNumberFont = (text: string) => {
  return text.split(/(\d+)/).map((part, i) => {
    if (/\d+/.test(part)) {
      return <span key={i} className="font-numbers font-semibold tracking-normal leading-normal">{part}</span>;
    }
    return part;
  });
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
    if (candy.stock === 0) return;
    addToCart(candy);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = candy.stock === 0;

  // Determinar el badge en base a las categorías o usar el asignado por defecto
  let activeBadges: string[] = [];
  if (candy.badge) {
    activeBadges = [candy.badge];
  } else {
    const cats = Array.isArray(candy.category) ? candy.category : [candy.category];
    const safeCats = cats.map(c => (c || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());
    if (safeCats.includes("viral")) activeBadges.push("viral");
    if (safeCats.includes("nuevo")) activeBadges.push("nuevo");
    if (safeCats.includes("top") || safeCats.includes("tendencias") || safeCats.includes("lo mas vendido") || safeCats.includes("lo_mas_vendido")) activeBadges.push("top");
    if (safeCats.includes("bestseller")) activeBadges.push("bestseller");
    activeBadges = Array.from(new Set(activeBadges));
  }
  const isMenu = activeBadges.includes('menu') || candy.badge === 'menu';

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
          className="relative h-48 sm:h-64 overflow-hidden bg-white p-4 sm:p-6 cursor-pointer"
          onClick={() => onOpenDetails?.(candy)}
        >
          <img
            src={getImagePath(candy.images[0]) || undefined}
            alt={candy.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge flotante */}
          {activeBadges.length > 0 && (
            <div className="absolute top-5 left-5 flex flex-col gap-2 items-start z-10 pointer-events-none">
              {activeBadges.map(badge => BADGE_LABELS[badge] ? (
                <span
                  key={badge}
                  className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg ${BADGE_STYLES[badge]}`}
                >
                  {BADGE_LABELS[badge]}
                </span>
              ) : null)}
            </div>
          )}

          {candy.flavor && candy.flavor.toLowerCase() !== 'original' && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1.5 z-10">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                {`Sabor: ${candy.flavor}`}
              </span>
            </div>
          )}

          {!isMenu && (
            <div className="absolute bottom-5 right-3 sm:right-5 flex flex-col items-end gap-1">
              <div className="bg-brand-red text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg z-10">
                -10% OFF
              </div>
              <div className="bg-white/95 backdrop-blur px-2 sm:px-3 py-1 rounded-2xl shadow-md border border-white/50 flex flex-col items-end leading-tight mt-[-6px]">
                <span className="text-slate-400 font-numbers text-[10px] sm:text-xs line-through decoration-slate-300">ref {candy.price.toFixed(2)}</span>
                <span className="text-primary font-numbers font-bold text-base sm:text-xl">ref {(candy.price * 0.9).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 sm:p-7 flex flex-col flex-1 gap-1 sm:gap-2 bg-white">
          <h3 className="text-base sm:text-xl font-display text-brand-darkgray leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
            <span>{renderWithNumberFont(candy.name)}</span>
            {isMenu && <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
          </h3>
          {candy.flavor && candy.flavor.toLowerCase() !== 'original' && (
            <div className="flex items-center mb-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-[#eab8ac]/30 text-[#633c32] border border-[#eab8ac]/50">
                {`Sabor: ${candy.flavor}`}
              </span>
            </div>
          )}
          <p className="text-xs sm:text-sm font-body font-normal text-brand-darkgray/70 line-clamp-2 leading-relaxed flex-1">
            {candy.description}
          </p>

          {!isMenu && (
            <motion.button
              whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`mt-2 sm:mt-4 w-full py-2.5 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-[10px] sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg ${isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : isAdded
                  ? "bg-green-500 text-white shadow-green-500/30"
                  : "bg-brand-red text-white hover:opacity-90 shadow-brand-red/20"
                }`}
            >
              <AnimatePresence mode="wait">
                {isOutOfStock ? (
                  <motion.div
                    key="out"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span>Agotado</span>
                  </motion.div>
                ) : isAdded ? (
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
          )}
        </div>
      </div>
    </motion.div>
  );
};
