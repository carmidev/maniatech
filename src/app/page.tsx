"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ArrowRight, Menu, X, MapPin, ShieldCheck, 
  Zap, Search, Flame, Sparkles, Star, Tag, CheckCircle2,
  Headphones, Mouse, Keyboard, Video, ChevronRight
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
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
          <Link href="/" className="flex items-center gap-3 shrink-0 group py-1">
            <img
              src={getImagePath("/images/logo maniatech.png")}
              alt="Mania Tech Logo"
              className="h-16 sm:h-[96px] w-auto object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_16px_rgba(138,43,226,0.5)]"
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
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-gray-300">
            <Link href="/catalogo" className="hover:text-[#8A2BE2] transition-colors">
              Catálogo
            </Link>
            <Link href="/catalogo?cat=audifonos" className="hover:text-[#8A2BE2] transition-colors">
              Audífonos
            </Link>
            <Link href="/catalogo?cat=mouses" className="hover:text-[#8A2BE2] transition-colors">
              Mouses
            </Link>
            <Link href="/catalogo?cat=teclados" className="hover:text-[#8A2BE2] transition-colors">
              Teclados
            </Link>
            <Link href="#reviews" className="hover:text-[#8A2BE2] transition-colors">
              Reviews
            </Link>
          </nav>

          {/* Botones de Acción / Carrito */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#141416] border border-white/10 hover:border-[#8A2BE2]/50 hover:bg-[#1A1A1E] transition-all text-white group"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-[#8A2BE2]" />
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

        {/* Búsqueda en Móvil */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full bg-[#141416] border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8A2BE2]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </header>

      {/* Menú Móvil Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-28 bg-[#0B0B0C]/95 backdrop-blur-2xl border-b border-white/10 z-40 px-6 py-8 space-y-6 shadow-2xl"
          >
            <div className="flex flex-col space-y-4 font-display font-semibold text-lg">
              <Link
                href="/catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-white hover:text-[#8A2BE2] py-2 border-b border-white/5"
              >
                <span>Ver Catálogo Completo</span>
                <ChevronRight className="w-5 h-5 text-[#8A2BE2]" />
              </Link>
              <Link
                href="/catalogo?cat=audifonos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-[#8A2BE2]" />
                  <span>Audífonos & Audio</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                href="/catalogo?cat=mouses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Mouse className="w-5 h-5 text-[#8A2BE2]" />
                  <span>Mouses & Mousepads</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                href="/catalogo?cat=teclados"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-[#8A2BE2]" />
                  <span>Teclados Mecánicos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                href="/catalogo?cat=streaming"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-gray-300 hover:text-white py-2"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-[#8A2BE2]" />
                  <span>Cámaras & Streaming</span>
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
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141416] border border-[#8A2BE2]/40 text-xs sm:text-sm font-semibold text-[#8A2BE2] mb-6 shadow-lg shadow-[#8A2BE2]/10"
            >
              <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
              <span>Tienda Física en Chacao & Garantía Local 6 Meses 💚</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05] mb-6"
            >
              Todo tu hardware tech. <br />
              <span className="bg-gradient-to-r from-white via-gray-100 to-[#8A2BE2] bg-clip-text text-transparent">
                En un solo lugar.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-gray-400 font-normal leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Equipa tu setup de juegos y streaming con marcas creadoras premium. 
              Garantía local imbatible y precios al mayor comprando 3 o más productos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowingShadow glowColor="purple" className="h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full group border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A2BE2]/20 rounded-full blur-2xl group-hover:bg-[#8A2BE2]/30 transition-all" />
                
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#8A2BE2]/20 text-[#8A2BE2] text-xs font-bold uppercase tracking-wider mb-4 border border-[#8A2BE2]/30">
                    🔥 Promo Especial
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                    Compra 3 productos y obtén precio al mayor
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Combina audífonos, mouses, teclados o accesorios. El descuento se aplica automáticamente.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                  <span className="text-xs text-[#00FF00] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Descuento Automático
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#8A2BE2] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </GlowingShadow>

            <GlowingShadow glowColor="green" className="h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full group border border-white/10 bg-gradient-to-b from-[#141416] to-[#1A1A22]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/10 rounded-full blur-2xl group-hover:bg-[#00FF00]/20 transition-all" />

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00FF00]/10 text-[#00FF00] text-xs font-bold uppercase tracking-wider mb-4 border border-[#00FF00]/30">
                    🟢 Streamer Pack
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                    Micrófonos & Cámaras 4K
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Audio cristalino y video en alta resolución con Maono, Hollyland y Elgato.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                  <span className="text-xs text-gray-300 font-semibold">
                    Equipa tu setup de Twitch
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#00FF00] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </GlowingShadow>

            <GlowingShadow glowColor="red" className="h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full group border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0033]/15 rounded-full blur-2xl group-hover:bg-[#FF0033]/25 transition-all" />

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF0033]/15 text-[#FF0033] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FF0033]/30">
                    🛡️ Respaldo Local
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight">
                    6 Meses de Garantía en Chacao
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Atención presencial rápida en nuestra tienda física. Cero trabas ni demoras.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                  <span className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#8A2BE2]" /> Caracas, Venezuela
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#FF0033] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </GlowingShadow>
          </div>

        </div>
      </AuroraBackground>

      {/* 3. MARQUEE TICKER OFERTAS & SOCIAL PROOF */}
      <section className="bg-[#141416] py-3.5 border-y border-white/10 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-display font-extrabold text-xs uppercase tracking-widest text-gray-300">
          <span className="flex items-center gap-2 text-[#00FF00]">
            <Zap className="w-4 h-4" /> Promoción Mayorista: Compra 3 productos y obtén precio al mayor
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-2 text-[#8A2BE2]">
            <ShieldCheck className="w-4 h-4" /> 6 Meses de Garantía Directa en Chacao
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-2 text-white">
            <Flame className="w-4 h-4 text-[#FF0033]" /> Marcas Aliadas: Redragon, Logitech, Razer, Fantech
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-2 text-[#00FF00]">
            <CheckCircle2 className="w-4 h-4" /> Envíos Nacionales Rápidos en Venezuela
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-2 text-[#8A2BE2]">
            <Sparkles className="w-4 h-4" /> Síguenos en Instagram @MANIAJUEGOS
          </span>
          <span className="text-gray-600">•</span>
        </div>
      </section>

      {/* 4. MARCAS OFICIALES ALIADAS */}
      <section id="marcas" className="py-12 bg-[#0B0B0C] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-8">
            Marcas Aliadas Oficiales
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center opacity-70 hover:opacity-100 transition-opacity">
            {BRANDS.map((b, i) => (
              <div
                key={i}
                className="py-3 px-4 rounded-xl bg-[#141416] border border-white/5 text-gray-400 font-display font-black text-xs sm:text-sm tracking-wider text-center hover:border-[#8A2BE2]/50 hover:text-white transition-all cursor-default"
              >
                {b.logo}
              </div>
            ))}
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
                className="snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-auto glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between group border border-white/10"
              >
                <div>
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#18181C] mb-5 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    className="px-4 py-2.5 rounded-xl bg-[#8A2BE2] text-white font-display font-bold text-xs hover:bg-[#6441A5] transition-colors flex items-center gap-2 shadow-lg shadow-[#8A2BE2]/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. PROMO VENTAS AL MAYOR BANNER (#promo) */}
      <section id="promo" className="py-16 bg-gradient-to-r from-[#141416] via-[#1A1824] to-[#141416] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00] text-xs font-bold uppercase tracking-wider mb-4">
                <Tag className="w-3.5 h-3.5" /> Promoción Especial Mania Tech
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
                ¿SABÍAS QUE PUEDES COMPRAR AL MAYOR DESDE 3 PIEZAS?
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                En Mania Tech facilitamos el acceso a revendedores, negocios y gamers que arman su setup completo. 
                Lleva cualquier combinación de 3 productos del catálogo y disfruta de nuestras tarifas especiales al mayor.
              </p>
              <div className="space-y-3 font-semibold text-sm text-gray-200 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />
                  <span>Combina libremente audífonos, mouses, teclados o almacenamiento.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />
                  <span>Garantía oficial de 6 meses directa en Caracas.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />
                  <span>Atención rápida por WhatsApp y catálogo actualizado.</span>
                </div>
              </div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#00FF00] text-[#0B0B0C] font-display font-extrabold text-base hover:bg-[#00DD00] transition-all shadow-xl shadow-[#00FF00]/20"
              >
                <span>Ir al Catálogo y Aplicar Promo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/10 bg-[#0B0B0C]/60 flex flex-col items-center text-center justify-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6441A5] to-[#8A2BE2] flex items-center justify-center mb-6 shadow-xl shadow-[#8A2BE2]/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest text-[#8A2BE2] font-extrabold mb-1">
                Ahorro Inmediato
              </span>
              <h3 className="font-display font-black text-4xl text-white mb-2">
                DESCUENTO AL MAYOR
              </h3>
              <p className="text-gray-400 text-sm max-w-sm mb-6">
                Automático en tu carrito de compras al alcanzar 3 unidades en tu orden.
              </p>
              <div className="px-6 py-2.5 rounded-full bg-[#18181C] border border-[#8A2BE2]/40 text-[#00FF00] font-mono text-sm font-bold">
                APLICA A TODO EL INVENTARIO 🚀
              </div>
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
                className="snap-center shrink-0 w-[85vw] sm:w-[360px] lg:w-auto glass-card glass-card-hover rounded-3xl p-5 flex flex-col justify-between group border border-white/10"
              >
                <div>
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#18181C] mb-5 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    className="px-4 py-2.5 rounded-xl bg-[#141416] border border-[#8A2BE2]/50 text-white font-display font-bold text-xs hover:bg-[#8A2BE2] transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-[#8A2BE2]/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
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
              </motion.div>
            ))}
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
