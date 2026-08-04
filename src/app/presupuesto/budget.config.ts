export interface BudgetConfig {
  clientName: string;
  clientSubtitle: string;
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
  projectName: "Propuesta Técnica & Estimación Comercial",
  heroTagline: "Dominando la arena tecnológica con arquitectura custom",
  heroDescription: "Plataforma web transaccional custom diseñada sobre Next.js 15, Tailwind CSS y la infraestructura Serverless de alto rendimiento con estética Dark Gaming Neón.",
  agencyName: "CarMiDev",
  agencyLogoUrl: "/Group 4.png",
  whatsappPhone: "584242056858",
  valueBadges: [
    "⚡ Código Custom sin Plantillas",
    "🎯 UI/UX Dark Gaming de Alta Conversión",
    "🚀 Carga Sub-Segundo & SEO",
    "💳 Checkout Venezolano (Tasa BCV & Pagos)",
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
      tag: "OPCIÓN A - MVP CORE",
      title: "Plataforma Base E-Commerce",
      desc: "E-Commerce completo con Landing Page, catálogo interactivo y checkout venezolano vía WhatsApp.",
      time: "2 Semanas",
      price: "$1,400.00 USD",
      deliverables: [
        "✅ Landing Page Corporativa con Hero Banner & Búsqueda",
        "✅ Catálogo de Hardware con Grilla Móvil de 2 Columnas",
        "✅ Modales Ficha de Producto y Filtros Dinámicos",
        "✅ Checkout Venezolano con Tasa BCV & Carrito Drawer",
        "✅ Botón Directo de Confirmación a WhatsApp API",
        "✅ Despliegue en Vercel Serverless & Dominio SSL",
      ],
      whatsappText: "CONTRATAR PLAN CORE",
      whatsappMsg: "Hola CarMiDev! Me interesa contratar el Plan Core E-Commerce para ManiaTech ($1,400 USD).",
    },
    momentum: {
      tag: "OPCIÓN B - FULL STACK (RECOMENDADO)",
      title: "E-Commerce + Admin Inteligente IA",
      desc: "E-Commerce transaccional completo + Panel de Administración con Auto-carga Inteligente e Inventario.",
      time: "3.5 Semanas",
      price: "$2,800.00 USD",
      deliverables: [
        "✅ Todo lo incluido en el Plan Core E-Commerce",
        "✅ Dashboard Admin CarMiIA: Auto-carga de Productos",
        "✅ Control de Inventario, Precios & Stock en Tiempo Real",
        "✅ Módulo de Reportes & Métricas de Ventas",
        "✅ Optimización Avanzada SEO & Carga Sub-Segundo",
        "✅ Soporte Prioritario 60 Días Post-Lanzamiento",
      ],
      whatsappText: "CONTRATAR PLAN FULL STACK",
      whatsappMsg: "Hola CarMiDev! Me interesa el Plan Full Stack E-Commerce + Admin IA para ManiaTech ($2,800 USD).",
    },
    alacarta: {
      tag: "OPCIÓN C - A LA CARTA",
      title: "Módulos & Escalabilidad",
      desc: "Selecciona individualmente los componentes específicos que tu negocio necesita.",
      time: "1 a 2 Semanas",
      price: "Bajo Cotización",
      deliverables: [
        "📌 E-Commerce & Checkout Venezolano: $1,400.00 USD",
        "📌 Admin Inteligente IA & Inventario: $1,600.00 USD",
        "📌 Chatbot IA Atención 24/7 WhatsApp: $1,100.00 USD",
        "📌 Estrategia SEO & Auditoría Mensual: $400.00/mes",
      ],
      whatsappText: "CONSULTAR A LA CARTA",
      whatsappMsg: "Hola CarMiDev! Quisiera cotizar módulos A la Carta para ManiaTech.",
    },
  },
  tableData: {
    core: {
      title: "Desglose de Entregables - Plan Core E-Commerce",
      tag: "DETALLE TÉCNICO",
      total: "$1,400.00 USD",
      strikethroughTotal: "$1,800.00 USD",
      time: "2 Semanas",
      hitos: [
        { label: "Hito 1 (Inicio): 50%", amount: "$700.00 USD", color: "bg-[#8A2BE2] text-white" },
        { label: "Hito 2 (Entrega): 50%", amount: "$700.00 USD", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "Landing Page & Hero Gaming Mode", time: "3 Días", standard: "$400 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "Catálogo Responsivo con Grilla 2-Cols & Búsqueda", time: "4 Días", standard: "$500 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "Checkout Venezolano (Tasa BCV + Métodos Locales)", time: "3 Días", standard: "$500 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "Integración Directa a WhatsApp API", time: "2 Días", standard: "$200 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "Despliegue Vercel Serverless & Dominio SSL", time: "2 Días", standard: "$200 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
      ],
    },
    momentum: {
      title: "Desglose de Entregables - Plan Full Stack + Admin IA",
      tag: "DETALLE TÉCNICO",
      total: "$2,800.00 USD",
      strikethroughTotal: "$3,400.00 USD",
      time: "3.5 Semanas",
      hitos: [
        { label: "Hito 1 (Inicio): 40%", amount: "$1,120.00 USD", color: "bg-[#8A2BE2] text-white" },
        { label: "Hito 2 (Avance): 30%", amount: "$840.00 USD", color: "bg-purple-800 text-white" },
        { label: "Hito 3 (Entrega): 30%", amount: "$840.00 USD", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "Plataforma E-Commerce Completa & Checkout BCV", time: "2 Semanas", standard: "$1,400 USD", final: "Incluido", status: "COMPLETADO", statusBg: "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" },
        { name: "Admin Inteligente CarMiIA: Auto-Carga & Inventario", time: "1.5 Semanas", standard: "$1,600 USD", final: "Incluido", status: "PENDIENTE", statusBg: "bg-purple-900/60 text-purple-300 border border-purple-500/40" },
        { name: "Módulo de Reportes & Métricas de Ventas", time: "3 Días", standard: "$400 USD", final: "Incluido", status: "PENDIENTE", statusBg: "bg-purple-900/60 text-purple-300 border border-purple-500/40" },
      ],
    },
    alacarta: {
      title: "Desglose Módulos A La Carta",
      tag: "DETALLE TÉCNICO",
      total: "Según Selección",
      strikethroughTotal: "-",
      time: "1 a 2 Semanas",
      hitos: [
        { label: "Hito 1 (Inicio): 50%", amount: "50%", color: "bg-[#8A2BE2] text-white" },
        { label: "Hito 2 (Entrega): 50%", amount: "50%", color: "bg-[#00FF00] text-black font-bold" },
      ],
      rows: [
        { name: "E-Commerce & Checkout Venezolano", time: "2 Semanas", standard: "$1,400 USD", final: "$1,400 USD", status: "DISPONIBLE", statusBg: "bg-slate-800 text-slate-300" },
        { name: "Admin Inteligente IA (Auto-Carga & Visión)", time: "1.5 Semanas", standard: "$1,600 USD", final: "$1,600 USD", status: "DISPONIBLE", statusBg: "bg-slate-800 text-slate-300" },
        { name: "Chatbot IA & Automatización 24/7", time: "1.5 Semanas", standard: "$1,100 USD", final: "$1,100 USD", status: "DISPONIBLE", statusBg: "bg-slate-800 text-slate-300" },
        { name: "Auditoría & Posicionamiento SEO Mensual", time: "Continuo", standard: "$400 USD/mes", final: "$400 USD/mes", status: "SUSCRIPCIÓN", statusBg: "bg-indigo-900 text-indigo-300" },
      ],
    },
  },
};
