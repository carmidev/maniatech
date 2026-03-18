import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Pacifico } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
        className={`${plusJakarta.variable} ${pacifico.variable} font-sans antialiased`}
      >
        <CartProvider>
          {children}
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
