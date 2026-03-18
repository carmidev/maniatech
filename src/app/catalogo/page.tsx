"use client";

import { useState } from "react";
import { ShoppingBasket, ArrowLeft, Search, Candy as CandyIcon, Cookie, Flame, Zap, CupSoda, Star } from "lucide-react";
import { motion } from "framer-motion";
import { LollipopLogo } from "@/components/LollipopLogo";
import { ProductCard } from "@/components/ProductCard";
import { CANDIES, Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import Link from "next/link";

import { ProductModal } from "@/components/ProductModal";
import { Footer } from "@/components/Footer";
import { DolceButton } from "@/components/DolceButton";
import { FloatingCart } from "@/components/FloatingCart";
import { CheckoutModal } from "@/components/CheckoutModal";

export default function CatalogoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
          <Link href="/" className="flex items-center gap-2.5">
            <LollipopLogo />
            <span className="font-script text-3xl leading-none text-primary pt-1">Dolce Candy</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 font-bold text-sm tracking-wide">
            <Link href="/catalogo" className="text-primary">
              Catálogo
            </Link>
            <Link href="/#ubicaciones" className="text-gray-600 hover:text-primary transition-colors">
              Ubicaciones
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:block">
              <DolceButton variant="ghost" size="sm" icon={ArrowLeft}>
                Volver
              </DolceButton>
            </Link>
            <div className="relative">
              <DolceButton
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="hover:bg-gray-100"
              >
                <ShoppingBasket className="w-5 h-5" />
              </DolceButton>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white pointer-events-none">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>
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
                className="text-4xl md:text-5xl font-black tracking-tight text-slate-900"
              >
                Colección de <span className="text-primary text-glow-sm">Dulces Exclusivos</span>
              </motion.h1>
              <p className="text-slate-500 mt-3 max-w-xl text-sm md:text-base leading-relaxed">
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
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Categorías</h3>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {filteredCandies.length} productos encontrados
              </p>
            </div>
            
            <div className="flex overflow-x-auto pb-4 -mx-6 px-6 gap-3 no-scrollbar scroll-smooth">
              {[
                { key: "all", label: "Todos", icon: <Star className="w-4 h-4" />, color: "bg-slate-100 text-slate-600" },
                { key: "chocolates", label: "Chocolates", icon: <Cookie className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
                { key: "gomitas", label: "Gomitas", icon: <CandyIcon className="w-4 h-4" />, color: "bg-pink-50 text-pink-500" },
                { key: "acidos", label: "Ácidos", icon: <Zap className="w-4 h-4" />, color: "bg-yellow-50 text-yellow-600" },
                { key: "pikantes", label: "Pikantes", icon: <Flame className="w-4 h-4" />, color: "bg-red-50 text-red-500" },
                { key: "bebidas", label: "Bebidas", icon: <CupSoda className="w-4 h-4" />, color: "bg-blue-50 text-blue-500" },
                { key: "tendencias", label: "Los más buscados", icon: <Star className="w-4 h-4" fill="currentColor" />, color: "bg-purple-50" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full border shrink-0 transition-all ${
                    activeCategory === cat.key
                      ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                      : "bg-white border-slate-100 text-slate-700 hover:border-primary/30"
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
