"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Escuchar el evento de inicio de sesión de Supabase
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        // Redirigir a la URL donde estaba el usuario (o al home por defecto)
        const returnUrl = localStorage.getItem('auth_return_url') || '/';
        router.push(returnUrl);
      }
    });

    // Timeout de respaldo por si Supabase tarda mucho o ya estaba logueado
    const timer = setTimeout(() => {
      const returnUrl = localStorage.getItem('auth_return_url') || '/';
      router.push(returnUrl);
    }, 4000);

    return () => {
      listener?.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 rounded-[2rem] bg-brand-cream/50 flex items-center justify-center mb-8 shadow-xl shadow-brand-cream/20"
      >
        <span className="text-5xl">🍭</span>
      </motion.div>

      <h1 className="font-display text-2xl uppercase tracking-wider text-primary mb-3 text-center">
        Dulzura en Camino...
      </h1>
      
      <p className="font-body text-slate-500 text-sm text-center max-w-[280px] leading-relaxed">
        Estamos verificando tu acceso. Te llevaremos de vuelta en un instante.
      </p>

      {/* Animación de 3 puntitos con los colores de la marca */}
      <div className="mt-10 flex gap-3">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-3.5 h-3.5 rounded-full bg-primary"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-3.5 h-3.5 rounded-full bg-secondary"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-3.5 h-3.5 rounded-full bg-brand-blue"
        />
      </div>
    </div>
  );
}
