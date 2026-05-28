"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ArrowRight, Menu, X, MapPin } from "lucide-react";
import { LollipopLogo } from "@/components/LollipopLogo";
import { CloudDivider } from "@/components/CloudDivider";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

import { Footer } from "@/components/Footer";
import { CandyLab } from "@/components/CandyLab";
import Link from "next/link";
import { CANDIES, Candy } from "@/app/mock-data";
import { getImagePath } from "@/utils/imagePath";
import { ProductModal } from "@/components/ProductModal";
import { FloatingCart } from "@/components/FloatingCart";
import { useRouter } from "next/navigation";

/* Constantes de badge para los destacados */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-brand-blue text-brand-darkgray",
  bestseller: "bg-secondary text-white",
  viral: "bg-brand-blue text-brand-darkgray",
  exclusivo: "bg-brand-brown text-white",
  top: "bg-primary text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  bestseller: "Bestseller",
  viral: "Nuevo",
  exclusivo: "Exclusivo",
  top: "🔥 Lo más vendido",
};

const renderWithNumberFont = (text: string) => {
  return text.split(/(\d+)/).map((part, i) => {
    if (/\d+/.test(part)) {
      return <span key={i} className="font-numbers font-semibold tracking-normal leading-normal">{part}</span>;
    }
    return part;
  });
};

/* Lógica de normalización de categorías consistente con el catálogo */
const normalizeCategory = (cat: string | string[] | null): string[] => {
  if (!cat) return ["top"];
  const cats = Array.isArray(cat) ? cat : [cat];
  return cats.map(c =>
    String(c)
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("pikantes", "picantes")
      .replace("tendencias", "top")
  );
};

const HERO_IMAGES = [
  "/images/anaksinfondo1.png",
  "/images/anaksinfondo2.png",
  "/images/anaksinfondo3.png",
  "/images/anaksinfondo4.png",
];

/* Fallback inicial con mock data filtrada por top/tendencias */
const topMock = CANDIES.filter((c) => {
  const categories = Array.isArray(c.category) ? c.category : [c.category];
  return categories.some(cat => {
    const safeCat = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return safeCat === 'top' || safeCat === 'tendencias' || safeCat === 'lo mas vendido' || safeCat === 'lo_mas_vendido';
  });
});

let initialFeatured = topMock.slice(0, 3);
if (initialFeatured.length < 3) {
  const featuredIds = new Set(initialFeatured.map(c => c.id));
  const remaining = CANDIES.filter(c => !featuredIds.has(c.id));
  initialFeatured = [...initialFeatured, ...remaining.slice(0, 3 - initialFeatured.length)];
}
const INITIAL_FEATURED = initialFeatured;

