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
          DEFAULT: "#EE3123", // Rojo Principal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F7941D", // Ocre
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#ED5565", // Coral
          foreground: "#1F2937",
        },
        brand: {
          red: "#ED1C24",
          darkred: "#B10D1F",
          brown: "#603813",
          lightbrown: "#C49A6C",
          cream: "#EDCFC3",
          blue: "#93CDEA",
          darkgray: "#212121",
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
