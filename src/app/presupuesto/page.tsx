"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  Server,
  Gamepad2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import { budgetConfig as defaultBudgetConfig, BudgetConfig } from "./budget.config";
import { fetchProposalBySlug } from "./supabaseProposalFetcher";

type PlanKey = "core" | "momentum" | "alacarta";

export default function PresupuestoPage() {
  const [config, setConfig] = useState<BudgetConfig>(defaultBudgetConfig);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePlanKey, setActivePlanKey] = useState<PlanKey>("core");
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastScrollTime = useRef(0);

  const totalSlides = 5;

  useEffect(() => {
    fetchProposalBySlug("maniatech").then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides || index === currentSlide || isAnimating) return;
    setIsAnimating(true);
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const nextSlide = () => {
    if (currentSlide === 1) {
      goToSlide(2);
    } else if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      if (Math.abs(e.deltaY) < 35) return;

      if (currentSlide === 2) {
        const tableContainer = document.querySelector("#presupuesto-table-scroll");
        if (tableContainer) {
          const { scrollTop, scrollHeight, clientHeight } = tableContainer;
          if (e.deltaY < 0 && scrollTop <= 5) {
            lastScrollTime.current = now;
            goToSlide(1);
          } else if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) {
            lastScrollTime.current = now;
            goToSlide(3);
          }
        }
        return;
      }

      if (e.deltaY > 0) {
        lastScrollTime.current = now;
        nextSlide();
      } else if (e.deltaY < 0) {
        lastScrollTime.current = now;
        prevSlide();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlide, isAnimating]);

  const activePlanData = config.plans[activePlanKey];
  const tableData = config.tableData[activePlanKey];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0B0E] text-[#E2E8F0] font-mono relative antialiased select-none">
      {/* BACKGROUND NEON GLOW EFFECTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8A2BE2]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00FF00]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER FLOATING NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-[#141418]/90 backdrop-blur-md border border-[#8A2BE2]/30 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-[#8A2BE2]" />
          </div>
          <div>
            <h1 className="font-heading font-black text-sm uppercase text-white leading-none">
              {config.clientName}
            </h1>
            <span className="font-mono text-[10px] text-[#00FF00] font-bold uppercase tracking-wider block">
              {config.clientSubtitle}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-[#141418]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF00] animate-ping" />
          <span className="font-mono text-xs font-bold text-gray-300">PROPUESTA OFICIAL:</span>
          <span className="font-heading font-black text-sm text-[#8A2BE2]">CARMIDEV HQ</span>
          <a
            href="https://carmidev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-[10px] bg-[#8A2BE2]/20 hover:bg-[#8A2BE2] text-white px-2.5 py-1 rounded-full transition-all"
          >
            <span>carmidev.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="relative w-full h-full z-10 flex items-center justify-center p-6 pt-20 pb-16">
        <AnimatePresence mode="wait" custom={direction}>
          {/* SLIDE 0: HERO & VALUE PROPOSITION */}
          {currentSlide === 0 && (
            <motion.section
              key="slide-0"
              custom={direction}
              initial={{ opacity: 0, y: 40 * direction, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 * direction, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/40 text-xs font-mono font-bold">
                  <Award className="w-3.5 h-3.5 text-[#00FF00]" />
                  <span>{config.projectName}</span>
                </div>

                <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase leading-none tracking-tight">
                  {config.clientName}
                </h2>

                <p className="text-2xl sm:text-3xl text-[#00FF00] font-bold block leading-snug">
                  {config.heroTagline}
                </p>

                <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                  {config.heroDescription}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {config.valueBadges.map((badge, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#141418] border border-white/10 rounded-xl text-xs font-mono font-bold text-gray-200 shadow-sm">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-[#141418]/95 backdrop-blur-xl border border-[#8A2BE2]/40 text-white p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden group">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Resumen de Propuesta</span>
                    <div className="font-heading font-black text-2xl sm:text-3xl text-[#00FF00] leading-tight">
                      E-Commerce Dark Gaming
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">Modalidad:</span>
                      <span className="font-bold text-white">Planes Paquete & A la Carta</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">Propiedad Código:</span>
                      <span className="font-bold text-[#00FF00]">100% de ManiaTech C.A.</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">Despliegue:</span>
                      <span className="font-bold text-[#8A2BE2]">Vercel Serverless Production</span>
                    </div>
                  </div>

                  <button
                    onClick={() => goToSlide(1)}
                    className="w-full py-3.5 bg-[#8A2BE2] hover:bg-purple-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Ver Opciones de Contratación</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* SLIDE 1: PLANES Y PAQUETES */}
          {currentSlide === 1 && (
            <motion.section
              key="slide-1"
              custom={direction}
              initial={{ opacity: 0, y: 40 * direction, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 * direction, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-6xl w-full space-y-6"
            >
              <div className="text-center space-y-1 max-w-2xl mx-auto">
                <span className="text-xl sm:text-2xl text-[#00FF00] font-bold block">Elige el plan ideal para tu impulso comercial</span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-white">
                  Opciones de Contratación
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
                {/* Plan Core */}
                <div
                  onClick={() => setActivePlanKey("core")}
                  className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between h-full cursor-pointer relative bg-[#141418]/90 backdrop-blur-md ${
                    activePlanKey === "core"
                      ? "border-2 border-[#00FF00] shadow-[0_0_35px_rgba(0,255,0,0.3)]"
                      : "border border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="absolute -top-3.5 right-6 bg-[#00FF00] text-black font-mono text-xs font-black px-3.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-current" /> RECOMENDADO MVP
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-[#00FF00] font-bold">{config.plans.core.tag}</span>
                      <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">{config.plans.core.title}</h3>
                      <p className="text-xs font-mono text-gray-400">{config.plans.core.desc}</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <span className="text-xs font-mono text-gray-400 block">Inversión Fija MVP</span>
                      <div className="font-mono text-3xl font-black text-[#00FF00]">{config.plans.core.price}</div>
                    </div>
                    <ul className="space-y-2 font-mono text-xs text-gray-300 pt-1">
                      {config.plans.core.deliverables.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlanKey("core");
                        goToSlide(2);
                      }}
                      className="w-full py-3.5 bg-[#00FF00] hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Ver Detalles & Entregables</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Plan A La Carta */}
                <div
                  onClick={() => setActivePlanKey("alacarta")}
                  className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between h-full cursor-pointer relative bg-[#141418]/90 backdrop-blur-md ${
                    activePlanKey === "alacarta"
                      ? "border-2 border-[#8A2BE2] shadow-[0_0_30px_rgba(138,43,226,0.3)]"
                      : "border border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-[#8A2BE2] font-bold">{config.plans.alacarta.tag}</span>
                      <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">{config.plans.alacarta.title}</h3>
                      <p className="text-xs font-mono text-gray-400">{config.plans.alacarta.desc}</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <span className="text-xs font-mono text-gray-400 block">Modalidad</span>
                      <div className="font-mono text-2xl font-black text-[#8A2BE2]">Módulos Sueltos</div>
                    </div>
                    <ul className="space-y-2 font-mono text-xs text-gray-300 pt-1">
                      {config.plans.alacarta.deliverables.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlanKey("alacarta");
                        goToSlide(2);
                      }}
                      className="w-full py-3.5 bg-[#8A2BE2] hover:bg-purple-700 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Ver Módulos & Tarifas</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* SLIDE 2: DESGLOSE DE TABLA */}
          {currentSlide === 2 && (
            <motion.section
              key="slide-2"
              custom={direction}
              initial={{ opacity: 0, y: 40 * direction, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 * direction, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-5xl w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => goToSlide(1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xl font-mono text-xs font-bold transition-all group"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                      <span>Volver a los Planes</span>
                    </button>
                  </div>
                  <span className="block font-mono text-xs text-[#00FF00] font-bold uppercase tracking-widest">
                    {tableData.tag}
                  </span>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-white">
                    {tableData.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tableData.hitos.map((h, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded-xl font-mono text-xs ${h.color}`}>
                      {h.label}: <span className="font-bold">{h.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla */}
              <div className="bg-[#141418]/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div id="presupuesto-table-scroll" className="overflow-x-auto max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1">
                  <table className="w-full text-left font-mono text-xs relative border-collapse">
                    <thead className="bg-[#1C1C22] text-gray-300 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-20 shadow-md">
                      <tr>
                        <th className="p-4 bg-[#1C1C22] whitespace-nowrap">Módulo / Entregable</th>
                        <th className="p-4 text-center bg-[#1C1C22] whitespace-nowrap">Tiempo Est.</th>
                        <th className="p-4 text-right bg-[#1C1C22] whitespace-nowrap">Precio Estándar</th>
                        <th className="p-4 text-right bg-[#1C1C22] whitespace-nowrap">Precio en Paquete</th>
                        <th className="p-4 text-center bg-[#1C1C22] whitespace-nowrap">Estado / Hito</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {tableData.rows.map((r, i) => (
                        <tr key={i} className="hover:bg-[#8A2BE2]/10 transition-colors">
                          <td className="p-4 font-bold text-white">{r.name}</td>
                          <td className="p-4 text-center text-gray-400">{r.time}</td>
                          <td className="p-4 text-right text-gray-500 line-through">{r.standard}</td>
                          <td className="p-4 text-right font-bold text-[#00FF00]">{r.final}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 ${r.statusBg} rounded-full font-bold text-[10px]`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          )}

          {/* SLIDE 3: INFRAESTRUCTURA & COSTOS OPERATIVOS */}
          {currentSlide === 3 && (
            <motion.section
              key="slide-3"
              custom={direction}
              initial={{ opacity: 0, y: 40 * direction, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 * direction, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-5xl w-full space-y-6"
            >
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="font-mono text-xs text-[#00FF00] font-bold uppercase tracking-widest">
                  Eficiencia Operativa & Escalabilidad
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-white">
                  Costos Operativos
                </h2>
                <div className="pt-1 flex justify-center">
                  <span
                    className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 ${
                      activePlanKey === "core"
                        ? "bg-[#00FF00]/15 border border-[#00FF00]/40 text-[#00FF00]"
                        : "bg-[#8A2BE2]/15 border border-[#8A2BE2]/40 text-[#8A2BE2]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Plan Seleccionado:{" "}
                      {activePlanKey === "core"
                        ? "🟢 CarMi Core ($2,100 USD)"
                        : "📦 Módulos A la Carta"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto w-full">
                <div className="bg-[#141418]/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl space-y-5 border border-white/10 shadow-2xl">
                  <h3 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#8A2BE2]" />
                    <span>Infraestructura Serverless (Costos $0/mes)</span>
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center p-3.5 bg-[#1C1C22] rounded-xl border border-white/10 shadow-sm">
                      <div>
                        <strong className="block text-white text-sm">Hosting & Edge CDN</strong>
                        <span className="text-[10px] text-gray-400">Vercel Hobby Tier</span>
                      </div>
                      <span className="font-bold text-[#00FF00]">$0.00 USD / mes</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-[#1C1C22] rounded-xl border border-white/10 shadow-sm">
                      <div>
                        <strong className="block text-white text-sm">Base de Datos PostgreSQL & Auth</strong>
                        <span className="text-[10px] text-gray-400">Supabase Free Tier (500 MB / 50k users)</span>
                      </div>
                      <span className="font-bold text-[#00FF00]">$0.00 USD / mes</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-[#1C1C22] rounded-xl border border-white/10 shadow-sm">
                      <div>
                        <strong className="block text-white text-sm">Dominio Web Personalizado</strong>
                        <span className="text-[10px] text-gray-400">NIC.ve / Cloudflare (`maniatech.com`)</span>
                      </div>
                      <span className="font-bold text-gray-200">~$12.00 USD / año</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 rounded-xl font-mono text-[10px] text-gray-300 space-y-1">
                    <strong className="text-[#00FF00] block text-xs">📌 Nota de Transparencia & Escalabilidad (Pay-as-you-grow):</strong>
                    <span>
                      La arquitectura inicial opera a $0.00/mes. Si el volumen supera los 500 MB o 50.000 usuarios/mes, los planes Pro (Vercel $20/mes | Supabase $25/mes) se contratarán directamente a nombre del cliente según el crecimiento real del negocio.
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* SLIDE 4: DESPLIEGUE, ALIANZA & CONTACTO DIRECTO */}
          {currentSlide === 4 && (
            <motion.section
              key="slide-4"
              custom={direction}
              initial={{ opacity: 0, y: 40 * direction, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40 * direction, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-3xl w-full text-center space-y-4 sm:space-y-5"
            >
              <div className="w-14 h-14 rounded-full bg-[#8A2BE2] text-white mx-auto flex items-center justify-center shadow-xl border border-[#00FF00]/40">
                <Gamepad2 className="w-7 h-7 text-[#00FF00]" />
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <span className="text-2xl sm:text-3xl text-[#00FF00] font-bold block leading-none">¡Listos para lanzar a producción!</span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl uppercase text-white leading-tight">
                  Despliegue & Entrega Final
                </h2>
                <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Tu plataforma para ManiaTech C.A. está desarrollada, optimizada y lista para recibir clientes. Solo falta tu aprobación para hacer el lanzamiento oficial.
                </p>
              </div>

              {/* Insignia de Alianza Estratégica */}
              <div className="bg-[#141418] text-white p-4 sm:p-4.5 rounded-2xl border border-[#8A2BE2]/40 shadow-2xl max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#00FF00]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4 text-[#8A2BE2]" />
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono text-[#00FF00] font-bold uppercase tracking-widest block">
                      Alianza Estratégica
                    </span>
                    <h4 className="font-heading font-black text-base uppercase text-white leading-tight">
                      ManiaTech <span className="text-[#8A2BE2] font-normal">C.A.</span>
                    </h4>
                  </div>
                </div>

                <span className="text-[#00FF00] font-black text-xl font-heading hidden sm:block">×</span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400 sm:hidden">en alianza con</span>
                  <a
                    href="https://carmidev.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center group/logo cursor-pointer"
                    title="Visitar carmidev.com"
                  >
                    <img
                      src="/Group 4.png"
                      alt="CarMiDev Logo"
                      className="h-7 sm:h-8 w-auto object-contain transition-all duration-300 group-hover/logo:scale-105 [filter:drop-shadow(0_0_12px_#0066FF)]"
                    />
                  </a>
                </div>
              </div>

              {/* Micro-card: Esquema de Inversión */}
              <div className="bg-[#141418]/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 max-w-lg mx-auto shadow-lg text-left space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="font-heading font-black text-xs uppercase text-white">
                    Esquema de Inversión — {activePlanKey === "core" ? "CarMi Core" : "Módulos A la Carta"}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#00FF00]">
                    {activePlanKey === "core" ? "$2,100.00 USD" : "Tarifas A la Carta"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-[#8A2BE2]/15 border border-[#8A2BE2]/30 space-y-0.5">
                    <span className="text-[#8A2BE2] text-[9.5px] block font-bold">1. Pago Inicial (50%):</span>
                    <strong className="text-white font-black block text-xs">
                      {activePlanKey === "alacarta" ? "50% Anticipo" : "$1,050.00 USD"}
                    </strong>
                    <span className="text-[9px] text-gray-400 block">Anticipo de inicio de desarrollo</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#00FF00]/15 border border-[#00FF00]/30 space-y-0.5">
                    <span className="text-[#00FF00] text-[9.5px] block font-bold">2. Pago de Cierre (50%):</span>
                    <strong className="text-[#00FF00] font-black block text-xs">
                      {activePlanKey === "alacarta" ? "50% Final" : "$1,050.00 USD"}
                    </strong>
                    <span className="text-[9px] text-gray-300 block">Abono contra entrega en producción</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
                <a
                  href="/"
                  target="_blank"
                  className="w-full sm:w-auto px-7 py-3 bg-[#1C1C22] hover:bg-[#8A2BE2] text-white rounded-2xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Proyecto Principal</span>
                </a>

                <a
                  href={`https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(activePlanData.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3 bg-[#00FF00] hover:bg-emerald-400 text-black rounded-2xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{activePlanData.whatsappText}</span>
                </a>
              </div>

              <p className="font-mono text-[9.5px] text-gray-500 uppercase tracking-widest pt-1">
                Desarrollado con rigor de ingeniería de software por CarMiDev · 2026
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER NAVIGATION CONTROLS */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="font-mono text-xs font-bold text-gray-300 bg-[#141418]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg pointer-events-auto">
          <span className="text-[#00FF00]">{String(currentSlide + 1).padStart(2, "0")}</span> /{" "}
          <span>{String(totalSlides).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full bg-[#141418]/90 backdrop-blur-md border border-white/10 hover:bg-[#8A2BE2] hover:text-white transition-colors text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="p-3 rounded-full bg-[#141418]/90 backdrop-blur-md border border-white/10 hover:bg-[#8A2BE2] hover:text-white transition-colors text-gray-300 disabled:opacity-30 disabled:pointer-events-none shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