export default function Home() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [featuredCandies, setFeaturedCandies] = useState<Candy[]>(INITIAL_FEATURED);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { getProductsWithInventory } = await import('./catalogo/actions');
        const result = await getProductsWithInventory();

        if (result.success && result.data) {
          const allMapped = result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            ownerReview: item.owner_review || "",
            price: Number(item.price) || 0,
            images: item.images && item.images.length > 0 ? item.images : ["/images/catalog/placeholder.png"],
            category: normalizeCategory(item.category),
            stock: item.inventory?.reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0) || 0,
          }));

          const topMapped = allMapped
            .filter((c: Candy) => {
              const cats = Array.isArray(c.category) ? c.category : [c.category];
              return cats.includes("top") || cats.includes("viral") || cats.includes("nuevo") || cats.includes("lo_mas_vendido");
            });

          let featured = topMapped.slice(0, 3);
          
          if (featured.length < 3) {
            const featuredIds = new Set(featured.map(c => c.id));
            const remainingProducts = allMapped.filter((c: Candy) => !featuredIds.has(c.id));
            const needed = 3 - featured.length;
            featured = [...featured, ...remainingProducts.slice(0, needed)];
          }

          setFeaturedCandies(featured);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    // STOP MOTION FLIPBOOK EFFECT (Cambiamos rápido sin esperas)
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 350); // Cambia cada 350 milisegundos
    return () => clearInterval(timer);
  }, []);

  // Local storage logic moved to checkout page

  const { totalItems } = useCart();

  return (
    <main className="min-h-screen bg-white">

      {/* ── SVG FILTERS COMPARTIDOS (GRADIENT MAPS PARA EMOJIS) ── */}
      <svg className="hidden" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
      </svg>

      {/* ── NAVBAR PÍLDORA FLOTANTE (REDUCCIÓN EXTREMA PREVENCIÓN OVERFLOW) ── */}
      <div className="fixed top-4 inset-x-0 z-[99] flex justify-center pointer-events-none px-3 sm:px-6 lg:px-0">
        <nav className="pointer-events-auto w-full lg:w-max lg:min-w-[740px] max-w-4xl bg-white/95 backdrop-blur-xl rounded-full shadow-xl shadow-black/10 h-[58px] lg:h-20 flex items-center justify-between border border-white/60 px-3 sm:px-5 lg:px-8">

          <button
            type="button"
            className="flex items-center gap-1 md:gap-2 cursor-pointer p-0 relative shrink-0"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
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
          </button>

          <div className="flex items-center gap-1 sm:gap-4 lg:gap-8 shrink-0">
            <div className="hidden lg:flex items-center gap-7 font-display text-sm tracking-wide">
              <Link href="/#lab" className="text-brand-darkgray/80 hover:text-primary transition-colors">
                Candy Reviews
              </Link>
              <Link href="/#ubicaciones" className="text-brand-darkgray/80 hover:text-primary transition-colors">
                Ubicaciones
              </Link>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-2 lg:gap-3">
              <Link
                href="/catalogo"
                className="flex bg-brand-red text-white px-4 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-black text-[11px] lg:text-sm hover:scale-105 transition-all shadow-md shadow-brand-red/30 items-center gap-1 sm:gap-1 shrink-0"
              >
                <span className="hidden lg:inline">Ir al Catálogo</span>
                <span className="lg:hidden uppercase tracking-tighter">Catálogo</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 stroke-[3]" />
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
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
              className="absolute top-[calc(100%+10px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-[24px] shadow-xl shadow-black/10 border border-black/5 overflow-hidden lg:hidden flex flex-col p-5 gap-4 pointer-events-auto"
            >
              <nav className="flex flex-col gap-3 text-center">
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
                href="/catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-brand-red text-white w-full py-3 rounded-full font-black text-[14px] tracking-wide hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-brand-red/30 mt-1"
              >
                Ir al Catálogo <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HERO SECTION - ESTILO PAWSY EXACTO + CANDY CRUSH ── */}
      <section className="relative min-h-[85dvh] lg:h-[100dvh] flex flex-col overflow-hidden"
        style={{ background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #eab8ac 45%, #86ccef 100%)' }}>
        {/* Layer 1: Nubes Blancas Flotantes Absolutas (z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Nube flotante decorativa - izquierda */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[50%] md:top-[55%] lg:top-[18%] left-[4%] md:left-[15%] lg:left-[4%] opacity-60 md:scale-150 lg:scale-100 origin-center"
          >
            <svg width="130" height="72" viewBox="0 0 130 72" fill="none" className="overflow-visible">
              <path d="M10,62 C10,62 0,60 0,52 C0,44 8,40 16,42 C16,30 26,22 38,24 C40,14 50,8 62,10 C70,4 82,4 90,12 C100,8 112,14 114,24 C122,24 130,32 128,40 C126,48 118,52 110,50 C110,60 100,68 85,65 C75,72 65,72 55,65 C40,72 25,70 10,62 Z" fill="white" />
            </svg>
          </motion.div>

          {/* Nube flotante decorativa - derecha */}
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-[45%] md:top-[50%] lg:top-[12%] right-[6%] md:right-[15%] lg:right-[6%] opacity-50 md:scale-150 lg:scale-100 origin-center"
          >
            <svg width="170" height="95" viewBox="0 0 170 95" fill="none">
              <path d="M20,75 C10,75 0,65 0,55 C0,40 15,30 30,35 C35,20 55,10 75,15 C85,5 105,5 115,15 C130,10 145,20 150,35 C165,35 175,45 170,60 C165,75 150,80 140,75 C135,85 120,95 105,90 C95,98 75,98 65,90 C55,98 35,95 25,85 C22,80 20,80 20,75 Z" fill="white" />
            </svg>
          </motion.div>
        </div>

        {/* ── FLOATING CANDIES (z-50) - Elevado para visibilidad máxima ── */}
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">

          {/* Chupeta Hero (chupeta1.png) - Plantada en la nube de la derecha */}
          {/* Chupeta - Escritorio/Tablet */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[28%] md:top-[46%] lg:top-[10%] right-[5%] md:right-[15%] lg:right-[5%] z-10 hidden md:block"
          >
            <img
              src={getImagePath("/images/chupeta1.png")}
              alt="Chupeta Dolce"
              className="w-48 h-auto drop-shadow-2xl filter brightness-110 rotate-12 opacity-100"
            />
          </motion.div>

          {/* Barra de Chocolate (Izquierda) */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [-8, 2, -8]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[12%] md:top-[51%] lg:top-[78px] left-[-2%] md:left-[14%] lg:left-2 z-10 hidden md:block"
          >
            <img
              src={getImagePath("/images/chocolate.svg")}
              alt="Chocolate Dolce"
              className="w-36 md:w-44 lg:w-56 h-auto drop-shadow-2xl -rotate-6 brightness-110 opacity-90 lg:opacity-100"
            />
          </motion.div>
        </div>

        {/* Chocolate Reubicado (Sólo Móvil - Sobre la nube inferior izquierda) */}


        {/* Caramelo Sorpresa (Escritorio - Oculto en Móvil y Tablet) */}
        <motion.div
          animate={{
            y: [55, -90, 55], // Sube más alto para despegarse de la nube
            rotate: [15, 375],
            scale: [0.8, 1.3, 0.8] // Un pelín más grande al subir
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[30px] md:bottom-[90px] left-[38%] md:left-[44%] z-25 pointer-events-none hidden lg:block"
        >
          <img
            src={getImagePath("/images/caramelodolce.png")}
            alt="Caramelo Dolce"
            className="w-28 md:w-32 h-auto drop-shadow-2xl brightness-110"
          />
        </motion.div>



        {/* ── CONTENIDO TEXTO (IZQUIERDA) - AL FRENTE (z-30) ── */}
        <div className="min-h-[100dvh] md:min-h-[60dvh] lg:min-h-0 flex-none lg:flex-1 flex items-start relative z-30 px-6 sm:px-8 lg:px-[10%] pt-[130px] md:pt-[160px] lg:pt-52 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-full max-w-[650px] lg:max-w-[550px] text-center lg:text-left lg:items-start lg:-mt-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[30px] sm:text-5xl lg:text-[50px] font-display-main font-bold text-brand-darkgray leading-[1.1] lg:leading-[1.1] mb-1 lg:mb-1 tracking-tight text-center lg:text-left flex flex-col items-center lg:items-start px-2"
            >
              <span className="block">El primer Coffee</span>
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-1 lg:mt-1">
                <span className="font-script text-[0.85em] md:text-[0.9em] text-primary relative -rotate-1 drop-shadow-md bg-white px-4 md:px-5 py-1 lg:py-1.5 rounded-[2rem] border-2 border-primary/20 shadow-sm">
                  Candy Bar
                </span>
                <span className="whitespace-nowrap">de</span>
              </div>
              <span className="block mt-1 lg:mt-1">Venezuela</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-[16px] sm:text-[17px] lg:text-[21px] text-brand-darkgray/90 mb-3 lg:mb-4 leading-[1.4] lg:leading-relaxed font-body font-normal mx-auto lg:mx-0 w-full max-w-[320px] sm:max-w-[480px] lg:max-w-[620px] text-center lg:text-left px-2"
            >
              La combinación perfecta entre el mejor café y las{' '}
              <br className="hidden lg:block" />
              golosinas más exclusivas en un solo lugar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative inline-block"
            >
              {/* Chupeta Anclada (Solo Móvil) */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20px] -right-[69px] z-10 md:hidden pointer-events-none"
              >
                <img
                  src={getImagePath("/images/chupeta1.png")}
                  alt="Chupeta"
                  className="w-28 h-auto drop-shadow-2xl rotate-12"
                />
              </motion.div>

              {/* Chocolate Anclado (Solo Móvil) */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-10, -5, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40px] -left-16 z-10 md:hidden pointer-events-none"
              >
                <img
                  src={getImagePath("/images/chocolate.svg")}
                  alt="Chocolate"
                  className="w-32 h-auto drop-shadow-2xl"
                />
              </motion.div>
              <Link
                href="/catalogo"
                className="bg-brand-red text-white px-8 lg:px-8 py-3 lg:py-3.5 rounded-full font-bold text-[16px] lg:text-[16px] inline-flex items-center gap-1.5 lg:gap-2 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-red/50 active:scale-95 transition-all duration-300 shadow-lg shadow-brand-red/40 group pointer-events-auto"
              >
                Ver todas las golosinas <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 lg:left-auto lg:right-[5%] z-20 pointer-events-none w-full lg:w-[50%] flex justify-center lg:justify-end items-end opacity-100 translate-y-1 md:translate-y-[20px] lg:translate-y-0">


          <img
            key={HERO_IMAGES[currentImageIndex]}
            src={getImagePath(HERO_IMAGES[currentImageIndex]) || undefined}
            className="w-full max-w-[280px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[600px] object-contain object-bottom block h-[46dvh] md:h-[43dvh] lg:h-[85dvh] drop-shadow-2xl transition-none origin-bottom"
            alt="Dolce Candy Showcase"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
            }}
          />
        </div>

        {/* Layer 3: Organic Fluffy Cloud Border (Estilo Flat Shadow - Efecto Marco Profundo) */}
        <div className="absolute bottom-6 md:bottom-[18px] lg:bottom-[-1px] left-0 w-full z-30 pointer-events-none h-[140px] md:h-[175px] lg:h-[220px]">
          <svg viewBox="0 -20 1200 160" preserveAspectRatio="none" className="w-full h-full overflow-visible scale-x-[1.7] scale-y-100 origin-bottom md:scale-125 lg:scale-100 lg:origin-center">

            {/* Capa Trasera (Sombra Plana / Flat Shadow) */}
            <path
              fill="#ffffff"
              opacity="0.6"
              transform="translate(0, -15)"
              d="M 0 250 L 0 35 
                 C 10 7, 70 19, 80 46 
                 C 100 11, 180 23, 200 62 
                 C 210 54, 260 67, 270 89 
                 C 290 52, 380 59, 400 96 
                 C 420 77, 470 86, 490 107 
                 C 510 73, 580 70, 600 100 
                 C 615 90, 665 95, 680 113 
                 C 710 62, 790 51, 820 94 
                 C 840 72, 900 69, 920 86 
                 C 935 54, 995 38, 1010 60 
                 C 1030 41, 1100 31, 1120 51 
                 C 1140 22, 1180 6, 1200 25 
                 L 1200 250 Z"
            />

            {/* Capa Frontal (Nube Principal) */}
            <path
              fill="#ffffff"
              d="M 0 250 L 0 35 
                 C 10 7, 70 19, 80 46 
                 C 100 11, 180 23, 200 62 
                 C 210 54, 260 67, 270 89 
                 C 290 52, 380 59, 400 96 
                 C 420 77, 470 86, 490 107 
                 C 510 73, 580 70, 600 100 
                 C 615 90, 665 95, 680 113 
                 C 710 62, 790 51, 820 94 
                 C 840 72, 900 69, 920 86 
                 C 935 54, 995 38, 1010 60 
                 C 1030 41, 1100 31, 1120 51 
                 C 1140 22, 1180 6, 1200 25 
                 L 1200 250 Z"
            />
          </svg>
        </div>
        {/* Parche blanco móvil para sellar la transición al elevar el piso */}
        <div className="absolute bottom-[-2px] left-0 w-full h-[45px] bg-white z-20 lg:hidden pointer-events-none px-0 mx-0 mt-0"></div>

      </section>


      {/* ── DULCES DESTACADOS ── */}
      <section className="relative bg-white z-10 pt-4 lg:pt-4 pb-8 px-6 mt-0 lg:mt-0">

        <div className="max-w-7xl mx-auto">

          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-black uppercase tracking-widest text-primary mb-2"
              >
                ✦ Lo más buscado
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display text-brand-darkgray leading-tight"
              >
                Golosinas <span className="text-primary">Destacadas</span>
              </motion.h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline underline-offset-4 whitespace-nowrap"
            >
              Ver catálogo completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid de destacados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCandies.map((candy, i) => (
              <motion.div
                key={candy.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md shadow-gray-100 border border-gray-50 flex flex-col"
              >
                {/* Área Clickeable Principal */}
                <div onClick={() => setSelectedProduct(candy)} className="flex flex-col flex-1 cursor-pointer">
                  {/* Imagen */}
                  <div className="relative h-64 overflow-hidden bg-white p-6 shrink-0">
                    <img
                      src={getImagePath(candy.images?.[0]) || undefined}
                      alt={candy.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradiente inferior */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Badge */}
                    {(() => {
                      let activeBadges: string[] = [];
                      if (candy.badge) {
                        activeBadges = [candy.badge];
                      } else {
                        const cats = Array.isArray(candy.category) ? candy.category : [candy.category];
                        const safeCats = cats.map(c => (c || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());
                        if (safeCats.includes("viral")) activeBadges.push("viral");
                        if (safeCats.includes("nuevo")) activeBadges.push("nuevo");
                        if (safeCats.includes("top") || safeCats.includes("tendencias") || safeCats.includes("lo mas vendido") || safeCats.includes("lo_mas_vendido")) activeBadges.push("top");
                        if (safeCats.includes("bestseller")) activeBadges.push("bestseller");
                        activeBadges = Array.from(new Set(activeBadges));
                      }

                      if (activeBadges.length === 0) return null;

                      return (
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                          {activeBadges.map(badge => BADGE_LABELS[badge] ? (
                            <span key={badge} className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md ${BADGE_STYLES[badge]}`}>
                              {BADGE_LABELS[badge]}
                            </span>
                          ) : null)}
                        </div>
                      );
                    })()}
                    {/* Precio sobre la imagen */}
                    <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-primary font-numbers font-semibold text-xl px-3 py-1 rounded-2xl shadow-sm">
                      ref {candy.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Info (Textos) */}
                  <div className="px-5 pt-5 flex flex-col flex-1">
                    <h3 className="text-lg font-display text-brand-darkgray mb-1 leading-snug">{renderWithNumberFont(candy.name)}</h3>
                    <p className="text-sm font-body font-normal text-brand-darkgray/70 line-clamp-2 leading-relaxed">{candy.description}</p>
                  </div>
                </div>

                {/* Botón (Aislado) */}
                <div className="px-5 pb-5 mt-auto">
                  <a
                    href="/catalogo"
                    className="mt-4 w-full py-2.5 rounded-xl bg-brand-red/8 text-brand-red font-bold text-sm hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingBasket className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    Ver en catálogo
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANDY LAB ── */}
      <section id="lab" className="relative bg-[#FDF4F5] z-10 pt-[110px] lg:pt-40 min-h-screen">
        <div className="absolute top-0 left-0 w-full -translate-y-[2px]">
          <CloudDivider color="fill-white" flip />
        </div>
        <CandyLab />
        <div className="absolute bottom-0 left-0 w-full translate-y-[2px]">
          <CloudDivider color="fill-white" />
        </div>
      </section>

      {/* ── UBICACIONES ── */}
      <section id="ubicaciones" className="relative bg-white z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-widest text-primary mb-2"
          >
            ✦ Encuéntranos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display text-brand-darkgray mb-20"
          >
            Nuestras <span className="text-primary">Sedes</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {[
              {
                city: "Campo Claro",
                area: "Caracas",
                address: "Avenida Principal de Campo Claro, Edificio San Antonio",
                reference: "Bajando por la calle de la taberna el greco, en la siguiente esquina, frente a la Pescadería Puerto Santo. Local de toldos de rayas rojas.",
                schedule: ["Lun-Vier: 8AM - 6PM", "Sab: 10AM - 4PM", "Dom: Cerrado"],
                image: "/images/locations/dc-campoclaro.jpeg",
                mapUrl: "https://www.google.com/maps/place/Dolce+Candy+boutique/@10.4918386,-66.8312842,17z/data=!4m6!3m5!1s0x8c2a592bab8cb72b:0x193d00d576f1fa49!8m2!3d10.49191!4d-66.8312609!16s%2Fg%2F11sg06nlzq?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
              },
              {
                city: "El Bosque",
                area: "Caracas",
                address: "Av Principal del Bosque, Edificio El Bosque",
                reference: "Local de la Esquina con Santa Marias Rojas, Frente al módulo de policía, bajando hacia Chacaito.",
                schedule: ["Lun-Vier: 9AM - 7PM", "Sáb: 10AM - 6PM", "Dom: 12PM - 6PM"],
                image: "/images/locations/dc-elbosque.jpeg",
                mapUrl: "https://www.google.com/maps/place/Dolce+Candy+Boutique/@10.4943073,-66.8678368,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a59005758af9d:0x726cc440dca98fcf!8m2!3d10.4943073!4d-66.8678368!16s%2Fg%2F11xn3czjry?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
              }
            ].map((loc, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                className="group rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row h-full min-h-[320px] relative z-20"
                style={{ backgroundColor: 'rgb(245, 226, 221)' }}
              >
                {/* Imagen de la Sede */}
                <div className="w-full lg:w-2/5 relative overflow-hidden bg-white h-64 lg:h-auto">
                  <img
                    src={getImagePath(loc.image)}
                    alt={loc.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Info de la Sede */}
                <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col text-left flex-1">
                  <div className="flex items-center gap-2 mb-4 shrink-0">
                    <MapPin className="w-4 h-4 text-brand-darkred" />
                    <span className="text-[10px] font-display text-brand-darkred uppercase tracking-widest bg-brand-darkred/10 px-2 py-0.5 rounded-full">{loc.area}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-display mb-3 text-brand-darkgray leading-tight">{loc.city}</h3>
                    <p className="text-brand-darkgray/60 font-body font-normal text-sm leading-relaxed mb-2">{loc.address}</p>
                    <p className="text-brand-darkgray/40 font-body font-medium text-xs leading-snug italic mb-4">Punto de Referencia: {loc.reference}</p>
                  </div>

                  <div className="space-y-2 py-6 border-t border-brand-brown/10 mb-6 shrink-0">
                    <p className="text-[10px] font-display text-brand-darkgray/40 uppercase tracking-widest mb-3">Horarios</p>
                    {loc.schedule.map((line, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-body">
                        <span className="text-brand-darkgray/50 font-normal uppercase">{line.split(': ')[0]}</span>
                        <span className="text-brand-darkgray/80 font-bold uppercase">{line.split(': ')[1]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="shrink-0">
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full lg:w-max inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/50 hover:bg-white border border-brand-darkred/10 text-brand-darkred font-black text-[10px] uppercase tracking-widest rounded-full transition-all group/map"
                    >
                      <MapPin className="w-3.5 h-3.5 group-hover/map:scale-110 transition-transform" />
                      Ver mapa en Google
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />
      <ProductModal
        candy={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <FloatingCart onClick={() => setIsCartOpen(true)} />
    </main>
  );
}
