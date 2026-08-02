"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export const WhatsAppWidget = () => {
  const pathname = usePathname();
  const phoneNumber = "584241807106";
  const message = "¡Hola Mania Tech! 🎮 Estoy interesado/a en consultar sobre el catálogo de hardware y periféricos. ¿Me podrían asesorar? ⚡";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (pathname === '/checkout') return null;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, x: 20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[50] w-12 h-12 lg:w-14 lg:h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white group"
    >
      <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 fill-current" />
      
      {/* Tooltip hint */}
      <div className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100">
        ¡Hablemos por WhatsApp! 🎮
      </div>

      {/* Glow pulse */}
      <div className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping -z-10" />
    </motion.a>
  );
};
