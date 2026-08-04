export interface BudgetConfig {
  clientName: string;
  clientSubtitle: string;
  clientLogoUrl?: string;
  visiblePlans?: ("core" | "momentum" | "alacarta")[];
  projectName: string;
  heroTagline: string;
  heroDescription: string;
  agencyName: string;
  agencyLogoUrl: string;
  whatsappPhone: string;
  valueBadges: string[];
  themeClasses: {
    bgCream: string;
    textCoffee: string;
    textCherry: string;
    bgCherry: string;
    bgCoffee: string;
    borderCoffee: string;
    badgeMustard: string;
  };
  plans: {
    core: {
      tag: string;
      title: string;
      desc: string;
      time: string;
      price: string;
      deliverables: string[];
      whatsappText: string;
      whatsappMsg: string;
    };
    momentum: {
      tag: string;
      title: string;
      desc: string;
      time: string;
      price: string;
      deliverables: string[];
      whatsappText: string;
      whatsappMsg: string;
    };
    alacarta: {
      tag: string;
      title: string;
      desc: string;
      time: string;
      price: string;
      deliverables: string[];
      whatsappText: string;
      whatsappMsg: string;
    };
  };
  tableData: {
    core: {
      title: string;
      tag: string;
      total: string;
      strikethroughTotal: string;
      time: string;
      hitos: { label: string; amount: string; color: string }[];
      rows: { name: string; time: string; standard: string; final: string; status: string; statusBg: string }[];
    };
    momentum: {
      title: string;
      tag: string;
      total: string;
      strikethroughTotal: string;
      time: string;
      hitos: { label: string; amount: string; color: string }[];
      rows: { name: string; time: string; standard: string; final: string; status: string; statusBg: string }[];
    };
    alacarta: {
      title: string;
      tag: string;
      total: string;
      strikethroughTotal: string;
      time: string;
      hitos: { label: string; amount: string; color: string }[];
      rows: { name: string; time: string; standard: string; final: string; status: string; statusBg: string }[];
    };
  };
}

