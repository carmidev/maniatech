"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ArrowRight, Menu, X } from "lucide-react";
import { LollipopLogo } from "@/components/LollipopLogo";
import { CloudDivider } from "@/components/CloudDivider";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { CandyLab } from "@/components/CandyLab";
import Link from "next/link";
import { CANDIES, Candy } from "@/app/mock-data";
import { getImagePath } from "@/utils/imagePath";
import { ProductModal } from "@/components/ProductModal";
import { FloatingCart } from "@/components/FloatingCart";

/* Constantes de badge para los destacados */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-brand-blue text-brand-darkgray",
  bestseller: "bg-secondary text-white",
  viral: "bg-primary text-white",
  exclusivo: "bg-brand-brown text-white",
};

const BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  bestseller: "Bestseller",
  viral: "Viral",
  exclusivo: "Exclusivo",
};

const HERO_IMAGES = [
  "/images/anaksinfondo1.png",
  "/images/anaksinfondo2.png",
  "/images/anaksinfondo3.png",
  "/images/anaksinfondo4.png",
];

/* Seleccionamos los 3 productos con badge para mostrar como destacados */
const FEATURED_CANDIES = CANDIES.filter((c) => c.badge).slice(0, 3);

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Candy | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // STOP MOTION FLIPBOOK EFFECT (Cambiamos rápido sin esperas)
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 350); // Cambia cada 350 milisegundos
    return () => clearInterval(timer);
  }, []);
  const { totalItems } = useCart();

  return (
    <main className="min-h-screen bg-white">

      {/* ── SVG FILTERS COMPARTIDOS (GRADIENT MAPS PARA EMOJIS) ── */}
      <svg className="hidden" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
      </svg>

      {/* ── NAVBAR PÍLDORA FLOTANTE ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-5xl">
        <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-lg shadow-black/8 px-6 h-16 flex items-center justify-between border border-white/60">
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <div className="w-[44px] h-[44px] flex items-center justify-center overflow-hidden shrink-0 -ml-2 rounded-full">
              <img src={getImagePath("/images/espiral-dolce.png")} alt="Dolce Isotipo" className="w-full h-full object-cover scale-[1.3] drop-shadow-sm" />
            </div>
            <img src={getImagePath("/images/letras-dolce-candy-blanco.png")} alt="Dolce Candy" className="h-[34px] object-contain mt-1 invert opacity-90" />
          </Link>

          <div className="hidden lg:flex items-center gap-7 font-bold text-sm tracking-wide">
            <Link href="/catalogo" className="text-gray-600 hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="#ubicaciones" className="text-gray-600 hover:text-primary transition-colors">
              Ubicaciones
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/catalogo"
              className="bg-primary text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/30 hidden lg:flex items-center gap-2"
            >
              Ir al Catálogo <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBasket className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              className="absolute top-[calc(100%+10px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-3xl shadow-xl shadow-black/10 border border-black/5 overflow-hidden lg:hidden flex flex-col p-6 gap-6"
            >
              <nav className="flex flex-col gap-5 text-center">
                <Link
                  href="/catalogo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                >
                  Catálogo
                </Link>
                <Link
                  href="#ubicaciones"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                >
                  Ubicaciones
                </Link>
              </nav>
              <Link
                href="/catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-white w-full py-4 rounded-full font-black text-lg hover:bg-primary/90 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-md"
              >
                Ir al Catálogo <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO SECTION - ESTILO PAWSY EXACTO + CANDY CRUSH ── */}
      <section className="relative min-h-[100dvh] lg:h-[100dvh] overflow-hidden flex flex-col"
        style={{ background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #EDCFC3 40%, #93CDEA 100%)' }}>
        {/* Layer 1: Nubes Blancas Flotantes Absolutas (z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Nube flotante decorativa - izquierda */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[60%] lg:top-[18%] left-[4%] lg:left-[4%] opacity-60"
          >
            <svg width="130" height="72" viewBox="0 0 130 72" fill="none">
              <path d="M10,62 C10,62 0,60 0,52 C0,44 8,40 16,42 C16,30 26,22 38,24 C40,14 50,8 62,10 C70,4 82,4 90,12 C100,8 112,14 114,24 C122,24 130,32 128,40 C126,48 118,52 110,50 C110,58 100,64 90,62 Z" fill="white" />
            </svg>
          </motion.div>

          {/* Nube flotante decorativa - derecha */}
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-[52%] lg:top-[12%] right-[6%] lg:right-[6%] opacity-50"
          >
            <svg width="170" height="95" viewBox="0 0 170 95" fill="none">
              <path d="M14,82 C14,82 0,80 0,68 C0,56 10,50 22,53 C20,36 34,24 50,26 C52,14 66,6 82,8 C92,2 108,2 118,12 C130,6 146,14 148,28 C158,28 170,38 168,52 C166,64 156,70 144,68 C144,78 132,86 120,84 C116,92 104,96 94,88 C84,94 70,92 64,82 Z" fill="white" />
            </svg>
          </motion.div>
        </div>

        {/* ── FLOATING CANDIES (Candy Crush Inspiration) (z-10) ── */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {/* Caramelo elevado (Rojo Principal + Detalles Coral nativos por luminancia) */}
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 45, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] lg:top-[10%] left-[8%] lg:left-[5%] text-5xl lg:text-6xl z-20"
            style={{
              /* Monocromía a Rojo Principal: sepia(1) unifica el tono y el hue-rotate ajusta al Rojo (#EE3123). Las partes brillantes nativas se leen como Coral. */
              filter: "brightness(0.9) contrast(1.3) sepia(1) saturate(6) hue-rotate(-40deg) drop-shadow(0px 15px 15px rgba(238,49,35,0.4))"
            }}
          >
            🍬
          </motion.div>

          {/* Paleta gigante asomándose (SVG Chupeta Custom - Ubicada bajo la nube derecha) */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [10, 20, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[32%] lg:top-[28%] right-[2%] lg:right-[3%] w-[180px] lg:w-[260px] z-20 pointer-events-none"
            style={{
              filter: "drop-shadow(0px 25px 35px rgba(238,49,35,0.25))"
            }}
          >
            <img
              src={getImagePath("/images/chupeta.svg")}
              alt="Chupeta Dolce"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        {/* ── CONTENIDO TEXTO (IZQUIERDA) - AL FRENTE (z-30) ── */}
        <div className="min-h-[100dvh] lg:min-h-0 flex-none lg:flex-1 flex items-center lg:items-center relative z-30 px-6 sm:px-8 lg:px-[12%] pt-16 lg:pt-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-full max-w-[650px] lg:max-w-[750px] lg:mt-[-5%]"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.05] mb-4 sm:mb-6 tracking-tight flex flex-col items-start"
            >
              <span className="whitespace-nowrap">¡Vuelve a ser</span>
              <span className="mt-2 lg:mt-3 flex items-center flex-wrap gap-x-3">
                <span className="font-script text-[1.05em] md:text-[1.15em] text-primary inline-flex items-center -rotate-2 drop-shadow-sm bg-white px-3 md:px-5 py-1 lg:py-2 rounded-[2rem] border-2 border-primary/20">
                  un niño
                </span>
                <span>hoy!</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-[17px] sm:text-[18px] text-gray-800 mb-6 sm:mb-8 leading-relaxed font-semibold max-w-[420px] text-justify"
            >
              Dulces raros, colaboraciones exclusivas y la magia de Dolce Candy en cada caja.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/catalogo"
                className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-[16px] inline-flex items-center gap-2 hover:bg-[#c9181e] active:scale-95 transition-all shadow-lg shadow-primary/40 group pointer-events-auto"
              >
                Ver todos los dulces <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── IMAGEN CENTRAL / PERSONAJE - BOTTOM STACK (z-20) ── */}
        <div className="relative min-h-[85dvh] lg:min-h-0 flex-none lg:absolute lg:bottom-0 lg:right-[5%] z-20 pointer-events-none w-full lg:w-[50%] flex justify-center lg:justify-end items-end opacity-100">
          {/* NO AnimatePresence para lograr el efecto seco y rápido del flipbook */}
          <img
            key={HERO_IMAGES[currentImageIndex]}
            src={getImagePath(HERO_IMAGES[currentImageIndex]) || undefined}
            className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[600px] object-contain object-bottom block h-[85dvh] lg:h-[85dvh] drop-shadow-2xl transition-none origin-bottom"
            alt="Dolce Candy Showcase"
          />
        </div>

        {/* Layer 3: Pawsy Foreground Transition Strip EXACT MATCH (z-30) */}
        <div className="absolute bottom-[-1px] left-0 w-full z-30 pointer-events-none">
          <img
            src="https://framerusercontent.com/images/t49nGcvSU3RT2ngSvvjRRajdes4.png"
            alt="Cloud Transition Strip"
            className="w-full h-[120px] md:h-[222px] object-cover object-bottom"
          />
        </div>

        {/* Chocolate asomándose (SVG Chocolate Custom - Ubicado al centro sobre la nube) */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[2%] lg:bottom-[4%] left-[42%] -translate-x-1/2 w-[220px] lg:w-[320px] z-40 pointer-events-none"
          style={{
            filter: "drop-shadow(0px 20px 30px rgba(99,60,50,0.4))"
          }}
        >
          <img
            src={getImagePath("/images/chocolate.svg")}
            alt="Chocolate Dolce"
            className="w-full h-full object-contain"
          />
        </motion.div>

      </section>


      {/* ── DULCES DESTACADOS ── */}
      <section className="relative bg-white z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
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
                className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight"
              >
                Dulces <span className="text-primary">Destacados</span>
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
            {FEATURED_CANDIES.map((candy, i) => (
              <motion.div
                key={candy.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedProduct(candy)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md shadow-gray-100 border border-gray-50 flex flex-col cursor-pointer"
              >
                {/* Imagen */}
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <img
                    src={getImagePath(candy.images?.[0]) || undefined}
                    alt={candy.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradiente inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Badge */}
                  {candy.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-3 py-1 rounded-full ${BADGE_STYLES[candy.badge]}`}>
                      {BADGE_LABELS[candy.badge]}
                    </span>
                  )}
                  {/* Precio sobre la imagen */}
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-primary font-black text-lg px-3 py-1 rounded-2xl shadow-sm">
                    ${candy.price.toFixed(2)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-gray-900 mb-1 leading-snug">{candy.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 flex-1 leading-relaxed">{candy.description}</p>
                  <Link
                    href="/catalogo"
                    className="mt-4 w-full py-2.5 rounded-xl bg-primary/8 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingBasket className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    Ver en catálogo
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANDY LAB ── */}
      <section id="lab" className="relative bg-[#FDF4F5] z-10 pt-40 min-h-screen">
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
            className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-20"
          >
            Nuestras <span className="text-primary">Sedes</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                city: "Caracas - Campo Claro",
                address: "Av. Principal de Campo Claro &, Avenida D, Caracas 1071",
                schedule: ["Lun-Vier: 8AM - 6PM", "Sab: 10AM - 4PM", "Dom: Cerrado"],
                color: "bg-brand-cream",
                image: "/images/locations/campo-claro.png",
                blob: "60% 40% 30% 70% / 60% 30% 70% 40%"
              },
              {
                city: "Caracas - El Bosque",
                address: "Av Principal del Bosque, Caracas",
                schedule: ["Lun-Vier: 9AM - 7PM", "Sáb: 10AM - 6PM", "Dom: 12PM - 6PM"],
                color: "bg-brand-cream/80",
                image: "/images/locations/el-bosque.png",
                blob: "30% 70% 70% 30% / 30% 30% 70% 70%"
              }
            ].map((loc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${loc.color} p-8 sm:p-12 text-left border border-black/5 hover:border-primary/20 transition-all duration-500 group flex flex-col hover:-translate-y-2`}
                style={{ borderRadius: loc.blob }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📍</span>
                </div>

                <h3 className="text-3xl font-black mb-4 text-gray-900">{loc.city}</h3>
                <p className="text-gray-600 font-bold mb-2 text-lg">{loc.address}</p>
                <p className="text-primary font-black text-sm uppercase tracking-tighter italic">
                  {loc.schedule.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </p>
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
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
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
