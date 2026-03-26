import type { Metadata } from "next";
import { Inter, Catamaran, Pacifico } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Dolce Candy Boutique | Dulces Raros y Exclusivos",
  description: "Descubre los dulces más raros y deliciosos del mundo. Como un niño en una dulcería.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${catamaran.variable} ${pacifico.variable} font-sans antialiased`}
      >
        <SmoothScroll>
          <CartProvider>
            {children}
            <WhatsAppWidget />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
