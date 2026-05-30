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
  title: `${brand.name} Academy — Daily rituals for a glowing life`,
  description:
    "Bite-sized video courses for beauty, wellness, and personal growth. Face yoga, skincare, mindfulness, style, and more — 20+ courses, daily practice, real results.",
  robots: { index: true, follow: true },
  openGraph: {
    title: `${brand.name} Academy — Daily rituals for a glowing life`,
    description:
      "Bite-sized video courses for beauty, wellness, and personal growth. 20+ courses, daily practice, real results.",
    images: ["/hero.jpg"],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
