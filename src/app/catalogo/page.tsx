"use client";

import { useState } from "react";
import { ShoppingBasket, ArrowLeft, Search, Candy as CandyIcon, Cookie, Flame, Zap, CupSoda, Star } from "lucide-react";
import { motion } from "framer-motion";
import { LollipopLogo } from "@/components/LollipopLogo";
import { ProductCard } from "@/components/ProductCard";
import { CANDIES } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import Link from "next/link";

export default function CatalogoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();

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
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary px-4 py-2.5 rounded-full font-bold text-sm hidden md:flex items-center gap-1.5 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBasket className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── CONTENIDO ── */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR DE FILTROS ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="Buscar dulce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Categorías</h3>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                  Filtra tu dulzura
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { key: "all", label: "Todos", icon: <Star className="w-4 h-4" />, color: "bg-slate-100 text-slate-600" },
                  { key: "chocolates", label: "Chocolates", icon: <Cookie className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
                  { key: "gomitas", label: "Gomitas", icon: <CandyIcon className="w-4 h-4" />, color: "bg-pink-50 text-pink-500" },
                  { key: "acidos", label: "Ácidos", icon: <Zap className="w-4 h-4" />, color: "bg-yellow-50 text-yellow-600" },
                  { key: "pikantes", label: "Pikantes", icon: <Flame className="w-4 h-4" />, color: "bg-red-50 text-red-500" },
                  { key: "bebidas", label: "Bebidas", icon: <CupSoda className="w-4 h-4" />, color: "bg-blue-50 text-blue-500" },
                  { key: "virales", label: "Virales", icon: <Star className="w-4 h-4" fill="currentColor" />, color: "bg-purple-50 text-purple-600" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                      activeCategory === cat.key
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white border-slate-100 text-slate-700 hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCategory === cat.key ? "bg-white/20" : cat.color}`}>
                      {cat.icon}
                    </div>
                    <span className="text-sm font-black">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── ÁREA PRINCIPAL ── */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-black tracking-tight text-slate-900"
              >
                Colección de <span className="text-primary">Dulces Raros</span>
              </motion.h1>
              <p className="text-slate-500 mt-2 max-w-xl text-sm leading-relaxed">
                Selección exclusiva de dulces importados directo de USA. Cada semana nuevos tesoros azucarados.
              </p>
            </div>

            {/* Resultados */}
            <div className="mb-4">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                {filteredCandies.length} productos encontrados
              </p>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCandies.map((candy) => (
                <ProductCard key={candy.id} candy={candy} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
