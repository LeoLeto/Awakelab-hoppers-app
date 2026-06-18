import type { Metadata } from "next";
import ProfilesCatalog from "@/components/profiles/ProfilesCatalog";

export const metadata: Metadata = {
  title: "Perfiles SAP - Roles, Skills y Certificaciones | Hoppers",
  description:
    "Catalogo completo de perfiles SAP: consultores funcionales, tecnicos y de gestion. Descubre skills requeridos, certificaciones y niveles de demanda.",
};

export default function PerfilesPage() {
  return (
    <div className="min-h-screen bg-hopper-beige-light/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold text-hopper-red tracking-wider uppercase mb-2">
            Catalogo de perfiles
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-hopper-black tracking-tight">
            Perfiles profesionales SAP
          </h1>
          <p className="mt-3 text-hopper-black/50 max-w-2xl">
            Descubre los 15 perfiles SAP mas relevantes del mercado. Skills
            requeridos, certificaciones, nivel de demanda y ruta profesional para
            cada rol.
          </p>
        </div>

        <ProfilesCatalog />
      </div>
    </div>
  );
}
