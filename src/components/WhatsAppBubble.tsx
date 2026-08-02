"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WhatsAppBubble = () => {
  return (
    <motion.a
      href="https://wa.me/584241807106"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20ba5a] transition-colors group"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </motion.div>
      
      {/* Tooltip opcional */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100">
        ¿Necesitas ayuda? ¡Escríbenos a WhatsApp! 🎮
      </span>
    </motion.a>
  );
};