export const budgetConfig: BudgetConfig = {
  clientName: "ManiaTech C.A.",
  clientSubtitle: "E-Commerce Gaming & Hardware",
  clientLogoUrl: "/images/logo maniatech.png",
  visiblePlans: ["core", "alacarta"],
  projectName: "Propuesta Técnica & Estimación Comercial",
  heroTagline: "Dominando la arena tecnológica con arquitectura custom",
  heroDescription: "Plataforma web transaccional custom diseñada sobre Next.js 15, Tailwind CSS y la infraestructura Serverless de alto rendimiento de CarMiDev HQ.",
  agencyName: "CarMiDev",
  agencyLogoUrl: "/Group 4.png",
  whatsappPhone: "584242056858",
  valueBadges: [
    "⚡ Código Custom sin Plantillas",
    "🎯 UI/UX Dark Gaming de Alta Conversión",
    "🚀 Carga Sub-Segundo & SEO",
    "🔒 Base de Datos & Pagos Encriptados",
    "💬 Integración Directa a WhatsApp API",
    "🎮 Catálogo Dinámico con Búsqueda Instantánea",
  ],
  themeClasses: {
    bgCream: "bg-[#0B0B0E]",
    textCoffee: "text-[#E2E8F0]",
    textCherry: "text-[#8A2BE2]",
    bgCherry: "bg-[#8A2BE2]",
    bgCoffee: "bg-[#141418]",
    borderCoffee: "border-[#8A2BE2]/30",
    badgeMustard: "bg-[#00FF00]/20 text-[#00FF00]",
  },
  plans: {
    core: {
      tag: "⚡ FASE 1 · MVP IMPRESCINDIBLE",
      title: "CarMi Core",
      desc: "Arquitectura base completa, catálogo reactivo y checkout transaccional directo a WhatsApp.",
      time: "4 a 6 Semanas de Desarrollo",
      price: "$2,100.00 USD",
      deliverables: [
        "✓ Landing Page Corporativa de Alta Conversión.",
        "✓ Catálogo de Productos Reactivo con Modales.",
        "✓ Carrito de Compras Transaccional con Tasa BCV.",
        "✓ Checkout Integrado Directo a WhatsApp API.",
        "✓ Base de Datos Supabase + Panel Admin de Inventarios.",
        "✓ Seguridad RLS (Row Level Security) e Infraestructura.",
      ],
      whatsappText: "Aprobar Plan CarMi Core ($2,100)",
      whatsappMsg: "¡Hola! Quiero aprobar el Plan CarMi Core para ManiaTech C.A. ($2,100 USD).",
    },
    momentum: {
      tag: "🔵 FASE 1 + ATRACCIÓN DE CLIENTES",
      title: "CarMi Momentum",
      desc: "Todo el desarrollo de CarMi Core + estrategia continua de posicionamiento SEO.",
      time: "4 a 6 Semanas + SEO Continuo",
      price: "$2,100 USD + SEO",
      deliverables: [
        "✓ Todo lo incluido en el Plan CarMi Core MVP.",
        "✓ Auditoría Técnica SEO y Optimización para Motores de Búsqueda.",
        "✓ Posicionamiento continuo en Google para palabras clave de especialidad.",
        "✓ Optimización de tráfico orgánico para clientes nacionales e internacionales.",
        "✓ Reportes mensuales de métricas de crecimiento y atracción de clientes.",
      ],
      whatsappText: "Aprobar Plan CarMi Momentum ($2,100 + SEO)",
      whatsappMsg: "¡Hola! Quiero aprobar el Plan CarMi Momentum para ManiaTech C.A. ($2,100 USD + SEO).",
    },
    alacarta: {
      tag: "📦 CONTRATACIÓN INDEPENDIENTE",
      title: "Módulos A la Carta",
      desc: "Selección de componentes sueltos contratados de forma independiente.",
      time: "4 a 6 Semanas Acumuladas",
      price: "Tarifas por Componentes Independientes",
      deliverables: [
        "• Admin Inteligente (Auto-carga de E-Commerce e IA en fotos + Inventario y KPIs) → $4,000.00 USD (⭐ Producto Estrella).",
        "• Landing Page Corporativa ($1,200 USD).",
        "• E-Commerce & Checkout Venezolano ($1,400 USD).",
        "• Chatbot IA & Automatización 24/7 ($1,100 USD).",
        "• Estrategia & Auditoría SEO Mensual ($400 USD/mes).",
        "• 🤖 Soluciones & Agentes con IA → Bajo Cotización.",
        "• ⚡ Plataformas Custom Enterprise (Desarrolladas a tus necesidades y medidas) → Bajo Cotización.",
      ],
      whatsappText: "Cotizar Módulos A la Carta",
      whatsappMsg: "¡Hola! Me interesa cotizar Módulos A la Carta para ManiaTech C.A.",
    },
  },
  tableData: {
    core: {
      title: "Presupuesto Detallado (CarMi Core MVP)",
      tag: "Desglose de Entregables & Tiempos · Plan CarMi Core",
      total: "$2,100.00 USD",
      strikethroughTotal: "$4,150.00",
      time: "4 a 6 Semanas",
      hitos: [
        { label: "Hito 1 (50%)", amount: "$1,050.00 USD", color: "bg-[#8A2BE2] text-white" },
        { label: "Hito 2 (50%)", amount: "$1,050.00 USD", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "1. Arquitectura Base & Design System", time: "3 Días", standard: "$350.00", final: "$250.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "2. Landing Page & Hero Celosía Interactivo", time: "1.5 Semanas", standard: "$1,200.00", final: "$550.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "3. Catálogo, Modales & Carrito Reactivo", time: "1 Semana", standard: "$800.00", final: "$400.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "4. Checkout & WhatsApp API", time: "1.5 Semanas", standard: "$600.00", final: "$500.00", status: "En Proceso (Hito 2)", statusBg: "bg-amber-900/60 text-amber-300 border border-amber-500/40" },
        { name: "5. QA, Responsive & Ajustes UI", time: "2 Días", standard: "$350.00", final: "$200.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "6. Supabase DB, Panel Admin & RLS", time: "3 Días", standard: "$850.00", final: "$200.00", status: "En Proceso (Hito 2)", statusBg: "bg-amber-900/60 text-amber-300 border border-amber-500/40" },
      ],
    },
    momentum: {
      title: "Presupuesto Detallado (CarMi Momentum: MVP + SEO)",
      tag: "Desglose de Entregables & SEO Mensual · Plan Momentum",
      total: "$2,100 + $250-$350/mo",
      strikethroughTotal: "$4,550.00",
      time: "4-6 Sem. + SEO",
      hitos: [
        { label: "Desarrollo Inicial", amount: "$2,100.00 USD", color: "bg-[#8A2BE2] text-white" },
        { label: "Suscripción SEO", amount: "$250 – $350/mes", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "1. Arquitectura Base & Design System", time: "3 Días", standard: "$350.00", final: "$250.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "2. Landing Page & Hero Celosía Interactivo", time: "1.5 Semanas", standard: "$1,200.00", final: "$550.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "3. Catálogo, Modales & Carrito Reactivo", time: "1 Semana", standard: "$800.00", final: "$400.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "4. Checkout & WhatsApp API", time: "1.5 Semanas", standard: "$600.00", final: "$500.00", status: "En Proceso (Hito 2)", statusBg: "bg-amber-900/60 text-amber-300 border border-amber-500/40" },
        { name: "5. QA, Responsive & Ajustes UI", time: "2 Días", standard: "$350.00", final: "$200.00", status: "Listo (Hito 1)", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "6. Supabase DB, Panel Admin & RLS", time: "3 Días", standard: "$850.00", final: "$200.00", status: "En Proceso (Hito 2)", statusBg: "bg-amber-900/60 text-amber-300 border border-amber-500/40" },
        { name: "7. Estrategia & Posicionamiento SEO Continuo", time: "Continuo", standard: "$400.00/mo", final: "$250 – $350/mo", status: "SEO Mensual", statusBg: "bg-sky-900/60 text-sky-300 border border-sky-500/40" },
      ],
    },
    alacarta: {
      title: "Presupuesto Detallado (Módulos A la Carta)",
      tag: "Componentes Independientes · Tarifas A la Carta",
      total: "$8,550.00 USD",
      strikethroughTotal: "$8,550.00",
      time: "Componentes Sueltos",
      hitos: [
        { label: "Modalidad", amount: "Componentes Sueltos", color: "bg-[#8A2BE2] text-white" },
        { label: "Suma Total Suelta", amount: "$8,550.00 USD", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "1. Admin Inteligente (Auto-carga de E-Commerce, IA en fotos, Inventario & KPIs)", time: "2 Semanas", standard: "$4,000.00", final: "Producto Estrella ⭐", status: "Módulo Top", statusBg: "bg-amber-900/60 text-amber-300 border border-amber-500/40 font-bold" },
        { name: "2. Landing Page Corporativa (Sin E-Commerce)", time: "1.5 Semanas", standard: "$1,200.00", final: "Sin Descuento", status: "Módulo Individual", statusBg: "bg-slate-800 text-slate-300" },
        { name: "3. E-Commerce & Checkout Venezolano (Carrito BCV & WhatsApp API)", time: "2 Semanas", standard: "$1,400.00", final: "Sin Descuento", status: "Módulo Individual", statusBg: "bg-slate-800 text-slate-300" },
        { name: "4. Chatbot IA & Automatización de Respuestas 24/7", time: "1.5 Semanas", standard: "$1,100.00", final: "Sin Descuento", status: "Módulo Individual", statusBg: "bg-slate-800 text-slate-300" },
        { name: "5. Estrategia & Auditoría SEO Mensual (Independiente)", time: "Continuo", standard: "$400.00/mo", final: "$400.00 / mes", status: "SEO Mensual", statusBg: "bg-sky-900/60 text-sky-300 border border-sky-500/40" },
        { name: "6. 🤖 Soluciones & Agentes con IA", time: "A Medida", standard: "Bajo Cotización", final: "Según Requerimientos", status: "Cotización IA", statusBg: "bg-purple-900/60 text-purple-300 border border-purple-500/40" },
        { name: "7. ⚡ Plataformas Custom Enterprise (Desarrolladas a tus necesidades y medidas)", time: "A Medida", standard: "Bajo Cotización", final: "Según Requerimientos", status: "Enterprise Custom", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
      ],
    },
  },
};
