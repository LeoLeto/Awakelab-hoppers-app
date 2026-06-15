import Link from "next/link";
import { ArrowRight, FileText, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-hopper-granate overflow-hidden">
          {/* Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #FF1800 0%, transparent 40%)",
            }}
          />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <p className="text-hopper-red font-bold text-sm tracking-wider uppercase mb-4">
              Proximamente
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
              Tu diagnostico personalizado con inteligencia artificial
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
              Registrate y recibe un analisis completo de tu perfil SAP: match
              laboral, empleabilidad y una ruta de formacion personalizada.
            </p>

            {/* Features preview */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-hopper-beige" />
                </div>
                <p className="text-sm text-white/70">
                  Agente conversacional IA
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-hopper-beige" />
                </div>
                <p className="text-sm text-white/70">Sube tu CV o LinkedIn</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-hopper-beige" />
                </div>
                <p className="text-sm text-white/70">Informe PDF descargable</p>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/registro">
                <Button
                  size="lg"
                  className="bg-hopper-red hover:bg-hopper-red-dark text-white px-10 h-12 text-base"
                >
                  Registrarme gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-xs text-white/30">
                Gratis. Sin compromiso. Sin tarjeta de credito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
