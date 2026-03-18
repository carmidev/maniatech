"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ArrowRight } from "lucide-react";
import { LollipopLogo } from "@/components/LollipopLogo";
import { CloudDivider } from "@/components/CloudDivider";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CandyLab } from "@/components/CandyLab";
import SmoothScroll from "@/components/SmoothScroll";
import Link from "next/link";
import { CANDIES, Candy } from "@/app/mock-data";
import { getImagePath } from "@/utils/imagePath";
import { ProductModal } from "@/components/ProductModal";
import { FloatingCart } from "@/components/FloatingCart";

/* Constantes de badge para los destacados */
const BADGE_STYLES: Record<string, string> = {
  nuevo: "bg-blue-500 text-white",
  bestseller: "bg-amber-400 text-white",
  viral: "bg-primary text-white",
  exclusivo: "bg-purple-500 text-white",
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

  useEffect(() => {
    // STOP MOTION FLIPBOOK EFFECT (Cambiamos rápido sin esperas)
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 350); // Cambia cada 350 milisegundos
    return () => clearInterval(timer);
  }, []);
  const { totalItems } = useCart();

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-white">

        {/* ── NAVBAR PÍLDORA FLOTANTE ── */}
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-5xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-lg shadow-black/8 px-6 h-16 flex items-center justify-between border border-white/60">
            <Link href="/" className="flex items-center gap-2.5">
              <LollipopLogo />
              <span className="font-script text-3xl leading-none text-primary pt-1">Dolce Candy</span>
            </Link>

            <div className="hidden md:flex items-center gap-7 font-bold text-sm tracking-wide">
              <Link href="/catalogo" className="text-gray-600 hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link href="#ubicaciones" className="text-gray-600 hover:text-primary transition-colors">
                Ubicaciones
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/catalogo"
                className="bg-primary text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/30 hidden md:flex items-center gap-2"
              >
                Ir al Catálogo <ArrowRight className="w-4 h-4 stroke-[3]" />
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

        {/* ── HERO SECTION - ESTILO PAWSY EXACTO + CANDY CRUSH ── */}
        <section className="relative h-[100dvh] overflow-hidden flex flex-col"
                 style={{ background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #FFD1DC 40%, #B9C2F5 100%)' }}>
          {/* Layer 1: Nubes Blancas Flotantes Absolutas (z-0) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Nube flotante decorativa - izquierda */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[18%] left-[4%] opacity-60"
            >
              <svg width="130" height="72" viewBox="0 0 130 72" fill="none">
                <path d="M10,62 C10,62 0,60 0,52 C0,44 8,40 16,42 C16,30 26,22 38,24 C40,14 50,8 62,10 C70,4 82,4 90,12 C100,8 112,14 114,24 C122,24 130,32 128,40 C126,48 118,52 110,50 C110,58 100,64 90,62 Z" fill="white" />
              </svg>
            </motion.div>

            {/* Nube flotante decorativa - derecha */}
            <motion.div
              animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-[12%] right-[6%] opacity-50"
            >
              <svg width="170" height="95" viewBox="0 0 170 95" fill="none">
                <path d="M14,82 C14,82 0,80 0,68 C0,56 10,50 22,53 C20,36 34,24 50,26 C52,14 66,6 82,8 C92,2 108,2 118,12 C130,6 146,14 148,28 C158,28 170,38 168,52 C166,64 156,70 144,68 C144,78 132,86 120,84 C116,92 104,96 94,88 C84,94 70,92 64,82 Z" fill="white" />
              </svg>
            </motion.div>
          </div>

          {/* ── FLOATING CANDIES (Candy Crush Inspiration) (z-10) ── */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {/* Caramelo elevado para que NO tape el texto de la izquierda */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 45, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[8%] md:left-[5%] text-6xl drop-shadow-md"
            >
              🍬
            </motion.div>

            {/* Paleta de colores gigante asomándose en la esquina derecha inferior */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [15, 25, 15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[18%] md:bottom-[22%] right-[2%] md:right-[5%] text-[90px] md:text-[110px] drop-shadow-2xl z-20"
            >
              🍭
            </motion.div>
          </div>

          {/* ── CONTENIDO TEXTO (IZQUIERDA) ── */}
          <div className="flex-1 flex items-center relative z-20 px-8 md:px-[10%] lg:px-[12%]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full max-w-[480px] mt-[-5%]"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] mb-4 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
              >
                ¡Vuelve a ser{" "}
                <span className="font-script text-primary inline-block -rotate-2 drop-shadow-sm bg-white px-2 py-1 rounded-2xl border-2 border-primary/20">
                  un niño
                </span>
                {" "}hoy!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-[18px] text-gray-800 mb-8 leading-relaxed font-semibold max-w-[380px]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
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
                  className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-[16px] inline-flex items-center gap-2 hover:bg-[#c9181e] active:scale-95 transition-all shadow-lg shadow-primary/40 group"
                >
                  Ver todos los dulces <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ── IMAGEN CENTRAL / PERSONAJE - STOP MOTION EFFECT (z-20) ── */}
          <div className="absolute bottom-0 right-0 md:right-[5%] z-20 pointer-events-none w-full lg:w-[50%] h-full flex justify-center items-end">
            {/* NO AnimatePresence para lograr el efecto seco y rápido del flipbook */}
            <img
              key={HERO_IMAGES[currentImageIndex]}
              src={getImagePath(HERO_IMAGES[currentImageIndex]) || undefined}
              className="w-full max-w-[600px] object-contain object-bottom block h-[65dvh] lg:h-[85dvh] drop-shadow-2xl transition-none"
              alt="Dolce Candy Showcase Flipbook"
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

          {/* Chocolate superpuesto (Sobreponiendo la nube) z-40 */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-10, 5, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[2%] md:bottom-[5%] left-[35%] md:left-[40%] text-[90px] md:text-[110px] drop-shadow-2xl z-40 pointer-events-none"
          >
            🍫
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
                  address: "Av. Principal de Campo Claro &, Avenida D, Caracas 1071, Distrito Capital, Venezuela",
                  schedule: ["Lun-Vier: 8AM - 6PM", "Sab: 10AM - 4PM", "Dom: Cerrado"],
                  color: "bg-blue-50"
                },
                {
                  city: "Caracas - El Bosque",
                  address: "Av Principal del Bosque",
                  schedule: ["Lun-Vier: 9AM - 7PM", "Sáb: 10AM - 6PM", "Domingos: 12PM - 6PM"],
                  color: "bg-purple-50"
                }
              ].map((loc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${loc.color} p-10 rounded-[3rem] text-left border border-black/5 hover:border-primary/20 transition-all group`}
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

        <footer className="bg-gray-900 text-white py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 mb-32 items-center">
              <div>
                <div className="flex items-center gap-5 mb-10">
                  <LollipopLogo className="w-20 h-20" />
                  <span className="font-script text-6xl text-white pt-2">Dolce Candy</span>
                </div>
                <p className="text-gray-400 text-2xl leading-relaxed font-medium">
                  Hacemos magia dulce. Directo de USA a tus manos en Venezuela. ⚡️
                </p>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h4 className="font-black text-2xl mb-8 uppercase tracking-widest text-primary">Tienda</h4>
                  <ul className="space-y-6 text-xl text-gray-400 font-bold">
                    <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
                    <li><a href="#lab" className="hover:text-white transition-colors">Candy Lab</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-12 border-t border-white/5 text-center text-gray-600 font-black text-lg">
              <p>© 2026 Dolce Candy Boutique. El paraíso de las golosinas.</p>
            </div>
          </div>
        </footer>

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
    </SmoothScroll>
  );
}
