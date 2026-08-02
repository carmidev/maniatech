"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, ArrowRight, Menu, X, MapPin, ShieldCheck, 
  Zap, Search, Flame, Sparkles, Star, Tag, CheckCircle2,
  Headphones, Mouse, Keyboard, Video, ChevronRight, Gamepad2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ProductModal } from "@/components/ProductModal";
import { FloatingCart } from "@/components/FloatingCart";
import { useRouter } from "next/navigation";
import { Spotlight } from "@/components/ui/Spotlight";
import { BorderBeam } from "@/components/ui/BorderBeam";
import AuroraBackground from "@/components/ui/animated-background";
import GlowingShadow from "@/components/ui/glowing-shadow";
import FlowButton from "@/components/ui/flow-button";
import { Marquee } from "@/components/ui/marquee";
import { BRAND_LIST } from "@/components/BrandLogos";
import { getImagePath } from "@/utils/imagePath";

// Interfaz para productos tech
export interface TechProduct {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badge?: string;
  badgeColor?: "purple" | "green" | "red";
  stockStatus: string;
  image: string;
  brand: string;
  description: string;
}

// Datos Mocks de Productos Mania Tech (Hardware, Periféricos y Streaming)
const TECH_PRODUCTS: TechProduct[] = [
  // Hot Deals 🔥
  {
    id: "tech-1",
    name: "Audífonos Redragon Zeus H510 RGB Wireless",
    category: "audifonos",
    categoryName: "Audífonos & Audio",
    price: 59.99,
    oldPrice: 75.00,
    rating: 5,
    badge: "Hot Deal 🔥",
    badgeColor: "red",
    stockStatus: "En Stock (Chacao)",
    image: getImagePath("/images/catalog/headset_redragon.png"),
    brand: "Redragon",
    description: "Sonido envolvente 7.1 surround, almohadillas de memoria con cancelación pasiva de ruido y micrófono omnidireccional extraíble."
  },
  {
    id: "tech-2",
    name: "Mouse Gamer Logitech G502 X LIGHTSPEED",
    category: "mouses",
    categoryName: "Mouses & Mousepads",
    price: 119.99,
    oldPrice: 139.99,
    rating: 5,
    badge: "Top Venta 🏆",
    badgeColor: "purple",
    stockStatus: "Pocas unidades",
    image: getImagePath("/images/catalog/mouse_logitech.png"),
    brand: "Logitech G",
    description: "Switches híbridos óptico-mecánicos LIGHTFORCE, sensor HERO 25K de máxima precisión y botón DPI ajustable."
  },
  {
    id: "tech-3",
    name: "Teclado Mecánico Redragon Kumara K552 RGB 60%",
    category: "teclados",
    categoryName: "Teclados Mecánicos",
    price: 45.00,
    oldPrice: 55.00,
    rating: 5,
    badge: "Popular ⭐",
    badgeColor: "green",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/keyboard_redragon.png"),
    brand: "Redragon",
    description: "Switches Outemu Red de rápida respuesta, chasis de aluminio reforzado e iluminación RGB por tecla totalmente personalizable."
  },

  // Descuentos 💥
  {
    id: "tech-4",
    name: "Micrófono de Condensador Maono AU-A04 USB Kit",
    category: "microfonos",
    categoryName: "Micrófonos & Audio",
    price: 49.99,
    oldPrice: 65.00,
    rating: 5,
    badge: "Oferta 🏷️",
    badgeColor: "red",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/mic_maono.png"),
    brand: "Maono",
    description: "Incluye brazo articulado de metal, filtro anti-pop y araña shock mount. Tasa de muestreo profesional 192kHz/24bit."
  },
  {
    id: "tech-5",
    name: "Control Inalámbrico Sony PS5 DualSense Edge Pro",
    category: "controles",
    categoryName: "Mandos & Gaming",
    price: 199.99,
    oldPrice: 220.00,
    rating: 5,
    badge: "Descuento 💥",
    badgeColor: "purple",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/controller_ps5.png"),
    brand: "Sony",
    description: "Gatillos adaptativos personalizables, palancas traseras mapeables y perfiles de juego intercambiables al instante."
  },
  {
    id: "tech-6",
    name: "Disco Sólido SSD NVMe M.2 2TB Kingston FURY Renegade",
    category: "almacenamiento",
    categoryName: "Almacenamiento SSD",
    price: 145.00,
    oldPrice: 170.00,
    rating: 5,
    badge: "Super Speed ⚡",
    badgeColor: "green",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/ssd_kingston.png"),
    brand: "Kingston",
    description: "Velocidad de lectura extrema hasta 7,300MB/s con disipador térmico de aluminio. Compatible con PC Gaming y PS5."
  },

  // Novedades Streamer Gear 🚀
  {
    id: "tech-7",
    name: "Cámara Web Elgato Facecam Pro 4K60",
    category: "streaming",
    categoryName: "Cámaras & Streaming",
    price: 249.99,
    rating: 5,
    badge: "Nuevo 🚀",
    badgeColor: "purple",
    stockStatus: "Pocas unidades",
    image: getImagePath("/images/catalog/webcam_elgato.png"),
    brand: "Elgato",
    description: "Sensor Sony STARVIS de grado fotográfico profesional, enfoque automático avanzado y lente Elgato Prime Lens f/2.0."
  },
  {
    id: "tech-8",
    name: "Sistema de Micrófono Inalámbrico Hollyland Lark M1 Duo",
    category: "microfonos",
    categoryName: "Micrófonos & Audio",
    price: 129.99,
    rating: 5,
    badge: "Novedad ✨",
    badgeColor: "green",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/mic_hollyland.png"),
    brand: "Hollyland",
    description: "Cancelación de ruido HearClear con un solo clic, alcance hasta 200m y estuche de carga portátil compacto."
  },
  {
    id: "tech-9",
    name: "Mousepad XXL RGB Fantech Agility MP903 Pro",
    category: "mouses",
    categoryName: "Mouses & Mousepads",
    price: 28.00,
    rating: 5,
    badge: "Nuevo 🚀",
    badgeColor: "purple",
    stockStatus: "En Stock",
    image: getImagePath("/images/catalog/mousepad_fantech.png"),
    brand: "Fantech",
    description: "Superficie de tela micro-texturizada impermeabilizada de 900x400mm con costuras anti-desgaste y bordes RGB brillantes."
  }
];

