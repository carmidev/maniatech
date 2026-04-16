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
          DEFAULT: "#e81e25", // Rojo Principal (Vibrant)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#ea9000", // Ocre
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#ea6060", // Coral
          foreground: "#1F2937",
        },
        brand: {
          red: "#bd2926", // Rojo-Logo (Darker)
          darkred: "#a50404", // Rojo oscuro
          brown: "#633c32", // Marrón Osc.
          lightbrown: "#9b6a59", // Marrón Claro
          cream: "#eab8ac", // Crema
          blue: "#86ccef", // Azul claro
          darkgray: "#231f20", // Gris Oscuro
        }
      },
      fontFamily: {
        'display-main': ["var(--font-cocogoose-main)", "sans-serif"],
        display: ["var(--font-cocogoose-titles)", "sans-serif"],
        body: ["var(--font-inter-display)", "system-ui", "sans-serif"],
        numbers: ["var(--font-outfit-numbers)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        main: '-0.05em', // -50pt en Illustrator equivale a -0.05em (tracking-main)
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
