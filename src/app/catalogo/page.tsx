"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingBasket, ArrowRight, Search, SlidersHorizontal, ChevronDown, Menu, X, Flame, Zap, CupSoda, Star, Candy as CandyIcon, Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LollipopLogo } from "@/components/LollipopLogo";
import { ProductCard } from "@/components/ProductCard";
import { CANDIES, Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import Link from "next/link";

import { ProductModal } from "@/components/ProductModal";
import { Footer } from "@/components/Footer";
import { getImagePath } from "@/utils/imagePath";
import { DolceButton } from "@/components/DolceButton";
import { FloatingCart } from "@/components/FloatingCart";
import { useRouter } from "next/navigation";

export default function CatalogoPage() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const { totalItems } = useCart();

  // Local storage logic moved to checkout page

  const categories = [
    { id: "all", label: "Todos", icon: "⭐" },
    { id: "chocolates", label: "Chocolates", icon: "🍪" },
    { id: "gomitas", label: "Gomitas", icon: "🧬" },
    { id: "acidos", label: "Ácidos", icon: "⚡" },
    { id: "pikantes", label: "Pikantes", icon: "🔥" },
    { id: "bebidas", label: "Bebidas", icon: "🥤" },
    { id: "tendencias", label: "Tendencias", icon: "✨" },
  ];

  const filteredCandies = CANDIES.filter((c) => {
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f6f6]">

      {/* ── NAVBAR PÍLDORA FLOTANTE (REDUCCIÓN EXTREMA PREVENCIÓN OVERFLOW) ── */}
      <div className="fixed top-4 inset-x-0 z-[99] flex justify-center pointer-events-none px-3 sm:px-6 lg:px-0">
        <nav className="pointer-events-auto w-full lg:w-max lg:min-w-[740px] max-w-4xl bg-white/95 backdrop-blur-xl rounded-full shadow-xl shadow-black/10 h-[58px] lg:h-20 flex items-center justify-between border border-white/60 px-3 sm:px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-1 md:gap-2 cursor-pointer p-0 relative shrink-0">
            {/* Logo Móvil - Escalado para contrarrestar el padding transparente de la imagen */}
            <div className="relative lg:hidden w-[48px] h-[48px] flex items-center justify-center shrink-0 -ml-1">
              <img
                src={getImagePath("/images/espiraldolce-con-nombre.png")}
                alt="Dolce Candy Oficial"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[2px] w-[118px] h-[118px] max-w-none object-contain pointer-events-none drop-shadow-sm"
              />
            </div>

            {/* Logo Desktop */}
            <div className="hidden lg:flex items-center shrink-0">
              <div className="relative w-[52px] h-[52px] flex items-center justify-center -ml-3">
                <img 
                  src={getImagePath("/images/espiraldolce-con-nombre.png")} 
                  alt="Dolce Candy Oficial" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[3px] w-[175px] h-[175px] max-w-none object-contain pointer-events-none drop-shadow-sm" 
                />
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4 lg:gap-8 shrink-0">
            <div className="hidden lg:flex items-center gap-7 font-display text-sm tracking-wide">
              <Link href="/catalogo" className="text-primary">
                Catálogo
              </Link>
              <Link href="/#lab" className="text-gray-600 hover:text-primary transition-colors">
                Candy Lab
              </Link>
              <Link href="/#ubicaciones" className="text-gray-600 hover:text-primary transition-colors">
                Ubicaciones
              </Link>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-2 lg:gap-3">
              <Link
                href="/"
                className="flex bg-brand-red text-white px-4 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-black text-[11px] lg:text-sm hover:scale-105 transition-all shadow-md shadow-brand-red/30 items-center gap-1 sm:gap-1 shrink-0"
              >
                <span className="hidden lg:inline">Volver al Inicio</span>
                <span className="lg:hidden uppercase tracking-tighter">Inicio</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 stroke-[3]" />
              </Link>
              <button
                onClick={handleOpenCart}
                className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <ShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[9px] lg:text-[12px] font-black w-3.5 h-3.5 lg:w-5 lg:h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />}
              </button>
            </div>
          </div>
        </nav>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+10px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-[24px] shadow-xl shadow-black/10 border border-black/5 overflow-hidden md:hidden flex flex-col p-5 gap-4 pointer-events-auto"
            >
              <nav className="flex flex-col gap-3 text-center">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-semibold tracking-wide text-brand-darkgray hover:text-primary transition-colors py-1"
                >
                  Inicio
                </Link>
                <Link 
                  href="/#lab" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-semibold tracking-wide text-brand-darkgray hover:text-primary transition-colors py-1"
                >
                  Candy Lab
                </Link>
                <Link 
                  href="/#ubicaciones" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-semibold tracking-wide text-brand-darkgray hover:text-primary transition-colors py-1"
                >
                  Ubicaciones
                </Link>
              </nav>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-brand-red text-white w-full py-3 rounded-full font-black text-[14px] tracking-wide hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-brand-red/30 mt-1"
              >
                Volver al Inicio <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CONTENIDO ── */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col gap-10">

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-display-main font-bold tracking-main text-brand-darkgray"
              >
                Colección de <span className="text-primary text-glow-sm">Dulces Exclusivos</span>
              </motion.h1>
              <p className="text-brand-darkgray/70 mt-3 max-w-xl text-sm md:text-base leading-relaxed font-body font-normal">
                Selección única de dulces importados directo de USA. Cada semana nuevos tesoros azucarados.
              </p>
            </div>

            <div className="w-full md:w-80 shrink-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar dulce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-[2rem] bg-white border border-slate-200 shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Categorías Horizontales */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display text-brand-darkgray uppercase tracking-widest">Categorías</h3>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-4 -mx-6 px-6 gap-3 no-scrollbar scroll-smooth">
              {[
                { key: "all", label: "Todos", icon: <Star className="w-4 h-4" />, color: "bg-slate-100 text-slate-600" },
                { key: "chocolates", label: "Chocolates", icon: <Cookie className="w-4 h-4" />, color: "bg-brand-brown/10 text-brand-brown" },
                { key: "gomitas", label: "Gomitas", icon: <CandyIcon className="w-4 h-4" />, color: "bg-accent/10 text-accent" },
                { key: "acidos", label: "Ácidos", icon: <Zap className="w-4 h-4" />, color: "bg-secondary/10 text-secondary" },
                { key: "pikantes", label: "Pikantes", icon: <Flame className="w-4 h-4" />, color: "bg-brand-darkred/10 text-brand-darkred" },
                { key: "bebidas", label: "Bebidas", icon: <CupSoda className="w-4 h-4" />, color: "bg-brand-blue/10 text-brand-blue" },
                { key: "tendencias", label: "Los más buscados", icon: <Star className="w-4 h-4" fill="currentColor" />, color: "bg-brand-lightbrown/20 text-brand-brown" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full border shrink-0 transition-all ${activeCategory === cat.key
                      ? "bg-brand-red border-brand-red text-white shadow-xl shadow-brand-red/20 scale-105"
                      : "bg-white border-slate-100 text-slate-700 hover:border-brand-red/30"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeCategory === cat.key ? "bg-white/20" : cat.color}`}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-black whitespace-nowrap">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCandies.map((candy) => (
              <ProductCard
                key={candy.id}
                candy={candy}
                onOpenDetails={(c) => setSelectedProduct(c)}
              />
            ))}
          </div>
        </div>
      </main>


      <Footer />
      <ProductModal
        candy={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />

      <FloatingCart onClick={handleOpenCart} />
    </div>
  );
}
