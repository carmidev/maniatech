import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8A2BE2", // Morado Twitch / Neón
          dark: "#6441A5",
          foreground: "#FFFFFF",
        },
        dark: {
          DEFAULT: "#0B0B0C", // Fondo principal
          card: "#141416",     // Fondo de cards
          hover: "#1F1F23",    // Hover de elementos
          border: "#26262B",   // Bordes sutiles
        },
        accent: {
          green: "#00FF00",   // Verde Neón Razer (En Stock / Éxito)
          red: "#FF0033",     // Rojo Neón (Ofertas / Hot Deals)
          purple: "#8A2BE2",  // Morado Acento
        },
        brand: {
          purple: "#6441A5",
          neonPurple: "#8A2BE2",
          neonGreen: "#00FF00",
          neonRed: "#FF0033",
          darkBg: "#0B0B0C",
          cardBg: "#141416",
          lightGray: "#E0E0E0",
          muted: "#8E8E93",
        }
      },
      fontFamily: {
        'display-main': ["var(--font-inter-display)", "sans-serif"],
        display: ["var(--font-inter-display)", "sans-serif"],
        body: ["var(--font-inter-display)", "system-ui", "sans-serif"],
        numbers: ["var(--font-outfit-numbers)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        main: '-0.05em',
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
    },
  },
  plugins: [],
};
export default config;
