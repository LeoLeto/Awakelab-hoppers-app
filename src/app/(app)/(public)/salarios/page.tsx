import type { Metadata } from "next";
import SalaryExplorer from "@/components/salary/SalaryExplorer";

export const metadata: Metadata = {
  title: "Salarios SAP por Pais y Rol | Hoppers",
  description:
    "Explora salarios SAP actualizados para consultores FI/CO, ABAP, S/4HANA Cloud y mas. Datos para Espana, Alemania, Suiza, LATAM y USA.",
};

export default function SalariosPage() {
  return (
    <div className="min-h-screen bg-hopper-beige-light/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-hopper-red tracking-wider uppercase mb-2">
            Benchmark salarial
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-hopper-black tracking-tight">
            Salarios SAP por pais y rol
          </h1>
          <p className="mt-3 text-hopper-black/50 max-w-2xl">
            Rangos salariales reales para consultores SAP en nomina y freelance.
            Filtra por region, pais, perfil y experiencia para conocer tu
            posicion en el mercado.
          </p>
        </div>

        <SalaryExplorer />
      </div>
    </div>
  );
}
