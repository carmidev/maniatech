"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBasket, ChevronLeft, ChevronRight, Heart, Cookie, Coffee } from "lucide-react";
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

  const variants = initialCandy?.sku ? allProducts.filter(p => p.sku === initialCandy.sku) : [];

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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:h-[min(700px,90vh)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors border border-black/5 active:scale-95"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>

            {/* Galería de Imágenes */}
            <div className="md:w-1/2 relative bg-white group h-[250px] md:h-full p-8 flex items-center justify-center">
              <motion.img
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getImagePath(candy.images[currentImg]) || undefined}
                alt={candy.name}
                className="w-full h-full object-contain cursor-zoom-in"
                onClick={() => setIsFullscreen(true)}
              />

              {/* Controles Galería */}
              {candy.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-900" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-900" />
                  </button>
                </>
              )}
            </div>

            {/* Información y Reseña de la Dueña */}
            <div className="md:w-1/2 p-6 md:p-10 bg-white flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-[9px] font-display uppercase tracking-widest">
                    {Array.isArray(candy.category)
                      ? (candy.category.some(c => ["top", "lo más vendido", "lo mas vendido"].includes((c || "").toLowerCase())) ? "🔥 Lo más vendido" : candy.category.join(", "))
                      : (["top", "lo más vendido", "lo mas vendido"].includes((candy.category || "").toLowerCase()) ? "🔥 Lo más vendido" : candy.category)}
                  </span>
                  {!isMenu && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-primary font-numbers font-semibold text-2xl">ref {candy.price.toFixed(2)}</span>
                    </>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight mb-3 flex items-center gap-3">
                  <span>{renderWithNumberFont(candy.name)}</span>
                  {isMenu && <Coffee className="w-8 h-8 text-primary" />}
                </h2>

                <p className="text-brand-darkgray/70 text-base font-body font-normal leading-relaxed mb-6">
                  {candy.description}
                </p>

                {/* Variantes Selector */}
                {variants.length > 1 && (
                  <div className="mb-8 relative z-10">
                    <h4 className="text-[11px] md:text-xs font-black text-brand-darkgray mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                      ✨ Sabores
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
                            className={`relative px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-3 overflow-hidden border-2 ${
                              isSelected
                                ? "bg-white text-primary shadow-md border-primary"
                                : "bg-white text-slate-600 border-slate-100 hover:border-primary/40 hover:shadow-sm"
                            } ${isOutOfStockVariant && !isSelected ? "opacity-50 hover:opacity-80" : ""}`}
                          >
                            <span className={`flex-shrink-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${isOutOfStockVariant ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"}`} />
                            <span className="relative z-10">{v.flavor || v.name}</span>
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/5 z-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {isOutOfStock && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2"
                      >
                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
                          ⚠️ Sin disponibilidad por el momento
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Botón de Navegación para el Menú */}
                {isMenu && (
                  <div className="mt-8 flex flex-col items-center text-center px-4">
                    <p className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-widest">¿Buscas algo para acompañar?</p>
                    <button
                      onClick={() => onNavigateToGolosinas?.("galletas")}
                      className="group flex items-center gap-3 bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-black text-sm hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10 active:scale-95"
                    >
                      <Cookie className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Ver Golosinas (Galletas)
                    </button>
                  </div>
                )}
              </div>

              {/* Botón Añadir al Carrito - Fijo abajo */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                {isMenu ? (
                  <div className="w-full py-4 rounded-[2rem] font-black text-sm bg-primary/5 text-primary border border-primary/20 flex items-center justify-center gap-3">
                    ✨ ¡Disfrútalo en nuestra tienda!
                  </div>
                ) : isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-[2rem] font-black text-sm bg-gray-300 text-gray-500 cursor-not-allowed shadow-none flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    Agotado
                  </button>
                ) : (
                  <DolceButton
                    onClick={() => {
                      addToCart(candy);
                      onClose();
                    }}
                    icon={ShoppingBasket}
                    className="w-full"
                  >
                    Agregar al pedido
                  </DolceButton>
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
