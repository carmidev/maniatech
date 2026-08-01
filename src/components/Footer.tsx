"use client";

import { Instagram, Mail, Play, Zap, MapPin, Phone } from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";
import { getImagePath } from "@/utils/imagePath";

export const Footer = () => {
  return (
    <footer className="bg-[#09090A] text-white py-16 px-6 relative z-10 w-full overflow-hidden border-t border-white/5 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start text-center lg:text-left mb-16">
          {/* Columna 1: Brand Info */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src={getImagePath("/images/logo maniatech.png")}
                alt="Mania Tech Logo"
                className="h-20 sm:h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_20px_rgba(138,43,226,0.6)]"
              />
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              El ecosistema de hardware y periféricos más completo de Venezuela. Eleva tu setup con marcas premium y garantía local.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 text-xs font-semibold text-[#8A2BE2]">
              <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
              Tienda Física en Chacao & Envíos a todo el país
            </div>
          </div>

          {/* Columna 2: Categorías */}
          <div className="lg:pl-8">
            <h4 className="font-display text-xs mb-6 uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Catálogo</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/catalogo?cat=audifonos" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Audífonos & Audio
                </Link>
              </li>
              <li>
                <Link href="/catalogo?cat=mouses" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Mouses & Mousepads
                </Link>
              </li>
              <li>
                <Link href="/catalogo?cat=teclados" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Teclados Mecánicos
                </Link>
              </li>
              <li>
                <Link href="/catalogo?cat=streaming" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cámaras & Streaming
                </Link>
              </li>
              <li>
                <Link href="/catalogo?cat=microfonos" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Micrófonos & Mixers
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Confianza */}
          <div>
            <h4 className="font-display text-xs mb-6 uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Mania Gaming</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/#marcas" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start">
                  Marcas Oficiales Aliadas
                </Link>
              </li>
              <li>
                <Link href="/#promo" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start">
                  Promoción Ventas al Mayor
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors flex items-center gap-2 justify-center lg:justify-start">
                  Reviews de la Comunidad
                </Link>
              </li>
              <li>
                <span className="text-[#00FF00] font-semibold text-xs flex items-center gap-1.5 justify-center lg:justify-start">
                  <Zap className="w-3.5 h-3.5" /> 6 Meses de Garantía Directa
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto & Redes */}
          <div>
            <h4 className="font-display text-xs mb-6 uppercase tracking-[0.2em] text-[#8A2BE2] font-bold">Contacto RRSS</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <Instagram className="w-4 h-4 text-[#8A2BE2] shrink-0" />
                <a href="https://instagram.com/maniajuegos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium text-white">
                  @MANIAJUEGOS
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <Phone className="w-4 h-4 text-[#8A2BE2] shrink-0" />
                <a href="https://wa.me/584120000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Atención WhatsApp Directa
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <MapPin className="w-4 h-4 text-[#8A2BE2] shrink-0" />
                <span className="text-xs">Chacao, Caracas - Venezuela</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 text-gray-500 font-bold text-[10px] lg:text-xs uppercase tracking-widest">
          <p>© 2026 Mania Tech (@MANIAJUEGOS). Todos los derechos reservados.</p>
          <div className="flex flex-col items-center gap-1.5 lg:flex-row lg:gap-2 text-gray-600">
            <span>Desarrollado y Diseñado por</span>
            <a 
              href="https://carmidev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[19px] group/logo cursor-pointer shrink-0 block"
            >
              <style>{`
                @keyframes neonGlowPulse {
                  0%, 100% {
                    filter: brightness(0) saturate(100%) invert(67%) sepia(93%) saturate(3020%) hue-rotate(150deg) brightness(105%) contrast(106%) drop-shadow(0 0 2px rgba(0, 229, 255, 0.5));
                  }
                  50% {
                    filter: brightness(0) saturate(100%) invert(67%) sepia(93%) saturate(3020%) hue-rotate(150deg) brightness(105%) contrast(106%) drop-shadow(0 0 8px rgba(0, 229, 255, 0.95));
                  }
                }
                .carmidev-logo-hover {
                  animation: neonGlowPulse 2s infinite ease-in-out;
                }
              `}</style>
              <img
                src={getImagePath("/images/logo-carmidev.png")}
                alt="CarMiDev Logo"
                className="h-[19px] w-auto object-contain opacity-100 transition-opacity duration-300 group-hover/logo:opacity-0"
              />
              <img
                src={getImagePath("/images/logo-carmidev.png")}
                alt="CarMiDev Hover"
                className="carmidev-logo-hover absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
