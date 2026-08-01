"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Zap, Star } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";
import { BorderBeam } from "@/components/ui/BorderBeam";
import GlowingShadow from "@/components/ui/glowing-shadow";
import FlowButton from "@/components/ui/flow-button";

/* Colores por badge en Mania Tech */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-[#8A2BE2] text-white",
  bestseller: "bg-[#FF0033] text-white",
  viral: "bg-[#8A2BE2] text-white",
  exclusivo: "bg-purple-900 text-purple-200 border border-purple-500/30",
  top: "bg-[#FF0033] text-white",
  menu: "bg-gray-800 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo 🚀",
  bestseller: "Top Venta 🏆",
  viral: "Popular ⭐",
  exclusivo: "Exclusivo 👑",
  top: "Hot Deal 🔥",
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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (candy.stock === 0) return;
    addToCart(candy);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = candy.stock === 0;

  // Determinar badges
  let activeBadges: string[] = [];
  if (candy.badge) {
    activeBadges = [candy.badge];
  } else {
    const cats = Array.isArray(candy.category) ? candy.category : [candy.category];
    const safeCats = cats.map(c => (c || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());
    if (safeCats.includes("viral") || safeCats.includes("nuevo")) activeBadges.push("nuevo");
    if (safeCats.includes("top") || safeCats.includes("tendencias") || safeCats.includes("lo mas vendido") || safeCats.includes("lo_mas_vendido")) activeBadges.push("top");
    if (safeCats.includes("bestseller")) activeBadges.push("bestseller");
    activeBadges = Array.from(new Set(activeBadges));
  }

  const brandName = candy.flavor || candy.variant || "Mania Tech";

  return (
    <GlowingShadow glowColor={candy.badge === "top" || candy.badge === "bestseller" ? "red" : "purple"} className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between group border border-white/10 relative bg-[#141416] overflow-hidden h-full"
      >
        <BorderBeam size={220} duration={8} colorFrom="#8A2BE2" colorTo="#00FF00" />
        <div className="flex flex-col h-full justify-between relative z-10">

        <div>
          {/* Contenedor de Imagen de alta calidad */}
          <div
            className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#18181C] mb-4 flex items-center justify-center cursor-pointer"
            onClick={() => onOpenDetails?.(candy)}
          >
            <img
              src={getImagePath(candy.images?.[0]) || undefined}
              alt={candy.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

            {/* Badges de Estado */}
            {activeBadges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                {activeBadges.map(badge => (
                  <span
                    key={badge}
                    className={`text-[10px] font-display font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg ${BADGE_STYLES[badge] || "bg-[#8A2BE2] text-white"}`}
                  >
                    {BADGE_LABELS[badge] || badge}
                  </span>
                ))}
              </div>
            )}

            {/* Stock indicator (Verde Neón) */}
            <div className="absolute bottom-3 right-3 bg-[#0B0B0C]/85 backdrop-blur-md text-[#00FF00] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[#00FF00]/30 flex items-center gap-1.5 z-10">
              <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-[#00FF00] animate-ping"}`} />
              <span>{isOutOfStock ? "Agotado" : "En Stock"}</span>
            </div>
          </div>

          {/* Info del producto */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#8A2BE2] uppercase tracking-wider">
              {brandName}
            </span>
            <div className="flex items-center text-amber-400 gap-0.5 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-gray-300 font-bold">5.0</span>
            </div>
          </div>

          <h3
            onClick={() => onOpenDetails?.(candy)}
            className="font-display font-bold text-base sm:text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-[#8A2BE2] transition-colors cursor-pointer"
          >
            {candy.name}
          </h3>

          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4 font-normal">
            {candy.description}
          </p>
        </div>

        {/* Footer de Card (Precio & Botón) */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto gap-3">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-medium">Precio</span>
            <span className="font-display font-extrabold text-xl text-white">
              ${candy.price.toFixed(2)}
            </span>
          </div>

          <FlowButton
            onClick={handleAdd}
            disabled={isOutOfStock}
            glowColor={isAdded ? "green" : "purple"}
            className={`px-4 py-2.5 text-xs ${
              isOutOfStock
                ? "bg-gray-800 text-gray-500 border border-white/5 shadow-none"
                : isAdded
                ? "bg-[#00FF00] text-[#0B0B0C] font-black"
                : "bg-[#8A2BE2] text-white"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>¡Añadido!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="bag"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </FlowButton>
        </div>

      </div>
    </motion.div>
    </GlowingShadow>
  );
};
