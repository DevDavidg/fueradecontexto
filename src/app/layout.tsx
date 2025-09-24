import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Banner } from "@/components/molecules/banner";
import { generateHomeMetadata } from "@/lib/seo-metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
});

export const metadata: Metadata = generateHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-black text-[#ededed] min-h-dvh`}
      >
        <Banner />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
