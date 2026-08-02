"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";
import { useRouter, usePathname } from "next/navigation";

export const CartDrawer = ({ isOpen, onClose, onCheckout }: { isOpen: boolean, onClose: () => void, onCheckout: () => void }) => {
  const { items, removeFromCart, updateQuantity, totalPrice, subtotal, discountAmount, totalItems, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Prefetch preventivo del catálogo y checkout al abrir el carrito para carga instantánea
  useEffect(() => {
    if (isOpen) {
      router.prefetch("/catalogo");
      router.prefetch("/checkout");
    }
  }, [isOpen, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#141418] border-l border-white/10 text-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#181820]">
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="p-2 hover:bg-white/10 text-gray-400 hover:text-red-400 rounded-full transition-colors mr-1 cursor-pointer"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="text-[#8A2BE2] w-6 h-6" />
                  <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">Tu Carrito</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-bold mb-2 text-white">Tu carrito está vacío</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">Añade periféricos y accesorios de alto rendimiento para armar tu setup.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      if (pathname !== "/catalogo") {
                        router.push("/catalogo");
                      }
                    }}
                    className="bg-[#8A2BE2] hover:bg-[#6441A5] text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-[#8A2BE2]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[#1C1C22] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="w-20 h-20 rounded-xl bg-[#141418] overflow-hidden flex-shrink-0 p-2 border border-white/10 flex items-center justify-center">
                      <img src={getImagePath(item.images?.[0] || (item as any).image) || undefined} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-white text-sm truncate">{item.name}</h4>
                      {((item.flavor || (item as any).product?.flavor) && (item.flavor || (item as any).product?.flavor).toLowerCase() !== 'original') && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold text-[#8A2BE2] uppercase tracking-wider bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 px-2 py-0.5 rounded-md">
                            {`Sabor: ${item.flavor || (item as any).product?.flavor}`}
                          </span>
                        </div>)}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 font-numbers text-xs line-through">$ {item.price.toFixed(2)}</p>
                        <p className="text-[#00FF00] font-numbers font-bold text-sm">$ {(item.price * 0.9).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-[#141418] border border-white/10 rounded-xl px-2.5 py-1 text-white">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold min-w-[18px] text-center text-xs text-white">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-[#181820] border-t border-white/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-medium">Subtotal</span>
                    <span className="text-white font-numbers font-semibold">$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#00FF00] font-bold">Descuento Especial (10% OFF)</span>
                    <span className="text-[#00FF00] font-numbers font-bold">- $ {discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-gray-300 font-bold">Total Estimado</span>
                    <span className="text-3xl font-black text-[#8A2BE2] font-numbers">$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  disabled={isNavigating}
                  onClick={() => {
                    setIsNavigating(true);
                    onCheckout();
                  }}
                  className="w-full bg-[#8A2BE2] hover:bg-[#6441A5] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#8A2BE2]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait cursor-pointer"
                >
                  {isNavigating ? (
                    <>Cargando... <Loader2 className="w-5 h-5 animate-spin" /></>
                  ) : (
                    <>Continuar al Pago <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
