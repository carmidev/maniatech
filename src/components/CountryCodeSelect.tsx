"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Country {
  code: string;
  iso: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: "+58", iso: "ve", name: "Venezuela" },
  { code: "+1", iso: "us", name: "USA" },
  { code: "+1", iso: "ca", name: "Canadá" },
  { code: "+34", iso: "es", name: "España" },
  { code: "+57", iso: "co", name: "Colombia" },
  { code: "+507", iso: "pa", name: "Panamá" },
  { code: "+506", iso: "cr", name: "Costa Rica" },
  { code: "+502", iso: "gt", name: "Guatemala" },
  { code: "+56", iso: "cl", name: "Chile" },
  { code: "+54", iso: "ar", name: "Argentina" },
  { code: "+52", iso: "mx", name: "México" },
  { code: "+51", iso: "pe", name: "Perú" },
  { code: "+593", iso: "ec", name: "Ecuador" },
  { code: "+591", iso: "bo", name: "Bolivia" },
  { code: "+595", iso: "py", name: "Paraguay" },
  { code: "+598", iso: "uy", name: "Uruguay" },
  { code: "+55", iso: "br", name: "Brasil" },
  { code: "+39", iso: "it", name: "Italia" },
  { code: "+33", iso: "fr", name: "Francia" },
  { code: "+44", iso: "gb", name: "Reino Unido" },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CountryCodeSelect = ({ value, onChange, className = "" }: CountryCodeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedCountry = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl bg-gray-200 py-3 lg:py-4 px-4 font-inter-display font-medium outline-none ring-primary/30 transition-all focus:ring-2 h-full w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
            alt={selectedCountry.name}
            className="w-5 h-auto rounded-sm shadow-sm shrink-0"
          />
          <span className="text-sm lg:text-base whitespace-nowrap">{selectedCountry.code}</span>
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            onWheel={(e) => e.stopPropagation()}
            className="absolute left-0 top-[110%] z-[200] w-36 max-h-80 overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-50 bg-gray-50/50">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-white border border-gray-200 py-1.5 px-3 text-[11px] font-inter-display outline-none focus:border-primary/30 transition-all"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto custom-scrollbar p-1 max-h-56">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, idx) => (
                  <button
                    key={`${country.iso}-${idx}`}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-gray-100 ${
                      value === country.code ? "bg-primary/5 text-primary" : "text-gray-700"
                    }`}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${country.iso}.png`}
                      alt={country.name}
                      className="w-5 h-auto rounded-sm shadow-sm"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-tight truncate">{country.name}</span>
                      <span className="text-xs font-inter-display opacity-60">{country.code}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  No se encontró el país
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
