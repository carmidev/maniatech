"use client";

import { useState, useMemo } from "react";
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
import { CheckoutModal } from "@/components/CheckoutModal";

export default function CatalogoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const { totalItems } = useCart();

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

      {/* ── NAVBAR ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-5xl">
        <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-lg shadow-black/8 px-6 h-16 flex items-center justify-between border border-white/60">
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <div className="w-[44px] h-[44px] flex items-center justify-center overflow-hidden shrink-0 -ml-2 rounded-full">
              <img src={getImagePath("/images/espiral-dolce.png")} alt="Dolce Isotipo" className="w-full h-full object-cover scale-[1.3] drop-shadow-sm" />
            </div>
            <img src={getImagePath("/images/letras-dolce-candy-blanco.png")} alt="Dolce Candy" className="h-[34px] object-contain mt-1 invert opacity-90" />
          </Link>

          <div className="hidden md:flex items-center gap-7 font-bold text-sm tracking-wide">
            <Link href="/catalogo" className="text-primary">
              Catálogo
            </Link>
            <Link href="/#ubicaciones" className="text-gray-600 hover:text-primary transition-colors">
              Ubicaciones
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="bg-brand-red text-white px-5 py-2.5 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-brand-red/30 hidden md:flex items-center gap-2"
            >
              Volver al Inicio <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBasket className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+10px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-3xl shadow-xl shadow-black/10 border border-black/5 overflow-hidden md:hidden flex flex-col p-6 gap-6"
            >
              <nav className="flex flex-col gap-5 text-center">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                >
                  Inicio
                </Link>
                <Link 
                  href="/#ubicaciones" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                >
                  Ubicaciones
                </Link>
              </nav>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-brand-red text-white w-full py-4 rounded-full font-black text-lg hover:bg-brand-red/90 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-md"
              >
                Volver al Inicio <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {filteredCandies.length} productos encontrados
              </p>
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
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <FloatingCart onClick={() => setIsCartOpen(true)} />
    </div>
  );
}
