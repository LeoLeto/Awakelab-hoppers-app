import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hopper-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 50%, #FF1800 0%, transparent 50%), radial-gradient(circle at 75% 50%, #B79E80 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-hopper-murray/30 bg-hopper-murray/10 px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-hopper-red animate-pulse-subtle" />
            <span className="text-xs font-medium text-hopper-beige tracking-wide uppercase">
              Partner oficial SAP para Europa y LATAM
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            No necesitas un ascenso,
            <br />
            <span className="text-hopper-red">necesitas un upgrade.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl">
            Descubre tu posicion en el mercado SAP. Salarios reales, perfiles mas
            demandados y un camino claro hacia tu siguiente nivel profesional.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/salarios">
              <Button
                size="lg"
                className="bg-hopper-red hover:bg-hopper-red-dark text-white px-8 h-12 text-base"
              >
                Explorar Salarios SAP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/perfiles">
              <Button
                size="lg"
                variant="outline"
                className="border-hopper-murray/40 text-hopper-beige hover:bg-hopper-murray/10 hover:text-white px-8 h-12 text-base"
              >
                Ver Perfiles Demandados
              </Button>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-hopper-red" />
                <span className="text-2xl sm:text-3xl font-bold text-white">15</span>
              </div>
              <p className="text-sm text-white/40">Perfiles SAP analizados</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-hopper-red" />
                <span className="text-2xl sm:text-3xl font-bold text-white">14</span>
              </div>
              <p className="text-sm text-white/40">Paises con datos</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-hopper-red" />
                <span className="text-2xl sm:text-3xl font-bold text-white">3.8k+</span>
              </div>
              <p className="text-sm text-white/40">Ofertas laborales SAP activas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
