import { DiagnosticTool } from "@/components/diagnostic/DiagnosticTool";

export const metadata = {
  title: "Diagnostico SAP | Hoppers Academy",
  description: "Descubre tu nivel de empleabilidad en el ecosistema SAP. Diagnostico profesional gratuito.",
};

export default function DiagnosticoPage() {
  return (
    <main className="bg-gray-50 px-4 py-3" style={{ minHeight: "100dvh" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-3">
          <span className="inline-block bg-hopper-red/10 text-hopper-red text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Gratuito y confidencial
          </span>
          <h1 className="text-xl font-black text-hopper-black mt-1">
            Diagnóstico de Empleabilidad SAP
          </h1>
        </div>
        <DiagnosticTool />
      </div>
    </main>
  );
}
