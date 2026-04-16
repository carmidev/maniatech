"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ArrowRight, Menu, X, MapPin } from "lucide-react";
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

      {/* ── NAVBAR PÍLDORA FLOTANTE (REFACTORIZADO PARA ESTABILIDAD TOTAL) ── */}
      <div className="fixed top-4 left-0 right-0 z-50 px-5 flex justify-center pointer-events-none">
        <nav className="w-full max-w-4xl max-w-[calc(100vw-40px)] bg-white/95 backdrop-blur-xl rounded-full shadow-xl shadow-black/10 px-3 lg:px-8 h-16 flex items-center justify-between border border-white/60 pointer-events-auto overflow-hidden">
          <button
            type="button"
            className="flex items-center gap-1 md:gap-2 cursor-pointer p-0 relative"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Logo Móvil - Compactado */}
            <img
              src={getImagePath("/images/logo-oficial.png")}
              alt="Dolce Candy Logo"
              className="h-11 lg:hidden object-contain"
            />

            {/* Logo Desktop (Restaurado) */}
            <div className="hidden lg:flex items-center gap-1 lg:gap-2">
              <div className="relative pointer-events-none w-[46px] h-[46px] flex items-center justify-center shrink-0 -mr-2 -ml-2">
                <img src={getImagePath("/images/espiral-dolce.png")} alt="Dolce Isotipo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] max-w-none object-contain drop-shadow-sm pointer-events-none" />
              </div>
              <img src={getImagePath("/images/letras-dolce-candy-blanco.png")} alt="Dolce Candy" className="h-[34px] object-contain mt-1 invert opacity-90 pointer-events-none" />
            </div>
          </button>

          <div className="flex items-center gap-1.5 lg:gap-8">
            <div className="hidden lg:flex items-center gap-7 font-display text-sm tracking-wide">
              <Link href="#lab" className="text-brand-darkgray/80 hover:text-primary transition-colors">
                Candy Lab
              </Link>
              <Link href="#ubicaciones" className="text-brand-darkgray/80 hover:text-primary transition-colors">
                Ubicaciones
              </Link>
            </div>

            <div className="flex items-center gap-1 lg:gap-3">
              <Link
                href="/catalogo"
                className="flex bg-brand-red text-white px-2 lg:px-5 py-1.5 lg:py-2.5 rounded-full font-black text-[9px] lg:text-sm hover:scale-105 transition-all shadow-md shadow-brand-red/30 items-center gap-1"
              >
                <span className="hidden lg:inline">Ir al Catálogo</span>
                <span className="lg:hidden uppercase tracking-tighter">Catálogo</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 stroke-[3]" />
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 lg:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingBasket className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[9px] lg:text-[10px] font-black w-3.5 h-3.5 lg:w-4 lg:h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
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
              className="absolute top-[calc(100%+10px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-3xl shadow-xl shadow-black/10 border border-black/5 overflow-hidden lg:hidden flex flex-col p-6 gap-6"
            >
              <nav className="flex flex-col gap-5 text-center">
                <Link
                  href="#lab"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-brand-darkgray hover:text-primary transition-colors"
                >
                  Candy Lab
                </Link>
                <Link
                  href="#ubicaciones"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-brand-darkgray hover:text-primary transition-colors"
                >
                  Ubicaciones
                </Link>
              </nav>
              <Link
                href="/catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-brand-red text-white w-full py-4 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-brand-red/40"
              >
                Ir al Catálogo <ArrowRight className="w-5 h-5 stroke-[3]" />
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
            className="absolute top-[42%] lg:top-[18%] left-[4%] lg:left-[4%] opacity-60"
          >
            <svg width="130" height="72" viewBox="0 0 130 72" fill="none">
              <path d="M10,62 C10,62 0,60 0,52 C0,44 8,40 16,42 C16,30 26,22 38,24 C40,14 50,8 62,10 C70,4 82,4 90,12 C100,8 112,14 114,24 C122,24 130,32 128,40 C126,48 118,52 110,50 C110,58 100,64 90,62 Z" fill="white" />
            </svg>
          </motion.div>

          {/* Nube flotante decorativa - derecha */}
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-[34%] lg:top-[12%] right-[6%] lg:right-[6%] opacity-50"
          >
            <svg width="170" height="95" viewBox="0 0 170 95" fill="none">
              <path d="M14,82 C14,82 0,80 0,68 C0,56 10,50 22,53 C20,36 34,24 50,26 C52,14 66,6 82,8 C92,2 108,2 118,12 C130,6 146,14 148,28 C158,28 170,38 168,52 C166,64 156,70 144,68 C144,78 132,86 120,84 C116,92 104,96 94,88 C84,94 70,92 64,82 Z" fill="white" />
            </svg>
          </motion.div>
        </div>

        {/* ── FLOATING CANDIES (z-50) - Elevado para visibilidad máxima ── */}
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">

          {/* Chupeta Hero (chupeta1.png) - Plantada en la nube de la derecha */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[31%] lg:top-[10%] right-[-8%] lg:right-[5%] z-10"
          >
            <img
              src={getImagePath("/images/chupeta1.png")}
              alt="Chupeta Dolce"
              className="w-40 lg:w-48 h-auto drop-shadow-2xl filter brightness-110 rotate-12 opacity-95 lg:opacity-100"
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
            className="absolute top-[12%] lg:top-[12%] left-[-2%] lg:left-[2%] z-10 hidden lg:block"
          >
            <img
              src={getImagePath("/images/chocolate.svg")}
              alt="Chocolate Dolce"
              className="w-28 lg:w-48 h-auto drop-shadow-2xl -rotate-6 brightness-110 opacity-90 lg:opacity-100"
            />
          </motion.div>
        </div>

        {/* Chocolate Reubicado (Sólo Móvil - Sobre la nube inferior izquierda) */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-15, -10, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[44%] left-[8%] z-10 lg:hidden pointer-events-none"
        >
          <img
            src={getImagePath("/images/chocolate.svg")}
            alt="Chocolate Decorativo"
            className="w-28 h-auto drop-shadow-xl rotate-6 brightness-110 opacity-90"
          />
        </motion.div>

        {/* Caramelo Sorpresa (Asset Personalizado: caramelodolce.png - Detrás de la nube z-30) */}
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
          className="absolute bottom-[30px] md:bottom-[90px] left-[38%] md:left-[44%] z-25 pointer-events-none"
        >
          <img
            src={getImagePath("/images/caramelodolce.png")}
            alt="Caramelo Dolce"
            className="w-28 md:w-32 h-auto drop-shadow-2xl brightness-110"
          />
        </motion.div>

        {/* ── CONTENIDO TEXTO (IZQUIERDA) - AL FRENTE (z-30) ── */}
        <div className="min-h-[100dvh] lg:min-h-0 flex-none lg:flex-1 flex items-start lg:items-center relative z-30 px-6 sm:px-8 lg:px-[12%] pt-[114px] lg:pt-0 pointer-events-none">
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
              className="text-[36px] sm:text-6xl lg:text-6xl font-display-main font-bold text-brand-darkgray leading-[1.1] lg:leading-[1.05] mb-4 lg:mb-4 tracking-tight text-center lg:text-left flex flex-col items-center lg:items-start px-2"
            >
              <span className="block lg:inline whitespace-nowrap lg:whitespace-normal">¡Vuelve a ser</span>
              <span className="flex items-center justify-center lg:justify-start gap-2 flex-wrap -mt-1 lg:mt-3">
                <span className="font-script text-[0.85em] md:text-[0.95em] text-primary relative -rotate-2 drop-shadow-md bg-white px-4 md:px-6 py-1 lg:py-2 rounded-[2rem] border-2 border-primary/20 mx-1 shadow-sm">
                  un niño
                </span>
                <span>hoy!</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-[15px] sm:text-[18px] text-brand-darkgray/90 mb-2 sm:mb-8 lg:mb-3 leading-relaxed font-body font-normal mx-auto lg:mx-0 max-w-[280px] sm:max-w-[480px] lg:max-w-[420px] text-center lg:text-justify px-2"
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
                className="bg-brand-red text-white px-8 py-3.5 rounded-full font-bold text-[16px] inline-flex items-center gap-2 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-red/50 active:scale-95 transition-all duration-300 shadow-lg shadow-brand-red/40 group pointer-events-auto"
              >
                Ver todos los dulces <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── IMAGEN CENTRAL / PERSONAJE - BOTTOM STACK (z-20) ── */}
        <div className="relative min-h-[55dvh] lg:min-h-0 flex-none lg:absolute lg:bottom-0 lg:right-[5%] z-20 pointer-events-none w-full lg:w-[50%] flex justify-center lg:justify-end items-end opacity-100 mt-[-45dvh] lg:mt-0">
          <img
            key={HERO_IMAGES[currentImageIndex]}
            src={getImagePath(HERO_IMAGES[currentImageIndex]) || undefined}
            className="w-full max-w-[280px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[600px] object-contain object-bottom block h-[60dvh] lg:h-[85dvh] drop-shadow-2xl transition-none origin-bottom"
            alt="Dolce Candy Showcase"
          />
        </div>

        {/* Layer 3: Pawsy Foreground Transition Strip (Método de Escritorio: Alineación Natural) */}
        <div className="absolute bottom-[-1px] lg:bottom-[-1px] left-0 w-full lg:left-0 lg:w-full z-30 pointer-events-none">
          <img
            src="https://framerusercontent.com/images/t49nGcvSU3RT2ngSvvjRRajdes4.png"
            alt="Cloud Transition Strip"
            className="w-full h-[160px] md:h-[222px] object-cover object-bottom origin-bottom"
          />
        </div>



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
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-primary font-numbers font-semibold text-xl px-3 py-1 rounded-2xl shadow-sm">
                    ${candy.price.toFixed(2)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-display text-brand-darkgray mb-1 leading-snug">{candy.name}</h3>
                  <p className="text-sm font-body font-normal text-brand-darkgray/70 line-clamp-2 flex-1 leading-relaxed">{candy.description}</p>
                  <Link
                    href="/catalogo"
                    className="mt-4 w-full py-2.5 rounded-xl bg-brand-red/8 text-brand-red font-bold text-sm hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
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
                address: "Av. Principal de Campo Claro &, Avenida D, Caracas 1071",
                schedule: ["Lun-Vier: 8AM - 6PM", "Sab: 10AM - 4PM", "Dom: Cerrado"],
                image: "/images/tiendadolce.png",
              },
              {
                city: "El Bosque",
                area: "Caracas",
                address: "Av Principal del Bosque, Caracas",
                schedule: ["Lun-Vier: 9AM - 7PM", "Sáb: 10AM - 6PM", "Dom: 12PM - 6PM"],
                image: "/images/tiendadolce.png",
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
                  {/* Overlay sutil solo para que no brille demasiado la foto, pero MUY neutro */}
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Info de la Sede */}
                <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-brand-darkred" />
                    <span className="text-[10px] font-display text-brand-darkred uppercase tracking-widest bg-brand-darkred/10 px-2 py-0.5 rounded-full">{loc.area}</span>
                  </div>

                  <h3 className="text-3xl font-display mb-4 text-brand-darkgray leading-tight">{loc.city}</h3>
                  <p className="text-brand-darkgray/60 font-body font-normal mb-8 text-sm leading-relaxed">{loc.address}</p>

                  <div className="space-y-2 pt-6 border-t border-brand-brown/10">
                    <p className="text-[10px] font-display text-brand-darkgray/40 uppercase tracking-widest mb-3">Horarios</p>
                    {loc.schedule.map((line, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-body">
                        <span className="text-brand-darkgray/50 font-normal uppercase">{line.split(': ')[0]}</span>
                        <span className="text-brand-darkgray/80 font-bold uppercase">{line.split(': ')[1]}</span>
                      </div>
                    ))}
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
