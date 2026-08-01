import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import SmoothScroll from "@/components/SmoothScroll";

import { Outfit, Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const outfitNumbers = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit-numbers",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const cocogooseMain = localFont({
  src: "../../public/Fonts/cocogoose-main.ttf",
  variable: "--font-cocogoose-main",
  weight: "400",
  display: "swap",
});

const cocogooseTitles = localFont({
  src: "../../public/Fonts/cocogoose-titles.ttf",
  variable: "--font-cocogoose-titles",
  weight: "400",
  display: "swap",
});

const interDisplay = localFont({
  src: "../../public/Fonts/InterDisplay-Regular.woff2",
  variable: "--font-inter-display",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mania Tech | E-Commerce Gaming, Hardware & Creadores",
  description: "El ecosistema de hardware y periféricos más completo de Venezuela. Audífonos, mouses, teclados, cámaras y accesorios con 6 meses de garantía local.",
  icons: {
    icon: "/images/Favicondc.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${cocogooseMain.variable} ${cocogooseTitles.variable} ${interDisplay.variable} ${outfitNumbers.variable} ${pacifico.variable} font-body antialiased`}
      >
        <SmoothScroll>
          <AuthProvider>
            <CartProvider>
              {children}
              <WhatsAppWidget />
            </CartProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
