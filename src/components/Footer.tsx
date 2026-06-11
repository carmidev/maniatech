"use client";

import { Instagram, Mail, Play, Zap, MapPin, Phone } from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";
import { getImagePath } from "@/utils/imagePath";

export const Footer = () => {
  return (
    <footer className="bg-[#141213] text-white py-16 px-6 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start text-center lg:text-left mb-16">
          {/* Columna 1: Logo */}
          <div className="flex justify-center lg:justify-start">
            <img
              src={getImagePath("/images/Logo completo letras blancas Dolce Candy.png")}
              alt="Dolce Candy Logo"
              className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-contain shrink-0 drop-shadow-2xl"
            />
          </div>



          {/* Columna 3: Tienda */}
          <div className="lg:pl-8">
            <h4 className="font-display text-xs mb-6 uppercase tracking-[0.2em] text-primary font-bold">Tienda</h4>
            <ul className="space-y-4 text-base text-white/60 font-body">
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors flex items-center gap-3 justify-center lg:justify-start group">
                  <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/#lab" className="hover:text-white transition-colors flex items-center gap-3 justify-center lg:justify-start group">
                  <Play className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  Candy Reviews
                </Link>
              </li>
              <li>
                <Link href="/#ubicaciones" className="hover:text-white transition-colors flex items-center gap-3 justify-center lg:justify-start group">
                  <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  Ubicaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-display text-xs mb-6 uppercase tracking-[0.2em] text-primary font-bold">Contacto</h4>
            <ul className="space-y-4 text-white/60 font-body text-base">
              <li className="flex items-center gap-4 justify-center lg:justify-start">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:dolcecandyboutique@gmail.com" className="hover:text-white transition-colors text-xs lg:text-sm truncate max-w-[180px] lg:max-w-none">
                  dolcecandyboutique@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4 justify-center lg:justify-start">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="https://wa.me/584122861719" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs lg:text-sm">
                  +58 412 2861719
                </a>
              </li>
              <li className="flex items-center gap-4 justify-center lg:justify-start">
                <Instagram className="w-4 h-4 text-primary shrink-0" />
                <a href="https://www.instagram.com/dolce.candy.boutique/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs lg:text-sm">
                  @dolce.candy.boutique
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
          <p>© 2026 Dolce Candy Boutique.</p>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Desarrollado y Diseñado por</span>
            <a 
              href="https://wa.me/message/R76OMSCAFXNTG1"
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
              {/* Logo blanco base */}
              <img
                src={getImagePath("/images/logo-carmidev.png")}
                alt="CarMiDev Logo"
                className="h-[19px] w-auto object-contain opacity-100 transition-opacity duration-300 group-hover/logo:opacity-0"
              />
              {/* Logo cyan eléctrico superpuesto */}
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
