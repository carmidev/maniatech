import React from "react";

export interface BrandInfo {
  name: string;
  svg: React.ReactNode;
}

export const BRAND_LIST: BrandInfo[] = [
  {
    name: "Logitech G",
    svg: (
      <div className="flex items-center gap-2 font-display font-black text-lg tracking-wider text-white">
        <span className="text-gray-300">logitech</span>
        <span className="bg-[#00E5FF] text-black px-1.5 py-0.5 rounded font-black text-xs">G</span>
      </div>
    )
  },
  {
    name: "Razer",
    svg: (
      <div className="font-display font-black text-xl tracking-[0.25em] text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.4)]">
        RAZER
      </div>
    )
  },
  {
    name: "Corsair",
    svg: (
      <div className="flex items-center gap-2 font-display font-extrabold text-lg tracking-widest text-white">
        <span className="text-[#00E5FF]">▲▲</span>
        <span>CORSAIR</span>
      </div>
    )
  },
  {
    name: "Asus ROG",
    svg: (
      <div className="flex items-center gap-2 font-display font-black text-lg tracking-wider text-white">
        <span className="text-[#FF0033] font-black">ROG</span>
        <span className="text-gray-300 text-xs">REPUBLIC OF GAMERS</span>
      </div>
    )
  },
  {
    name: "Redragon",
    svg: (
      <div className="font-display font-black text-xl tracking-wider text-[#FF0033] drop-shadow-[0_0_10px_rgba(255,0,51,0.4)]">
        REDRAGON
      </div>
    )
  },
  {
    name: "HyperX",
    svg: (
      <div className="font-display font-black text-xl tracking-widest text-[#FF0033] italic">
        HYPERX
      </div>
    )
  },
  {
    name: "Elgato",
    svg: (
      <div className="flex items-center gap-2 font-display font-bold text-lg tracking-wider text-white">
        <span className="w-4 h-4 rounded-full border-2 border-[#00E5FF]" />
        <span>elgato</span>
      </div>
    )
  },
  {
    name: "Sony PS5",
    svg: (
      <div className="flex items-center gap-2 font-display font-black text-lg tracking-wider text-white">
        <span>SONY</span>
        <span className="text-[#00E5FF] text-xs font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10">PS5</span>
      </div>
    )
  },
  {
    name: "Fantech",
    svg: (
      <div className="font-display font-black text-xl tracking-wider text-[#8A2BE2] drop-shadow-[0_0_10px_rgba(138,43,226,0.5)]">
        FANTECH
      </div>
    )
  },
  {
    name: "Maono",
    svg: (
      <div className="font-display font-extrabold text-lg tracking-widest text-white uppercase">
        MAONO
      </div>
    )
  },
  {
    name: "Hollyland",
    svg: (
      <div className="font-display font-bold text-lg tracking-wider text-[#00FF00]">
        HOLLYLAND
      </div>
    )
  },
  {
    name: "Kingston FURY",
    svg: (
      <div className="flex items-center gap-1.5 font-display font-black text-lg tracking-wider text-white">
        <span>KINGSTON</span>
        <span className="text-[#FF0033]">FURY</span>
      </div>
    )
  }
];
