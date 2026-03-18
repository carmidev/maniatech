"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBasket, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";
import { DolceButton } from "./DolceButton";
import { useState } from "react";

interface ProductModalProps {
  candy: Candy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ candy, isOpen, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [currentImg, setCurrentImg] = useState(0);

  if (!candy) return null;

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % candy.images.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + candy.images.length) % candy.images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
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
            <div className="md:w-1/2 relative bg-slate-50 group h-[250px] md:h-full">
              <motion.img
                key={currentImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getImagePath(candy.images[currentImg]) || undefined}
                alt={candy.name}
                className="w-full h-full object-cover"
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
                  <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {candy.category === "tendencias" ? "🔥 Los más buscados" : candy.category}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-primary font-black text-xl">{candy.price.toFixed(2)}€</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                  {candy.name}
                </h2>
                
                <p className="text-slate-500 text-base leading-relaxed italic mb-6">
                  {candy.description}
                </p>

                {/* Reseña Personal (Humanización) - Más compacta */}
                <div className="relative bg-primary/5 p-6 rounded-[2rem] mb-6 border border-primary/10 mx-3 mt-3">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <h4 className="text-primary font-black uppercase tracking-tighter text-[10px] mb-2 font-mono">
                    Reseña de Ana ✨
                  </h4>
                  <p className="text-slate-800 font-bold text-base leading-snug italic">
                    "{candy.ownerReview}"
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                      — ANA
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón Añadir al Carrito - Fijo abajo */}
              <div className="mt-4 pt-4 border-t border-slate-100">
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
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
