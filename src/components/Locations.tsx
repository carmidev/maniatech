"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { getImagePath } from "@/utils/imagePath";

export const Locations = () => {
  return (
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

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {[
            { 
              city: "Sede Campo Claro", 
              address: "Avenida Principal de Campo Claro, Edificio San Antonio", 
              reference: "Bajando por la calle de la taberna el greco, en la siguiente esquina, frente a la Pescadería Puerto Santo. Local de toldos de rayas rojas.",
              detail: "Ref: F5R9+QF",
              mapsUrl: "https://www.google.com/maps/place/Dolce+Candy+boutique/@10.4918386,-66.8312842,17z/data=!4m6!3m5!1s0x8c2a592bab8cb72b:0x193d00d576f1fa49!8m2!3d10.49191!4d-66.8312609!16s%2Fg%2F11sg06nlzq?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
              schedule: "Lun - Dom: 10:00 AM - 8:00 PM",
              color: "text-primary",
              bgColor: "bg-primary",
              image: "/images/locations/dc-campoclaro.jpeg",
              clip: "polygon(0% 10%, 10% 0%, 90% 5%, 100% 15%, 95% 90%, 85% 100%, 10% 95%, 0% 85%)",
            },
            { 
              city: "Sede El Bosque", 
              address: "Av. Principal del Bosque, Edificio El Bosque", 
              reference: "Local de la Esquina con Santa Marias Rojas, Frente al módulo de policía, bajando hacia Chacaito.",
              detail: "Ref: F4VJ+PVF",
              mapsUrl: "https://www.google.com/maps/place/Dolce+Candy+Boutique/@10.4943073,-66.8678368,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a59005758af9d:0x726cc440dca98fcf!8m2!3d10.4943073!4d-66.8678368!16s%2Fg%2F11xn3czjry?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D",
              schedule: "Lun - Dom: 11:00 AM - 9:00 PM",
              color: "text-blue-500",
              bgColor: "bg-blue-500",
              image: "/images/locations/dc-elbosque.jpeg",
              clip: "polygon(5% 0%, 95% 10%, 100% 85%, 90% 100%, 10% 90%, 0% 75%, 0% 15%)",
            }
          ].map((loc, idx) => (
            <div key={idx} className="group flex flex-col gap-6 text-left">
              {/* Contenedor Imagen con Forma Disruptiva */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ clipPath: loc.clip }}
              >
                <div className="relative h-[350px]">
                  <img 
                    src={getImagePath(loc.image)} 
                    alt={loc.city} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradiente suave */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Icono flotante */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-lg border border-gray-100 group-hover:rotate-12 transition-transform">
                    🍭
                  </div>
                </div>
              </motion.div>

              {/* Contenido fuera de la imagen */}
              <div className="px-4">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{loc.city}</h3>
                  <div className={`h-2 w-2 rounded-full ${loc.bgColor} animate-pulse`} />
                </div>
                
                <p className="text-slate-600 font-bold text-lg leading-snug mb-1 max-w-sm">
                  {loc.address}
                </p>

                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4 max-w-sm">
                  <span className="font-black text-[10px] uppercase tracking-tighter mr-1 opacity-50">Punto de Ref:</span>
                  {loc.reference}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${loc.color}`}>
                      Horario: {loc.schedule}
                    </span>
                  </div>
                  
                  <a 
                    href={loc.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all group/btn active:scale-95"
                  >
                    <MapPin className={`w-4 h-4 ${loc.color}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Ver en Mapa
                    </span>
                  </a>
                </div>
              </div>

              {/* Línea decorativa disruptiva */}
              <div className={`h-1 w-24 ${loc.bgColor} rounded-full opacity-30 transform -rotate-1 group-hover:w-32 transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
