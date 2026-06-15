import type { Metadata } from "next";
import MarketDashboard from "@/components/market/MarketDashboard";

export const metadata: Metadata = {
  title: "Mercado Laboral SAP - Tendencias y Demanda | Hoppers",
  description:
    "Analisis del mercado laboral SAP: perfiles mas demandados, tendencias de contratacion, impacto de S/4HANA y comparativas por region.",
};

export default function MercadoPage() {
  return (
    <div className="min-h-screen bg-hopper-beige-light/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold text-hopper-red tracking-wider uppercase mb-2">
            Inteligencia de mercado
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-hopper-black tracking-tight">
            Mercado laboral SAP
          </h1>
          <p className="mt-3 text-hopper-black/50 max-w-2xl">
            Datos actualizados del ecosistema SAP: demanda por perfil, tendencias
            de contratacion y el impacto de la migracion a S/4HANA en el
            mercado laboral europeo y latinoamericano.
          </p>
        </div>

        <MarketDashboard />
      </div>
    </div>
  );
}
