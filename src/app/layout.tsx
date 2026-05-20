import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import SmoothScroll from "@/components/SmoothScroll";

import { Pacifico } from "next/font/google";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
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

const outfitNumbers = localFont({
  src: "../../public/Fonts/outfit-numbers.ttf",
  variable: "--font-outfit-numbers",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dolce Candy Boutique | Dulces Raros y Exclusivos",
  description: "Descubre los dulces más raros y deliciosos del mundo. Como un niño en una dulcería.",
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
