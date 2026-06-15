import { DiagnosticTool } from "@/components/diagnostic/DiagnosticTool";

export const metadata = {
  title: "Diagnostico SAP | Hoppers Academy",
  description: "Descubre tu nivel de empleabilidad en el ecosistema SAP. Diagnostico profesional gratuito.",
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-hopper-red/10 text-hopper-red text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Gratuito y confidencial
          </span>
          <h1 className="text-4xl font-black text-hopper-black mb-4">
            Diagnostico de Empleabilidad SAP
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analiza tu perfil profesional en el ecosistema SAP y descubre tu potencial de empleabilidad.
            Resultado inmediato con recomendaciones personalizadas.
          </p>
        </div>
        <DiagnosticTool />
      </div>
    </main>
  );
}
