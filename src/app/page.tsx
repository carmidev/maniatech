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
import { CANDIES } from "@/app/mock-data";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Cambia cada 4 segundos
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

        {/* ── HERO SECTION - ESTILO PAWSY ── */}
        <section className="relative h-[100dvh] bg-[#B9C2F5] overflow-hidden flex flex-col">

          {/* Nube flotante decorativa - izquierda */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[4%] opacity-90 pointer-events-none"
          >
            <svg width="130" height="72" viewBox="0 0 130 72" fill="none">
              <path d="M10,62 C10,62 0,60 0,52 C0,44 8,40 16,42 C16,30 26,22 38,24 C40,14 50,8 62,10 C70,4 82,4 90,12 C100,8 112,14 114,24 C122,24 130,32 128,40 C126,48 118,52 110,50 C110,58 100,64 90,62 Z" fill="white"/>
            </svg>
          </motion.div>

          {/* Nube flotante decorativa - derecha */}
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-[12%] right-[6%] opacity-85 pointer-events-none"
          >
            <svg width="170" height="95" viewBox="0 0 170 95" fill="none">
              <path d="M14,82 C14,82 0,80 0,68 C0,56 10,50 22,53 C20,36 34,24 50,26 C52,14 66,6 82,8 C92,2 108,2 118,12 C130,6 146,14 148,28 C158,28 170,38 168,52 C166,64 156,70 144,68 C144,78 132,86 120,84 C116,92 104,96 94,88 C84,94 70,92 64,82 Z" fill="white"/>
            </svg>
          </motion.div>

          {/* Nube flotante pequeña - derecha media */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute top-[42%] right-[3%] opacity-65 pointer-events-none"
          >
            <svg width="90" height="52" viewBox="0 0 90 52" fill="none">
              <path d="M8,44 C8,44 0,42 0,34 C0,26 6,22 14,24 C14,14 22,8 32,10 C36,4 46,2 54,8 C62,4 72,8 74,18 C80,18 88,24 86,32 C84,40 76,44 68,42 Z" fill="white"/>
            </svg>
          </motion.div>

          {/* Emoji decorativo */}
          <motion.div
            animate={{ rotate: [0, 8, -4, 0], y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[25%] text-5xl opacity-15 select-none pointer-events-none"
          >
            🍬
          </motion.div>

          {/* ── CONTENIDO TEXTO (IZQUIERDA) ── */}
          <div className="flex-1 flex items-center relative z-10 px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full max-w-[420px] pb-24"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 mb-6 shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">Directo de USA 🇺🇸</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="text-5xl md:text-6xl font-black text-gray-800 leading-[1.05] mb-5"
              >
                ¡Vuelve a ser{" "}
                <span className="font-script text-primary bg-white px-4 py-0.5 rounded-3xl inline-block -rotate-1 drop-shadow-sm">
                  un niño
                </span>
                {" "}hoy!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-700 mb-8 leading-relaxed font-medium max-w-sm"
              >
                Dulces raros, colaboraciones exclusivas y la cercanía de Dolce Candy en cada video.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <Link
                  href="/catalogo"
                  className="bg-primary text-white px-7 py-3.5 rounded-full font-black text-base shadow-xl shadow-primary/30 inline-flex items-center gap-2.5 hover:bg-primary/90 active:scale-95 transition-all"
                >
                  Ir al Catálogo <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ── NUBE TRASERA - lavanda estilo Pawsy, z-10 ── */}
          <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="w-full" style={{ display: 'block' }} preserveAspectRatio="none">
              <path
                d="
                  M 0,255
                  C 40,250 80,232 120,222
                  C 160,212 195,192 235,182
                  C 275,172 305,155 345,152
                  C 385,149 410,168 445,172
                  C 480,178 505,162 540,158
                  C 575,155 600,172 625,178
                  C 650,184 665,192 680,205
                  C 695,218 705,235 715,248
                  C 725,260 730,272 740,278
                  C 750,284 760,285 775,280
                  C 790,276 800,264 812,252
                  C 824,240 830,228 845,218
                  C 860,208 875,198 898,192
                  C 921,186 940,178 968,172
                  C 996,166 1015,152 1048,148
                  C 1081,144 1105,160 1135,165
                  C 1165,170 1185,158 1215,155
                  C 1245,152 1270,165 1298,172
                  C 1326,179 1350,198 1380,210
                  C 1408,222 1430,242 1440,248
                  L 1440,320 L 0,320 Z
                "
                fill="#b8bef0"
                opacity="0.75"
              />
            </svg>
          </div>

          {/* ── MUJER EMERGIENDO DE LAS NUBES - z-20 ── */}
          <div className="absolute bottom-0 left-1/2 -translate-x-[10%] z-20 pointer-events-none"
            style={{ width: 'clamp(320px, 40vw, 600px)' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={HERO_IMAGES[currentImageIndex]}
                src={HERO_IMAGES[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-auto object-contain object-bottom block"
                style={{ maxHeight: 'calc(100dvh - 56px)' }}
                alt="Dolce Candy Showcase"
              />
            </AnimatePresence>
          </div>

          {/* ── NUBE DELANTERA BLANCA - estilo Pawsy puro, z-30 ── */}
          <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="w-full" style={{ display: 'block' }} preserveAspectRatio="none">
              <path
                d="
                  M 0,248
                  C 22,240 50,218 82,202
                  C 114,186 145,165 178,152
                  C 211,139 238,120 270,112
                  C 302,104 328,122 355,128
                  C 382,134 405,116 432,110
                  C 459,104 480,122 504,130
                  C 528,138 540,152 550,166
                  C 560,180 564,195 570,210
                  C 576,225 580,240 588,254
                  C 596,268 606,280 622,288
                  C 638,296 655,300 672,300
                  C 689,300 703,295 716,286
                  C 729,277 735,264 743,251
                  C 751,238 756,224 765,210
                  C 774,196 783,184 800,174
                  C 817,164 838,152 865,144
                  C 892,136 915,124 944,116
                  C 973,108 996,88 1028,82
                  C 1060,76 1082,92 1108,100
                  C 1134,108 1154,92 1180,86
                  C 1206,80 1230,96 1255,106
                  C 1280,116 1302,134 1328,146
                  C 1354,158 1382,180 1410,196
                  C 1428,204 1440,212 1440,218
                  L 1440,320 L 0,320 Z
                "
                fill="white"
              />
            </svg>
          </div>

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
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-md shadow-gray-100 border border-gray-50 flex flex-col cursor-pointer"
                >
                  {/* Imagen */}
                  <div className="relative h-56 overflow-hidden bg-gray-50">
                    <img
                      src={candy.image}
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
            <CloudDivider color="fill-gray-900" />
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
                  city: "Caracas", 
                  address: "C.C. San Ignacio, Nivel Jardín. Chacao.", 
                  schedule: "Lun - Dom: 10:00 AM - 8:00 PM",
                  color: "bg-blue-50"
                },
                { 
                  city: "Valencia", 
                  address: "C.C. Sambil Valencia, Nivel Feria.", 
                  schedule: "Lun - Dom: 11:00 AM - 9:00 PM",
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
                  <p className="text-primary font-black text-sm uppercase tracking-tighter italic">{loc.schedule}</p>
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
      </main>
    </SmoothScroll>
  );
}