// Marcas aliadas oficiales
const BRANDS = [
  { name: "Logitech G", logo: "LOGITECH G" },
  { name: "Razer", logo: "RAZER" },
  { name: "Corsair", logo: "CORSAIR" },
  { name: "Asus ROG", logo: "ASUS ROG" },
  { name: "Fantech", logo: "FANTECH" },
  { name: "Redragon", logo: "REDRAGON" },
  { name: "Maono", logo: "MAONO" },
  { name: "Hollyland", logo: "HOLLYLAND" },
];

// Reviews de clientes
const REVIEWS = [
  {
    name: "Gabriel V.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Gamer / Streamer",
    rating: 5,
    title: "¡Los mejores de Caracas!",
    comment: "Compré el combo de micrófono Maono y los audífonos Redragon. La atención en la tienda física de Chacao fue de primera y la garantía de 6 meses da 100% de confianza."
  },
  {
    name: "Anya R.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "Creadora de Contenido",
    rating: 5,
    title: "Envío súper rápido al interior",
    comment: "El envío a Valencia llegó en menos de 24 horas. El paquete muy bien embalado y el teclado Kumara funciona brutal para mis streams."
  },
  {
    name: "Luke M.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Editor de Video",
    rating: 5,
    title: "Promo al mayor inbatible",
    comment: "Aproveché la promo de llevar 3 productos para equipar mi setup y me aplicaron el descuento al mayor automáticamente. 100% recomendados."
  },
  {
    name: "Esther K.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Competidora Esports",
    rating: 5,
    title: "Mouse G502 X original",
    comment: "Productos 100% originales con sus sellos de marca. El mouse es una nave y el agarre es perfecto. Definitivamente mi tienda de confianza."
  },
  {
    name: "Carlos P.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "Setup Enthusiast",
    rating: 5,
    title: "Asesoría personalizada",
    comment: "Me guiaron por Instagram @MANIAJUEGOS sobre qué audífonos elegir para mi presupuesto. Da gusto comprar en tiendas con verdadera cultura gaming."
  },
  {
    name: "Kim L.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    role: "Streamer Twitch",
    rating: 5,
    title: "Calidad y precio justo",
    comment: "El estante de productos en la web está impecable. Fácil de navegar y agregar al carrito sin complicaciones. ¡Sigan así!"
  }
];

