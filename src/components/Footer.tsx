"use client";

import { Instagram, MessageCircle, Play } from "lucide-react";
import { LollipopLogo } from "./LollipopLogo";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-24 px-6 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 mb-20 items-start">
          <div>
            <div className="flex items-center gap-5 mb-8">
              <LollipopLogo className="w-16 h-16" />
              <span className="font-script text-5xl text-white pt-2">Dolce Candy</span>
            </div>
            <p className="text-gray-400 text-xl leading-relaxed font-medium max-w-md mb-8">
              Hacemos magia dulce. Directo de USA a tus manos en Venezuela. ⚡️
            </p>
            
            {/* Redes Sociales */}
            <div className="flex items-center gap-6">
              {[
                { 
                  icon: <Instagram className="w-6 h-6" />, 
                  href: "https://www.instagram.com/dolce.candy.boutique/", 
                  label: "Instagram",
                  color: "hover:text-pink-500"
                },
                { 
                  icon: <Play className="w-6 h-6 rotate-90" />, // Simulating TikTok with a rotated play/triangle if needed, but better use a generic one
                  href: "https://www.tiktok.com/@dolce.candy.boutique", 
                  label: "TikTok",
                  color: "hover:text-cyan-400"
                },
                { 
                  icon: <MessageCircle className="w-6 h-6" />, 
                  href: "https://wa.me/584121234567", 
                  label: "WhatsApp",
                  color: "hover:text-green-500"
                }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center transition-all ${social.color} border border-white/5`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="font-black text-xl mb-6 uppercase tracking-widest text-primary">Tienda</h4>
              <ul className="space-y-4 text-lg text-gray-400 font-bold">
                <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
                <li><Link href="/#lab" className="hover:text-white transition-colors">Candy Lab</Link></li>
                <li><Link href="/#ubicaciones" className="hover:text-white transition-colors">Ubicaciones</Link></li>
              </ul>
            </div>
            {/* Espacio adicional para info de contacto si se requiere */}
            <div>
              <h4 className="font-black text-xl mb-6 uppercase tracking-widest text-primary">Contacto</h4>
              <p className="text-gray-400 font-bold text-lg mb-2">Caracas, Venezuela</p>
              <p className="text-gray-400 text-sm overflow-hidden text-ellipsis">hola@dolcecandy.com</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 font-bold text-sm">
          <p>© 2026 Dolce Candy Boutique. El paraíso de las golosinas.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
