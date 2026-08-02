"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const CustomSelect = ({ value, onChange, options, placeholder = "Selecciona...", className = "", error = false }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(o => o.value === value);

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
        className={`flex items-center justify-between w-full h-full rounded-xl bg-[#1C1C22] border py-3.5 px-4 font-body font-bold outline-none transition-all text-base ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500/20' : 'border-white/10 focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2]'}`}
      >
        <span className={`truncate mr-2 ${selectedOption ? "text-white font-bold" : "text-gray-500 font-normal"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[110%] z-[200] min-w-[100%] max-h-60 overflow-y-auto rounded-xl bg-[#1C1C22] shadow-2xl border border-white/10 flex flex-col py-2"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`text-left px-4 py-2.5 text-sm font-medium hover:bg-[#25252E] transition-colors whitespace-nowrap ${value === option.value ? 'bg-[#8A2BE2]/20 text-[#8A2BE2] font-bold' : 'text-gray-200'}`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