export default function Home() {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    router.prefetch("/catalogo");
  }, [router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = (product: TechProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      ownerReview: "",
      price: product.price,
      images: [product.image],
      category: product.category,
      variant: product.brand,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white selection:bg-[#8A2BE2] selection:text-white font-body relative overflow-x-hidden">
      
      {/* 1. HEADER NAVEGACIÓN STICKY CON GLASSMORPHISM */}
      <header className="sticky top-0 z-50 bg-[#0B0B0C]/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
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

          {/* Barra de Búsqueda Predictiva Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mouses, teclados, audífonos, combos..."
              className="w-full bg-[#141416] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </form>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-gray-300">
            <Link href="/catalogo" className="hover:text-[#8A2BE2] transition-colors">
              CATÁLOGO
            </Link>
            <Link href="/catalogo?cat=teclados" className="hover:text-[#8A2BE2] transition-colors">
              PC
            </Link>
            <Link href="/catalogo?search=apple" className="hover:text-[#8A2BE2] transition-colors">
              MANZANA
            </Link>
            <Link href="/catalogo?cat=controles" className="hover:text-[#8A2BE2] transition-colors">
              JUEGOS
            </Link>
          </nav>

          {/* Botones de Acción / Carrito */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#141416] border border-white/10 hover:border-[#8A2BE2]/50 hover:bg-[#1A1A1E] transition-all text-white group"
              aria-label="Abrir Carrito"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform text-[#8A2BE2]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00FF00] text-[#0B0B0C] font-black text-xs flex items-center justify-center shadow-lg shadow-[#00FF00]/50 animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full bg-[#141416] border border-white/10 text-white hover:text-[#8A2BE2]"
              aria-label="Menú Móvil"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-24 bg-[#0B0B0C]/95 backdrop-blur-2xl border-b border-white/10 z-40 px-6 py-8 space-y-6 shadow-2xl"
          >
            <div className="flex flex-col space-y-4 font-display font-semibold text-lg">
              <Link
                href="/catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-white hover:text-[#8A2BE2] py-2 border-b border-white/5"
              >
                <span>CATÁLOGO</span>
                <ChevronRight className="w-5 h-5 text-[#8A2BE2]" />
              </Link>
              <Link
                href="/catalogo?cat=teclados"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-[#8A2BE2]" />
                  <span>PC</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                href="/catalogo?search=apple"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#8A2BE2]" />
                  <span>MANZANA</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                href="/catalogo?cat=controles"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2"
              >
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-[#8A2BE2]" />
                  <span>JUEGOS</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2 text-[#00FF00]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tienda Física en Chacao, Caracas</span>
              </div>
              <div className="flex items-center gap-2 text-[#8A2BE2]">
                <ShieldCheck className="w-4 h-4" />
                <span>6 Meses de Garantía Directa</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO BANNER SECTION WITH AURORA BACKGROUND */}
      <AuroraBackground className="pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-white/5 min-h-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8A2BE2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center flex flex-col items-center justify-center max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#141416]/90 backdrop-blur-md border border-[#8A2BE2]/50 text-xs sm:text-sm font-bold text-[#8A2BE2] mb-6 shadow-[0_0_25px_rgba(138,43,226,0.25)] text-center mx-auto"
            >
              <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
              <span>Tienda Física en Chacao & Garantía Local 6 Meses 💚</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] mb-6 text-center filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            >
              CONSTRUYE TU UNIVERSO. <br />
              <span className="bg-gradient-to-r from-white via-gray-100 to-[#00FF00] bg-clip-text text-transparent filter drop-shadow-[0_0_25px_rgba(0,255,0,0.4)]">
                EL HARDWARE QUE TU SETUP MERECE.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-gray-200 font-medium leading-relaxed mb-8 max-w-2xl mx-auto text-center filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              Encuentra el inventario gamer y de creadores más codiciado de Caracas con asesoría técnica y envíos rápidos a todo el país.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link href="/catalogo" className="w-full sm:w-auto">
                <FlowButton variant="primary" glowColor="purple" className="w-full sm:w-auto px-8 py-4 text-base">
                  <span>Arma tu Setup Ahora</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </FlowButton>
              </Link>

              <a href="#promo" className="w-full sm:w-auto">
                <FlowButton variant="secondary" glowColor="green" className="w-full sm:w-auto px-8 py-4 text-base">
                  <Tag className="w-4 h-4 text-[#00FF00]" />
                  <span>Ver Promo Mayorista</span>
                </FlowButton>
              </a>
            </motion.div>
          </div>


        </div>
      </AuroraBackground>

      {/* 4. MARCAS OFICIALES ALIADAS */}
      <section id="marcas" className="py-12 bg-[#0B0B0C] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-8">
            Marcas Aliadas Oficiales
          </p>
          <div className="relative w-full overflow-hidden">
            {/* Gradientes laterales de difuminado neón */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#0B0B0C] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#0B0B0C] to-transparent z-10" />

            <Marquee pauseOnHover className="[--duration:22s] py-2">
              {BRAND_LIST.map((brand, i) => (
                <div
                  key={i}
                  className="mx-8 sm:mx-12 flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-default"
                >
                  {brand.svg}
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 5. HOT DEALS 🔥 (Layout Altech con Responsive Mobile Slider Táctil) */}
      <section className="py-16 lg:py-24 bg-[#0B0B0C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
                <span>Hot Deals</span>
                <Flame className="w-7 h-7 text-[#FF0033] animate-pulse" />
              </h2>
              <p className="text-gray-400 text-sm mt-1">Los periféricos más codiciados por la comunidad gamer.</p>
            </div>
            <Link
              href="/catalogo"
              className="text-xs sm:text-sm font-bold text-[#8A2BE2] hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
            {TECH_PRODUCTS.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-auto glass-card glass-card-hover rounded-xl p-4 flex flex-col justify-between group border border-white/10"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#1C1C22] via-[#141418] to-[#0E0E12] border border-white/5 mb-5 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
                    />
                    
                    <div className="absolute top-3 left-3 bg-[#FF0033] text-white font-display font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {product.badge}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-[#0B0B0C]/80 backdrop-blur-md text-[#00FF00] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[#00FF00]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-ping" />
                      {product.stockStatus}
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#8A2BE2] uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-[#8A2BE2] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <div>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-500 line-through block">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-display font-extrabold text-2xl text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2.5 rounded-xl bg-[#8A2BE2] text-white font-display font-bold text-xs hover:bg-[#6441A5] transition-colors flex items-center gap-2 shadow-lg shadow-[#8A2BE2]/20 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. PROMO VENTAS AL MAYOR BANNER 3D ESPACIAL (#promo) */}
      <section id="promo" className="py-20 lg:py-28 bg-[#09090C] border-y border-white/10 relative overflow-hidden">
        {/* Luces de Fondo 3D y Halo de Luz Neón */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#8A2BE2]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#00FF00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03),_transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Columna Izquierda: Mensaje & Simulador de Desbloqueo */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00] text-xs font-mono font-bold uppercase tracking-widest"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Beneficio Exclusivo Mayorista</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]"
              >
                ¿SABÍAS QUE PUEDES <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#00FF00]">
                  COMPRAR AL MAYOR
                </span> <br className="hidden sm:inline" />
                DESDE 3 PIEZAS?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl"
              >
                En Mania Tech facilitamos el acceso a revendedores, negocios y gamers que arman su setup completo. 
                Combina cualquier par de audífonos, mouses o teclados y la tarifa especial al mayor se activa de forma automática.
              </motion.p>

              {/* Widget Interactivo de Progreso 3-Piezas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-5 border border-white/10 bg-[#121216]/80 space-y-4 max-w-lg shadow-2xl"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-gray-400">Ponderador de Descuento:</span>
                  <span className="text-[#00FF00] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 3 / 3 Piezas (Desbloqueado 🎯)
                  </span>
                </div>

                {/* Barra de Progreso Neón */}
                <div className="relative w-full h-3 rounded-full bg-[#1A1A22] overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#8A2BE2] via-[#6441A5] to-[#00FF00] shadow-[0_0_12px_rgba(0,255,0,0.6)]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-gray-400">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400">1 Pza: Detal</div>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-300">2 Pzas: Combo</div>
                  <div className="p-1.5 rounded-lg bg-[#00FF00]/15 border border-[#00FF00]/40 text-[#00FF00] font-bold">3+ Pzas: Mayor 🔥</div>
                </div>
              </motion.div>

              {/* Botón CTA Neón */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="pt-2"
              >
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#00FF00] text-[#0B0B0C] font-display font-extrabold text-base hover:bg-[#00DD00] transition-all shadow-[0_0_30px_rgba(0,255,0,0.35)] hover:scale-105 group"
                >
                  <span>Ir al Catálogo y Armar Pedido</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Columna Derecha: Tarjeta 3D Espacial con Levitación de Productos */}
            <div className="lg:col-span-5 relative perspective-1000">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#181820] via-[#121216] to-[#0A0A0D] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group"
              >
                {/* Aura de Glow Trasero */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#8A2BE2]/30 to-[#00FF00]/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Badge de Descuento Destacado */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 text-[#8A2BE2] text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5" /> Ahorro Directo
                    </div>
                    <span className="text-xs font-mono text-[#00FF00] font-bold">Descuento Automático</span>
                  </div>

                  {/* Stack 3D de Productos Flotantes en Levitación */}
                  <div className="relative h-64 w-full flex items-center justify-center py-4">
                    
                    {/* Producto 1 (Fondo Izquierda - Audífonos) */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-2 top-2 w-36 h-36 rounded-2xl bg-[#1C1C24] border border-white/10 p-3 shadow-xl transform -rotate-6 z-10 flex flex-col items-center justify-center"
                    >
                      <img
                        src={getImagePath("/images/catalog/headset_redragon.png")}
                        alt="Audífonos"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                      <span className="text-[10px] font-bold text-gray-300 mt-1">Audífonos 7.1</span>
                    </motion.div>

                    {/* Producto 2 (Fondo Derecha - SSD) */}
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute right-2 bottom-2 w-36 h-36 rounded-2xl bg-[#1C1C24] border border-white/10 p-3 shadow-xl transform rotate-6 z-10 flex flex-col items-center justify-center"
                    >
                      <img
                        src={getImagePath("/images/catalog/ssd_kingston.png")}
                        alt="SSD NVMe"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                      <span className="text-[10px] font-bold text-gray-300 mt-1">SSD NVMe 2TB</span>
                    </motion.div>

                    {/* Producto 3 (Centro Frente - Mouse Gamer Hero) */}
                    <motion.div
                      animate={{ y: [0, -14, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="relative w-44 h-44 rounded-2xl bg-gradient-to-b from-[#242430] to-[#14141A] border border-[#00FF00]/40 p-4 shadow-[0_15px_35px_rgba(0,255,0,0.25)] z-20 flex flex-col items-center justify-center"
                    >
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#00FF00] text-[#0B0B0C] text-[9px] font-extrabold uppercase">
                        -25% OFF
                      </div>
                      <img
                        src={getImagePath("/images/catalog/mouse_logitech.png")}
                        alt="Mouse Gamer"
                        className="w-full h-full object-contain filter drop-shadow-lg"
                      />
                      <span className="text-xs font-extrabold text-white mt-1">Mouse Lightspeed</span>
                    </motion.div>

                  </div>

                  {/* Resumen del Beneficio */}
                  <div className="pt-4 border-t border-white/10 text-center">
                    <h3 className="font-display font-black text-2xl text-white mb-1">
                      DESCUENTO AL MAYOR
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Se calcula automáticamente en tu carrito al sumar 3 ítems cualesquiera.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. DESCUENTOS & NOVEDADES STREAMER 🏷️ */}
      <section className="py-16 lg:py-24 bg-[#0B0B0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
                <span>Novedades & Gear Streamer</span>
                <Sparkles className="w-7 h-7 text-[#8A2BE2]" />
              </h2>
              <p className="text-gray-400 text-sm mt-1">Herramientas de nivel profesional para creadores.</p>
            </div>
            <Link
              href="/catalogo?cat=streaming"
              className="text-xs sm:text-sm font-bold text-[#8A2BE2] hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>Ver Categoría</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
            {TECH_PRODUCTS.slice(3, 6).map((product) => (
              <div
                key={product.id}
                className="snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-auto glass-card glass-card-hover rounded-xl p-4 flex flex-col justify-between group border border-white/10"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#1C1C22] via-[#141418] to-[#0E0E12] border border-white/5 mb-5 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
                    />
                    
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#8A2BE2] text-white font-display font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-[#00FF00] uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-1 mb-2 line-clamp-2 leading-snug group-hover:text-[#8A2BE2] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                  <div>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-500 line-through block">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-display font-extrabold text-2xl text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2.5 rounded-xl bg-[#141416] border border-[#8A2BE2]/50 text-white font-display font-bold text-xs hover:bg-[#8A2BE2] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS (Comunidad Gaming & Social Proof) */}
      <section id="reviews" className="py-16 lg:py-24 bg-[#0E0E10] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A2BE2] mb-3 block">
              Testimonios de la Comunidad
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Customer Reviews ⭐
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Lo que opinan nuestros clientes gamers y creadores sobre la atención en Chacao y la velocidad de envíos.
            </p>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Gradientes laterales de difuminado neón */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#0E0E10] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#0E0E10] to-transparent z-10" />

            <Marquee pauseOnHover className="[--duration:25s] py-4">
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="w-[300px] sm:w-[360px] shrink-0 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#8A2BE2]/50 transition-all shadow-xl bg-[#141416]/80 backdrop-blur-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-full object-cover border border-[#8A2BE2]/40"
                        />
                        <div>
                          <h4 className="font-display font-bold text-sm text-white leading-tight">
                            {review.name}
                          </h4>
                          <span className="text-[11px] text-gray-400">{review.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[...Array(review.rating)].map((_, r) => (
                          <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-display font-semibold text-base text-white mb-2">
                      "{review.title}"
                    </h5>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-[#00FF00] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Compra Verificada Mania Tech
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

        </div>
      </section>

      {/* 9. NEWSLETTER / SUBE DE NIVEL CTA */}
      <section className="py-16 bg-[#0B0B0C] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#141416] to-[#0B0B0C]">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-[#8A2BE2]/20 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-block px-3 py-1 rounded-full bg-[#8A2BE2]/20 text-[#8A2BE2] text-xs font-bold uppercase tracking-wider mb-4 border border-[#8A2BE2]/30">
              Newsletter Mania Tech
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-4">
              Mantente al día con nuevos ingresos y ofertas
            </h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
              Recibe notificaciones exclusivas en tu correo sobre reposiciones de inventario, descuentos al mayor y sorteos de la comunidad.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias por suscribirte al newsletter de Mania Tech!");
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Ingresa tu correo electrónico..."
                className="w-full bg-[#0B0B0C] border border-white/15 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2BE2]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#8A2BE2] hover:bg-[#6441A5] text-white font-display font-bold text-sm transition-all shrink-0 shadow-lg shadow-[#8A2BE2]/30"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 10. FOOTER COMPONENTS & COMPONENTES FLOTANTES */}
      <Footer />

      {/* Floating Cart & Cart Drawer */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => { setIsCartOpen(false); router.push('/checkout'); }}
      />

      {/* Modal de Producto Seleccionado (Si aplica) */}
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
