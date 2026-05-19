"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBasket, Trash2, Plus, Minus, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getImagePath } from "@/utils/imagePath";
import { useRouter, usePathname } from "next/navigation";

export const CartDrawer = ({ isOpen, onClose, onCheckout }: { isOpen: boolean, onClose: () => void, onCheckout: () => void }) => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors mr-1"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <ShoppingBasket className="text-primary" />
                  <h2 className="text-xl font-display text-brand-darkgray uppercase">Tu Cesta</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-4">🧺</div>
                  <h3 className="text-xl font-bold mb-2">Tu cesta está vacía</h3>
                  <p className="text-gray-500 mb-6">Parece que aún no has elegido nada dulce.</p>
                  <button 
                    onClick={() => {
                      onClose();
                      if (pathname !== "/catalogo") {
                        router.push("/catalogo");
                      }
                    }}
                    className="bg-brand-red text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-red/20 transition-transform hover:scale-105 active:scale-95"
                  >
                    Ver Golosinas
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-secondary/10 overflow-hidden flex-shrink-0">
                      <img src={getImagePath(item.images?.[0] || (item as any).image) || undefined} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-brand-darkgray">{item.name}</h4>
                      <p className="text-primary font-numbers font-semibold">{item.price.toFixed(2)} €</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-full shadow-sm transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-full shadow-sm transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold">Total Estimado</span>
                  <span className="text-3xl font-black text-primary">{totalPrice.toFixed(2)} €</span>
                </div>
                <button 
                  disabled={isNavigating}
                  onClick={() => {
                    setIsNavigating(true);
                    onCheckout();
                  }}
                  className="w-full bg-brand-red text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-wait"
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
