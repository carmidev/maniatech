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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-catamaran)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
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
