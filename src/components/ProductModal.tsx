"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Heart, Cookie, Coffee } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";
import { DolceButton } from "./DolceButton";
import { useState, useEffect } from "react";

const renderWithNumberFont = (text: string) => {
  return text.split(/(\d+)/).map((part, i) => {
    if (/\d+/.test(part)) {
      return <span key={i} className="font-numbers font-semibold tracking-normal leading-normal">{part}</span>;
    }
    return part;
  });
};

interface ProductModalProps {
  candy: Candy | null;
  allProducts?: Candy[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGolosinas?: (category?: string) => void;
}

export const ProductModal = ({ candy: initialCandy, allProducts = [], isOpen, onClose, onNavigateToGolosinas }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [currentImg, setCurrentImg] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [candy, setCandy] = useState<Candy | null>(initialCandy);

  useEffect(() => {
    if (isOpen) {
      setCandy(initialCandy);
      setCurrentImg(0);
    }
  }, [initialCandy, isOpen]);

  if (!candy) return null;

  const variants = initialCandy?.sku 
    ? allProducts.filter(p => p.sku === initialCandy.sku && p.flavor && p.flavor.trim() !== '' && p.flavor.toLowerCase() !== 'original') 
    : [];

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % candy.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + candy.images.length) % candy.images.length);

  const isOutOfStock = candy.stock === 0;
  const isMenu = candy.badge === 'menu';

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="product-modal-main" className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#141418] border border-white/10 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:h-[min(700px,90vh)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#1C1C22]/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-[#25252E] transition-colors border border-white/10 active:scale-95 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Galería de Imágenes */}
            <div className="md:w-1/2 relative bg-[#0E0E12] border-r border-white/10 group h-[250px] md:h-full p-8 flex items-center justify-center">
              <motion.img
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getImagePath(candy.images[currentImg]) || undefined}
                alt={candy.name}
                className="w-full h-full object-contain cursor-zoom-in rounded-xl"
                onClick={() => setIsFullscreen(true)}
              />

              {/* Controles Galería */}
              {candy.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1C1C22]/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1C1C22] border border-white/10 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1C1C22]/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#1C1C22] border border-white/10 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Información y Detalle */}
            <div className="md:w-1/2 p-6 md:p-10 bg-[#141418] flex flex-col overflow-hidden text-white">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {Array.isArray(candy.category)
                      ? (candy.category.some(c => ["top", "lo más vendido", "lo mas vendido"].includes((c || "").toLowerCase())) ? "🔥 Lo más vendido" : candy.category.join(", "))
                      : (["top", "lo más vendido", "lo mas vendido"].includes((candy.category || "").toLowerCase()) ? "🔥 Lo más vendido" : candy.category)}
                  </span>
                  {!isMenu && (
                    <>
                      <span className="text-white/20">|</span>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col leading-none justify-center">
                          <span className="text-gray-500 font-numbers text-xs line-through">$ {candy.price.toFixed(2)}</span>
                          <span className="text-[#00FF00] font-numbers font-black text-2xl">$ {(candy.price * 0.9).toFixed(2)}</span>
                        </div>
                        <span className="bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                          -10% OFF
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <h2 className="text-2xl md:text-4xl font-display font-black text-white leading-tight mb-3 flex items-center gap-3">
                  <span>{renderWithNumberFont(candy.name)}</span>
                  {isMenu && <Coffee className="w-8 h-8 text-[#8A2BE2]" />}
                </h2>

                <p className="text-gray-300 text-sm md:text-base font-body font-normal leading-relaxed mb-6">
                  {candy.description}
                </p>

                {/* Variantes Selector */}
                {variants.length > 1 && (
                  <div className="mb-8 relative z-10">
                    <h4 className="text-[11px] md:text-xs font-black text-gray-300 mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                      ⚡ Variantes Disponibles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {variants.map(v => {
                        const isOutOfStockVariant = v.stock === 0;
                        const isSelected = candy.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              setCandy(v);
                              setCurrentImg(0);
                            }}
                            className={`relative px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3 overflow-hidden border cursor-pointer ${
                              isSelected
                                ? "bg-[#8A2BE2]/20 text-[#8A2BE2] shadow-md border-[#8A2BE2]"
                                : "bg-[#1C1C22] text-gray-300 border-white/10 hover:border-[#8A2BE2]/40 hover:text-white"
                            } ${isOutOfStockVariant && !isSelected ? "opacity-50 hover:opacity-80" : ""}`}
                          >
                            <span className={`flex-shrink-0 w-2 h-2 rounded-full ${isOutOfStockVariant ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]"}`} />
                            <span className="relative z-10">{v.flavor || v.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    {isOutOfStock && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                      >
                        <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">
                          ⚠️ Sin disponibilidad por el momento
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón Añadir al Carrito - Fijo abajo */}
              <div className="mt-4 pt-4 border-t border-white/10">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-xl font-bold text-sm bg-gray-800 text-gray-500 cursor-not-allowed shadow-none flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    Agotado
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(candy);
                      onClose();
                    }}
                    className="w-full bg-[#8A2BE2] hover:bg-[#6441A5] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#8A2BE2]/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span>Agregar al pedido</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Visor de Pantalla Completa */}
      {isOpen && isFullscreen && (
        <div key="product-modal-fullscreen" className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out"
          />

          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <motion.img
            key={`fs-${currentImg}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={getImagePath(candy.images[currentImg]) || undefined}
            alt={candy.name}
            className="relative z-10 max-w-full max-h-[90vh] object-contain pointer-events-none"
          />

          {candy.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
