import type { Metadata, Viewport } from "next";
import {
  Great_Vibes,
  Playfair_Display,
  Rubik,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-receipt",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "10 Razones por las que Te Amo",
  description: "To my sweet baby, my love, my everything.",
};

// Barra del navegador en Android del mismo rojo que la página
export const viewport: Viewport = {
  themeColor: "#b0172b",
  // Evita que el modo oscuro forzado de Android invierta los colores
  colorScheme: "only light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${greatVibes.variable} ${spaceMono.variable} ${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
