"use client";

import { Instagram, Mail, Play, Zap, MapPin } from "lucide-react";

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

          {/* Columna 2: Slogan y Redes */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h3 className="text-white text-lg lg:text-xl leading-tight font-display font-bold tracking-tight lg:whitespace-nowrap">
              Hacemos magia dulce⚡️
            </h3>
            <p className="text-white/40 text-sm lg:text-base font-body font-normal mb-4">
              Directo de USA a tus manos en Venezuela.
            </p>
            <div className="flex justify-center lg:justify-start">
              <motion.a
                href="https://www.instagram.com/dolce.candy.boutique/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex py-1.5 px-4 bg-white/5 rounded-full items-center gap-2 border border-white/10 text-xs font-bold"
              >
                <Instagram className="w-3 h-3 text-primary" />
                <span>Instagram</span>
              </motion.a>
            </div>
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
                  Candy Lab
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
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 text-gray-500 font-bold text-xs uppercase tracking-widest">
          <p>© 2026 Dolce Candy Boutique.</p>
          <p className="text-gray-600">
            Desarrollado y Diseñado por <span className="text-gray-400">CarMiDev</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
