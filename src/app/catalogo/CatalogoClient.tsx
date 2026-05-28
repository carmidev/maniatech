"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ShoppingBasket, ArrowRight, Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Menu, X, Flame, Zap, CupSoda, Star, Candy as CandyIcon, Cookie, Gift, Popcorn, Sparkles, Check } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import { getProductsWithInventory } from './actions';


export function CatalogoClient({ initialProducts }: { initialProducts: Candy[] }) {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"golosinas" | "cafe">("golosinas");
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const { totalItems } = useCart();

  // Local storage logic moved to checkout page

  const categories = [
    { id: "all", label: "Todos", icon: "⭐" },
    { id: "chocolates", label: "Chocolates", icon: "🍪" },
    { id: "gomitas", label: "Gomitas", icon: "🧬" },
    { id: "acidos", label: "Ácidos", icon: "⚡" },
    { id: "picantes", label: "Picantes", icon: "🔥" },
    { id: "galletas", label: "Galletas", icon: "🍪" },
    { id: "snacks", label: "Snacks", icon: "🍿" },
    { id: "bebidas", label: "Bebidas", icon: "🥤" },
    { id: "juguetes", label: "Juguetes", icon: "🎁" },
    { id: "chicles", label: "Chicles", icon: "🍬" },
    { id: "caramelos", label: "Caramelos", icon: "🍬" },
    { id: "lo_mas_vendido", label: "Lo más vendido", icon: "✨" },
    { id: "nuevo", label: "Nuevo", icon: "✨" },
  ];

  const normalizeCategory = (cat: string | string[] | null): string[] => {
    if (!cat) return ["lo_mas_vendido"];
    const cats = Array.isArray(cat) ? cat : [cat];
    return cats.map(c =>
      String(c)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace("pikantes", "picantes")
        .replace("tendencias", "lo_mas_vendido")
        .replace("top", "lo_mas_vendido")
        .replace("lo mas vendido", "lo_mas_vendido")
        .replace("viral", "nuevo")
    );
  };

  // Aplicar normalización a los datos mock iniciales para que sean coherentes con la DB
  const normalizedMockCandies = CANDIES.map(c => ({
    ...c,
    category: normalizeCategory(c.category)
  }));

  const [candiesList, setCandiesList] = useState<Candy[]>(initialProducts);

  const filteredCandies = candiesList.filter((c) => {
    const productCategories = normalizeCategory(c.category);
    const matchesCategory = activeCategory === "all" || 
      productCategories.includes(activeCategory) ||
      (activeCategory === "nuevo" && (productCategories.includes("nuevo") || c.badge === "nuevo")) ||
      (activeCategory === "lo_mas_vendido" && (productCategories.includes("lo_mas_vendido") || c.badge === "bestseller"));
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const SORT_OPTIONS = [
    { id: "relevance", label: "Relevancia" },
    { id: "price_asc", label: "Precio más bajo" },
    { id: "price_desc", label: "Precio más alto" },
    { id: "name", label: "Nombre (A-Z)" },
    { id: "brand", label: "Marca (A-Z)" },
  ];

  const getPriorityScore = (c: Candy) => {
    if (c.badge === "top") return 2;
    if (c.badge === "nuevo" || c.badge === "viral") return 1;
    const cats = Array.isArray(c.category) ? c.category : [c.category];
    const safeCats = cats.map(cat => (cat || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());
    if (safeCats.includes("top") || safeCats.includes("tendencias") || safeCats.includes("lo mas vendido") || safeCats.includes("lo_mas_vendido") || safeCats.includes("bestseller")) return 2;
    if (safeCats.includes("nuevo") || safeCats.includes("viral")) return 1;
    return 0;
  };

  const sortedCandies = [...filteredCandies].sort((a, b) => {
    if (sortBy === "price_asc") {
      const diff = Number(a.price || 0) - Number(b.price || 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    }
    if (sortBy === "price_desc") {
      const diff = Number(b.price || 0) - Number(a.price || 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    }
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "brand") return (a.name.split(" ")[0] || "").localeCompare(b.name.split(" ")[0] || "");
    
    // Default: relevance
    const scoreA = getPriorityScore(a);
    const scoreB = getPriorityScore(b);
    return scoreB - scoreA;
  });

  const coffeeItems: Candy[] = [
    { id: "cafe1", name: "Menú Café", description: "Explora nuestra variedad de cafés preparados con granos seleccionados.", price: 0, images: ["/images/cafe 1.jpeg"], category: ["cafe"], stock: 99, badge: "menu", ownerReview: "" },
    { id: "cafe2", name: "Menú Café", description: "Disfruta de nuestras especialidades de la casa en un ambiente acogedor.", price: 0, images: ["/images/cafe 2.jpeg"], category: ["cafe"], stock: 99, badge: "menu", ownerReview: "" },
    { id: "cafe3", name: "Menú Café", description: "Acompaña tu café con nuestra deliciosa selección de golosinas.", price: 0, images: ["/images/cafe 3.jpeg"], category: ["cafe"], stock: 99, badge: "menu", ownerReview: "" },
    { id: "cafe4", name: "Menú Café", description: "El complemento perfecto para tu momento Dolce.", price: 0, images: ["/images/cafe 4.jpeg"], category: ["cafe"], stock: 99, badge: "menu", ownerReview: "" },
  ];

  const displayedProducts = activeSection === 'cafe' ? coffeeItems : sortedCandies;

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
                Candy Reviews
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
                className="relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <ShoppingBasket className="w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] lg:text-[12px] font-black w-[18px] h-[18px] lg:w-5 lg:h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-6 sm:h-6 text-gray-900" /> : <Menu className="w-6 h-6 sm:w-6 sm:h-6 text-gray-900" />}
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
                  Candy Reviews
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
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="flex flex-col gap-6">

          {/* Header, Section Selector & Search */}
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-display-main font-bold tracking-main text-brand-darkgray"
            >
              Catálogo <span className="text-primary text-glow-sm">Dolce Candy</span>
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
              {/* Section Selector (Píldora) - Extremo Izquierdo */}
              <div className="bg-white p-1.5 rounded-full shadow-lg shadow-black/5 border border-slate-100 flex gap-1 w-fit">
                <button
                  onClick={() => setActiveSection("golosinas")}
                  className={`px-6 md:px-8 py-2.5 rounded-full font-black text-xs md:text-sm transition-all duration-300 ${activeSection === 'golosinas' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Golosinas
                </button>
                <button
                  onClick={() => setActiveSection("cafe")}
                  className={`px-6 md:px-8 py-2.5 rounded-full font-black text-xs md:text-sm transition-all duration-300 ${activeSection === 'cafe' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Café
                </button>
              </div>

              {/* Buscador - Extremo Derecho */}
              {activeSection === 'golosinas' && (
                <div className="w-full md:w-80">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Buscar golosinas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 rounded-[2rem] bg-white border border-slate-200 shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {activeSection === 'cafe' && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-brand-darkgray/60 font-body text-lg flex items-center gap-2 mt-2"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ¡Disfrútalos directamente en nuestra tienda!
              </motion.p>
            )}
          </div>

          {/* Categorías Horizontales */}
          {activeSection === 'golosinas' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display text-brand-darkgray uppercase tracking-widest">Categorías</h3>
                </div>
              </div>

              <div className="relative group">
                {/* Indicador de scroll - Izquierda (Oculto en desktop) */}
                <button 
                  onClick={() => handleScroll("left")}
                  className="absolute left-[-12px] top-1/2 -translate-y-[60%] z-10 lg:hidden flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-full shadow-md text-brand-darkgray hover:text-brand-red transition-all active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5 pr-[2px]" />
                </button>
                
                {/* Indicador de scroll - Derecha (Oculto en desktop) */}
                <button 
                  onClick={() => handleScroll("right")}
                  className="absolute right-[-12px] top-1/2 -translate-y-[60%] z-10 lg:hidden flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-full shadow-md text-brand-darkgray hover:text-brand-red transition-all active:scale-90"
                >
                  <ChevronRight className="w-5 h-5 pl-[2px]" />
                </button>

                <div 
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto py-2 -mx-6 px-6 gap-3 md:gap-6 no-scrollbar scroll-smooth flex-nowrap items-start"
                >
                  {[
                    { key: "all", label: "Todos", icon: <Star className="w-6 h-6" />, color: "bg-slate-100 text-slate-600" },
                    { key: "lo_mas_vendido", label: "Lo más vendido", icon: <Star className="w-6 h-6" fill="currentColor" />, color: "bg-brand-lightbrown/20 text-brand-brown" },
                    { key: "nuevo", label: "Nuevo", icon: <Sparkles className="w-6 h-6" />, color: "bg-brand-blue/20 text-brand-blue" },
                    { key: "chocolates", label: "Chocolates", icon: <Cookie className="w-6 h-6" />, color: "bg-brand-brown/10 text-brand-brown" },
                    { key: "gomitas", label: "Gomitas", icon: <CandyIcon className="w-6 h-6" />, color: "bg-accent/10 text-accent" },
                    { key: "acidos", label: "Ácidos", icon: <Zap className="w-6 h-6" />, color: "bg-secondary/10 text-secondary" },
                    { key: "picantes", label: "Picantes", icon: <Flame className="w-6 h-6" />, color: "bg-brand-darkred/10 text-brand-darkred" },
                    { key: "galletas", label: "Galletas", icon: <Cookie className="w-6 h-6" />, color: "bg-orange-100 text-orange-600" },
                    { key: "snacks", label: "Snacks", icon: <Popcorn className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600" },
                    { key: "bebidas", label: "Bebidas", icon: <CupSoda className="w-6 h-6" />, color: "bg-brand-blue/10 text-brand-blue" },
                    { key: "caramelos", label: "Caramelos", icon: <CandyIcon className="w-6 h-6" />, color: "bg-orange-100 text-orange-500" },
                    { key: "chicles", label: "Chicles", icon: <CandyIcon className="w-6 h-6" />, color: "bg-pink-100 text-pink-600" },
                    { key: "juguetes", label: "Juguetes", icon: <Gift className="w-6 h-6" />, color: "bg-purple-100 text-purple-600" },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className="flex flex-col items-center gap-2 md:gap-3 shrink-0 transition-all group/cat"
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all p-1 ${activeCategory === cat.key ? "border-brand-red scale-110 shadow-lg shadow-brand-red/10" : "border-slate-100 group-hover/cat:border-brand-red/30"}`}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${activeCategory === cat.key ? "bg-brand-red text-white" : cat.color}`}>
                          {cat.icon}
                        </div>
                      </div>
                      <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${activeCategory === cat.key ? "text-brand-red" : "text-slate-500 group-hover/cat:text-brand-red"}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dropdown Ordenar - debajo del slider, alineado a la izquierda */}
          {activeSection === 'golosinas' && (
            <div className="relative w-fit" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-5 py-3 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:border-primary/40 transition-all font-bold text-sm text-slate-600 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Ordenar: {SORT_OPTIONS.find(o => o.id === sortBy)?.label || "Relevancia"}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/60 p-1.5 min-w-[200px]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setIsSortOpen(false); }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          sortBy === opt.id
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.id && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Grid de productos */}
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedProducts.map((candy) => (
                <ProductCard
                  key={candy.id}
                  candy={candy}
                  onOpenDetails={(c) => setSelectedProduct(c)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>


      <Footer />
      <ProductModal
        candy={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateToGolosinas={(cat) => {
          setActiveSection("golosinas");
          if (cat) setActiveCategory(cat);
          setSelectedProduct(null);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { router.push('/checkout'); }}
      />

      <FloatingCart onClick={handleOpenCart} />
    </div>
  );
}
