"use client";

import { motion } from "framer-motion";
import { Play, Instagram, Star, Sparkles } from "lucide-react";
import { getImagePath } from "@/utils/imagePath";

const LAB_VIDEOS = [
  { id: 1, title: "¡SNICKERS XTREME! ❤️", type: "Reel", image: "/images/lab/snickers dolcecandy.png", permalink: "https://www.instagram.com/p/DYe_e4XRnR6/" },
  { id: 2, title: "¡PIÑAS 4D de AMOS!❤️🍍", type: "Reel", image: "/images/lab/Amos dolcecandy.png", permalink: "https://www.instagram.com/p/DYW5H7_yNi7/" },
  { id: 3, title: "¡EL PEPINO PICANTE DE CHEETOS! ❤️", type: "Reel", image: "/images/lab/Cheetos Dolcecandy.png", permalink: "https://www.instagram.com/p/DYwu3cSues5/" },
];

export const CandyLab = () => {
  return (
    <div className="pt-0 pb-20 bg-transparent overflow-visible relative">
      {/* Decoración: Chupeta 2 (Oculta en móvil para mudarse a la tarjeta de abajo) */}
      <div className="hidden xl:block absolute lg:top-[0%] lg:right-[2%] pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <img
            src={getImagePath("/images/chupeta3.png")}
            alt="Decoración Chupeta"
            className="w-48 lg:w-72 h-auto drop-shadow-2xl opacity-100"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 mb-16">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/30 text-primary-foreground px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs lg:text-sm font-bold uppercase tracking-wider text-primary">Reviews de Dolce</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-brand-darkgray mb-6 leading-[1.1]">
              ¿Quieres ver <br />
              <span className="text-primary italic font-script">cómo saben</span>?
            </h2>
            <p className="text-brand-darkgray/80 text-base lg:text-lg font-body font-normal">
              ¡Ve más reviews de golosinas en nuestro instagram!
            </p>
          </div>

          <div className="relative w-full sm:w-auto flex flex-col items-center gap-4 bg-secondary/5 p-6 lg:p-8 rounded-[2rem] lg:rounded-5xl border-2 border-dashed border-secondary/30">
            {/* Chupeta Móvil (Mudada aquí - Solo visible en móvil) */}
            <div className="absolute -top-7 -right-16 lg:hidden pointer-events-none z-20">
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src={getImagePath("/images/chupeta3.png")}
                  alt="Decoración Chupeta"
                  className="w-60 h-auto drop-shadow-xl"
                />
              </motion.div>
            </div>

            <Instagram className="w-12 h-12 text-primary mb-2" />
            <p className="font-body font-normal text-brand-darkgray">Síguenos para los lives</p>
            <a
              href="https://www.instagram.com/dolce.candy.boutique/"
              target="_blank"
              className="bg-brand-red text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-red/20 hover:scale-105 transition-transform"
            >
              @dolce.candy.boutique
            </a>
          </div>
        </div>

        {/* Reels-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {LAB_VIDEOS.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              onClick={() => window.open(video.permalink, '_blank')}
              className="group relative aspect-[9/16] rounded-5xl overflow-hidden shadow-2xl bg-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-primary/20 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

              {/* Fake Video Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 z-20"
                >
                  <Play className="w-8 h-8 text-white fill-white" />
                </motion.div>
              </div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {video.type}
                  </span>
                </div>
                <h3 className="text-xl font-display text-white leading-tight group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
              </div>

              {/* Thumbnail (using candy images for now as reels thumbnails) */}
              <div className="absolute inset-0 bg-secondary/20 overflow-hidden">
                <img
                  src={getImagePath(video.image) || undefined}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bottom */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-brand-darkgray/60 font-body font-normal uppercase tracking-widest text-[10px] lg:text-xs mb-4">Más de 50 golosinas probadas en vivo</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-4">
            <div className="flex -space-x-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-800">+500 Clientes felices</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
