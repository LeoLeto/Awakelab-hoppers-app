import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hoppers | Comunidad SAP - Salarios, Perfiles y Mercado Laboral",
  description:
    "Descubre salarios SAP por pais y rol, perfiles mas demandados, tendencias del mercado laboral y orientacion profesional. Better. Smarter. Hoppers.",
  keywords: [
    "SAP",
    "salarios SAP",
    "consultor SAP",
    "S/4HANA",
    "empleo SAP",
    "Hoppers Academy",
    "formacion SAP",
    "ABAP",
    "FI/CO",
    "mercado laboral SAP",
  ],
  openGraph: {
    title: "Hoppers | Comunidad SAP - Better. Smarter. Hoppers.",
    description:
      "Salarios SAP actualizados, perfiles mas demandados y orientacion profesional para Europa y Latinoamerica.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
