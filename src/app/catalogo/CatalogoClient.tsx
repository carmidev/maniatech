"use client";

import { useState, useMemo, useEffect, useRef, useDeferredValue } from "react";
import { 
  ShoppingCart, ArrowRight, Search, SlidersHorizontal, ChevronDown, 
  Menu, X, Zap, Headphones, Mouse, Keyboard, Video, Mic, HardDrive, 
  Gamepad2, Sparkles, Filter, RotateCcw, CheckCircle2, ShieldCheck, MapPin
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { Candy } from "@/app/mock-data";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import Link from "next/link";
import { ProductModal } from "@/components/ProductModal";
import { Footer } from "@/components/Footer";
import { FloatingCart } from "@/components/FloatingCart";
import { useRouter, useSearchParams } from "next/navigation";
import { getImagePath } from "@/utils/imagePath";

// Categorías del ecosistema Mania Tech
const CATEGORIES = [
  { id: "all", label: "Todo el Catálogo", icon: Sparkles },
  { id: "audifonos", label: "Audífonos & Audio", icon: Headphones },
  { id: "mouses", label: "Mouses & Mousepads", icon: Mouse },
  { id: "teclados", label: "Teclados Mecánicos", icon: Keyboard },
  { id: "streaming", label: "Cámaras & Streaming", icon: Video },
  { id: "microfonos", label: "Micrófonos & Mixers", icon: Mic },
  { id: "almacenamiento", label: "Almacenamiento SSD", icon: HardDrive },
  { id: "controles", label: "Mandos & Controles", icon: Gamepad2 },
];

// Marcas aliadas
const BRANDS = [
  "Todas las Marcas",
  "Logitech G",
  "Razer",
  "Redragon",
  "Fantech",
  "Corsair",
  "Maono",
  "Hollyland",
  "Sony",
  "Kingston"
];

export function CatalogoClient({ initialProducts }: { initialProducts: Candy[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parámetros de URL iniciales
  const initialCategoryParam = searchParams.get("cat") || "all";
  const initialSearchParam = searchParams.get("search") || "";

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategoryParam);
  const [selectedBrand, setSelectedBrand] = useState("Todas las Marcas");
  const [searchQuery, setSearchQuery] = useState(initialSearchParam);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [sortBy, setSortBy] = useState("relevance");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(300);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Referencia, estado y físicas de Framer Motion con gradientes dinámicos
  const categoryConstraintsRef = useRef<HTMLDivElement>(null);
  const categoryInnerRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const dragX = useMotionValue(0);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  useEffect(() => {
    const updateConstraints = () => {
      if (categoryInnerRef.current && categoryConstraintsRef.current) {
        const innerW = categoryInnerRef.current.scrollWidth;
        const outerW = categoryConstraintsRef.current.offsetWidth;
        const maxScroll = Math.max(0, innerW - outerW);
        setDragWidth(maxScroll);
        setShowRightFade(maxScroll > 10);
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  useMotionValueEvent(dragX, "change", (latest) => {
    setShowLeftFade(latest < -10);
    setShowRightFade(latest > -dragWidth + 10);
  });

  const ITEMS_PER_PAGE = 24;

  const { totalItems } = useCart();

  // Actualizar filtros si cambia el parámetro de la URL
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
    const search = searchParams.get("search");
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Reset de página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedBrand, deferredSearchQuery, sortBy, maxPriceFilter]);

  // Filtrado y ordenamiento de productos
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Filtrado por categoría
      if (activeCategory !== "all") {
        const prodCats = Array.isArray(product.category) ? product.category : [product.category];
        const hasCat = prodCats.some(
          c => String(c).toLowerCase().trim() === activeCategory.toLowerCase().trim()
        );
        if (!hasCat) return false;
      }

      // 2. Filtrado por marca
      if (selectedBrand !== "Todas las Marcas") {
        const brandMatch = (product.flavor || product.variant || "").toLowerCase().includes(selectedBrand.toLowerCase()) ||
                           product.name.toLowerCase().includes(selectedBrand.toLowerCase());
        if (!brandMatch) return false;
      }

      // 3. Filtrado por precio máximo
      if (product.price > maxPriceFilter) {
        return false;
      }

      // 4. Búsqueda por texto (nombre, descripción, marca)
      if (deferredSearchQuery.trim()) {
        const query = deferredSearchQuery.toLowerCase().trim();
        const inName = product.name.toLowerCase().includes(query);
        const inDesc = product.description.toLowerCase().includes(query);
        const inBrand = (product.flavor || product.variant || "").toLowerCase().includes(query);
        if (!inName && !inDesc && !inBrand) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "popular") return (b.stock || 0) - (a.stock || 0);
      return 0; // relevancia por defecto
    });
  }, [initialProducts, activeCategory, selectedBrand, maxPriceFilter, deferredSearchQuery, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSelectedBrand("Todas las Marcas");
    setSearchQuery("");
    setSortBy("relevance");
    setMaxPriceFilter(300);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white selection:bg-[#8A2BE2] selection:text-white font-body relative overflow-x-hidden">
      
      {/* 1. HEADER GLASSMORPHISM */}
      <header className="sticky top-0 z-50 bg-[#0B0B0C]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4">
          
          {/* Logo Mania Tech Oficial */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group py-2">
            <img
              src={getImagePath("/images/logo maniatech.png")}
              alt="Mania Tech Logo"
              loading="lazy"
              decoding="async"
              className="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_16px_rgba(138,43,226,0.5)]"
            />
          </Link>

          {/* Buscador Central PC */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, modelo o marca (ej. G502 X, Kumara)..."
              className="w-full bg-[#141416] border border-white/10 rounded-full py-2.5 pl-11 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-gray-300 mx-4">
            <Link href="/catalogo" onClick={() => setActiveCategory("all")} className="hover:text-[#8A2BE2] transition-colors">
              CATÁLOGO
            </Link>
            <button onClick={() => setActiveCategory("teclados")} className="hover:text-[#8A2BE2] transition-colors uppercase">
              PC
            </button>
            <button onClick={() => setSearchQuery("apple")} className="hover:text-[#8A2BE2] transition-colors uppercase">
              MANZANA
            </button>
            <button onClick={() => setActiveCategory("controles")} className="hover:text-[#8A2BE2] transition-colors uppercase">
              JUEGOS
            </button>
          </nav>

          {/* Acciones & Carrito */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#141416] border border-white/10 hover:border-[#8A2BE2]/50 transition-all text-white group"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00FF00] text-[#0B0B0C] font-black text-xs flex items-center justify-center shadow-lg shadow-[#00FF00]/50 animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-[#141416] border border-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

      </header>

      {/* Menú Móvil Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-24 bg-[#0B0B0C]/95 backdrop-blur-2xl border-b border-white/10 z-40 px-6 py-6 space-y-4 shadow-2xl"
          >
            <Link href="/" className="block text-gray-300 font-semibold py-2">
              ← Volver al Inicio
            </Link>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span className="text-[#00FF00] font-semibold">🟢 6 Meses de Garantía en Chacao</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO / CABECERA DEL CATÁLOGO */}
      <section className="relative py-8 sm:py-12 bg-gradient-to-b from-[#141416] to-[#0B0B0C] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 text-[#8A2BE2] text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5" /> Ecosistema Hardware & Gaming Venezuela
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Catálogo de Productos
              </h1>
              <p className="text-gray-400 text-sm mt-2 max-w-xl">
                Explora el inventario de periféricos, mandos y herramientas para creadores. Precios al mayor disponibles desde 3 piezas.
              </p>
            </div>

            {/* Badges de Garantía */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-300">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141416] border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#8A2BE2]" />
                <span>6 Meses de Garantía</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141416] border border-white/10">
                <MapPin className="w-4 h-4 text-[#00FF00]" />
                <span>Tienda en Chacao</span>
              </div>
            </div>
          </div>

          {/* Slider de Categorías (Físicas Framer Motion con Gradientes Dinámicos en Bordes) */}
          <div ref={categoryConstraintsRef} className="mt-8 pt-6 border-t border-white/5 relative overflow-hidden">
            {/* Indicadores Dinámicos de Desbordamiento (Fades laterales adaptativos) */}
            <div
              className={`pointer-events-none absolute left-0 top-6 bottom-0 w-12 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent z-10 transition-opacity duration-300 ${
                showLeftFade ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`pointer-events-none absolute right-0 top-6 bottom-0 w-16 bg-gradient-to-l from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent z-10 transition-opacity duration-300 ${
                showRightFade ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="overflow-hidden w-full py-1 cursor-grab active:cursor-grabbing select-none">
              <motion.div
                ref={categoryInnerRef}
                drag="x"
                style={{ x: dragX }}
                dragConstraints={{ left: -dragWidth, right: 0 }}
                dragElastic={0.12}
                dragTransition={{ power: 0.25, timeConstant: 250 }}
                className="flex items-center gap-2.5 w-max"
              >
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
                        isActive
                          ? "bg-[#8A2BE2] text-white shadow-lg shadow-[#8A2BE2]/30 border border-[#8A2BE2]"
                          : "bg-[#141416] text-gray-300 hover:bg-[#1C1C20] border border-white/5 hover:border-white/15"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#8A2BE2]"}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. BARRA DE FILTROS & BÚSQUEDA SECUNDARIA */}
      <section className="py-4 bg-[#0B0B0C] border-b border-white/5 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Filtros Rápidos (Marcas & Ordenamiento) */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              
              {/* Select de Marcas */}
              <div className="relative shrink-0">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-[#141416] border border-white/10 rounded-xl py-2 px-3 pr-8 text-xs text-gray-200 font-semibold focus:outline-none focus:border-[#8A2BE2] appearance-none cursor-pointer"
                >
                  {BRANDS.map((brand, idx) => (
                    <option key={idx} value={brand} className="bg-[#141416] text-white">
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Select de Ordenamiento */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#141416] border border-white/10 rounded-xl py-2 px-3 pr-8 text-xs text-gray-200 font-semibold focus:outline-none focus:border-[#8A2BE2] appearance-none cursor-pointer"
                >
                  <option value="relevance" className="bg-[#141416] text-white">Ordenar por: Relevancia</option>
                  <option value="price-low" className="bg-[#141416] text-white">Precio: Menor a Mayor</option>
                  <option value="price-high" className="bg-[#141416] text-white">Precio: Mayor a Menor</option>
                  <option value="popular" className="bg-[#141416] text-white">Más Populares / Stock</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Botón de Reset Filtros */}
              {(activeCategory !== "all" || selectedBrand !== "Todas las Marcas" || searchQuery || sortBy !== "relevance") && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              )}

            </div>

            {/* Contador de Resultados */}
            <div className="text-xs text-gray-400 font-semibold w-full sm:w-auto text-right">
              Mostrando <span className="text-white font-bold">{filteredProducts.length}</span> productos
            </div>

          </div>
        </div>
      </section>

      {/* 4. GRID DE PRODUCTOS */}
      <section className="py-12 bg-[#0B0B0C] min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  candy={product}
                  onOpenDetails={(candy) => setSelectedProduct(candy)}
                />
              ))}
            </div>
          ) : (
            /* Estado Sin Resultados */
            <div className="text-center py-20 bg-[#141416] rounded-3xl border border-white/5 max-w-xl mx-auto p-8">
              <div className="w-16 h-16 rounded-2xl bg-[#8A2BE2]/10 flex items-center justify-center text-[#8A2BE2] mx-auto mb-4 border border-[#8A2BE2]/20">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">
                No encontramos productos con estos filtros
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Intenta ajustar la búsqueda, elegir otra categoría o seleccionar "Todas las Marcas".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-[#8A2BE2] text-white font-display font-bold text-sm hover:bg-[#6441A5] transition-all shadow-lg shadow-[#8A2BE2]/30"
              >
                Restablecer Filtros
              </button>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1C1C20] text-white"
              >
                Anterior
              </button>

              <div className="flex items-center gap-1.5 px-3">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all ${
                      currentPage === i + 1
                        ? "bg-[#8A2BE2] text-white shadow-md"
                        : "bg-[#141416] text-gray-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-[#141416] border border-white/10 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1C1C20] text-white"
              >
                Siguiente
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. FOOTER & COMPONENTES FLOTANTES */}
      <Footer />

      <FloatingCart onClick={() => setIsCartOpen(true)} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />

      {selectedProduct && (
        <ProductModal
          candy={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
