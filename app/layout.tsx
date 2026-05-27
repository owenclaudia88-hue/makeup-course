import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import MetaPixel from "./components/MetaPixel";
import { brand } from "@/lib/offer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luumora.online"),
  title: `${brand.name} – 10 Min Makeup 40+`,
  description:
    "Se yngre, fräschare och mer självsäker ut på 10 minuter. Proffsguiden för dig över 40 – 9 lektioner, checklistor och en komplett 10-minutersrutin.",
  robots: { index: true, follow: true },
  openGraph: {
    title: `${brand.name} – 10 Min Makeup 40+`,
    description:
      "Se 10 år yngre ut på 10 minuter om dagen. Proffsguiden för dig över 40.",
    images: ["/hero.jpg"],
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
