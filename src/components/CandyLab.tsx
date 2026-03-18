"use client";

import { motion } from "framer-motion";
import { Play, Instagram, Star, Sparkles } from "lucide-react";
import { getImagePath } from "@/utils/imagePath";

const LAB_VIDEOS = [
  { id: 1, title: "Probando Reese x Oreo 🍪", type: "Viral", likes: "1.2k", image: "/images/lab/live1.png" },
  { id: 2, title: "¡Esa textura es otro nivel! 🤤", type: "Review", likes: "850", image: "/images/lab/live2.png" },
  { id: 3, title: "Combo Mega Dulce Reveal 🎁", type: "Unboxing", likes: "2.1k", image: "/images/lab/live3.png" },
];

export const CandyLab = () => {
  return (
    <div className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/30 text-primary-foreground px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">El Laboratorio de Dolce</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              ¿Quieres ver <span className="text-primary italic font-script">cómo saben</span>?
            </h2>
            <p className="text-gray-500 text-lg">
              Nuestra fundadora prueba cada dulce raro en Instagram. Mira sus reacciones reales antes de decidirte por tu próximo antojo.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4 bg-secondary/5 p-8 rounded-5xl border-2 border-dashed border-secondary/30">
             <Instagram className="w-12 h-12 text-primary mb-2" />
             <p className="font-bold text-gray-800">Síguenos para los lives</p>
             <a 
               href="https://www.instagram.com/dolce.candy.boutique/" 
               target="_blank" 
               className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
             >
               @dolce.candy.boutique
             </a>
          </div>
        </div>

        {/* Reels-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LAB_VIDEOS.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative aspect-[9/16] rounded-5xl overflow-hidden shadow-2xl bg-gray-100 cursor-pointer"
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
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <Star className="w-3 h-3 fill-white" /> {video.likes}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-accent transition-colors">
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
        <div className="mt-20 text-center">
           <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Más de 50 dulces probados en vivo</p>
           <div className="flex justify-center gap-4">
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
