"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { sapProfiles, demandLevels } from "@/lib/data/sapProfiles";
import { roleLabels } from "@/lib/data/sapProfiles";

const topProfiles = sapProfiles
  .sort((a, b) => b.avgJobPostings - a.avgJobPostings)
  .slice(0, 6);

const TrendIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
  if (direction === "up") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (direction === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-yellow-500" />;
};

export default function MarketPreview() {
  return (
    <section className="py-20 sm:py-28 bg-hopper-beige-light/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-hopper-red tracking-wider uppercase mb-3">
              Mercado laboral SAP
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-hopper-black tracking-tight">
              Perfiles mas demandados
            </h2>
            <p className="mt-3 text-hopper-black/50 max-w-lg">
              Los roles con mayor numero de ofertas activas en Europa y
              Latinoamerica. Datos actualizados semanalmente.
            </p>
          </div>
          <Link
            href="/mercado"
            className="text-sm font-medium text-hopper-red hover:text-hopper-red-dark inline-flex items-center gap-1 whitespace-nowrap"
          >
            Ver analisis completo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProfiles.map((profile, index) => {
            const demand = demandLevels[profile.demandLevel];
            return (
              <Card
                key={profile.slug}
                className="border-hopper-beige/60 hover:border-hopper-murray/40 transition-all hover:shadow-md group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-hopper-black/30">
                      #{index + 1}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${demand.color} border`}
                    >
                      Demanda {demand.label}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-hopper-black group-hover:text-hopper-red transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-hopper-black/40 mt-1">
                    {profile.module}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-hopper-beige/40">
                    <div className="flex items-center gap-1.5">
                      <TrendIcon direction={profile.trendDirection} />
                      <span className="text-xs text-hopper-black/50">
                        {profile.trendDirection === "up"
                          ? "En alza"
                          : profile.trendDirection === "down"
                          ? "En baja"
                          : "Estable"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-hopper-black/60">
                      ~{profile.avgJobPostings} ofertas
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Migration countdown */}
        <div className="mt-12 rounded-xl bg-hopper-black p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-hopper-red font-bold text-sm tracking-wider uppercase mb-2">
                Fecha limite de migracion SAP
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                S/4HANA 2027 / 2030
              </h3>
              <p className="text-white/50 mt-2 max-w-lg">
                SAP ha establecido el fin de mantenimiento de ECC para 2027 (con
                extension hasta 2030). Las empresas deben migrar a S/4HANA,
                generando una demanda sin precedentes de consultores
                especializados.
              </p>
            </div>
            <Link href="/mercado">
              <button className="whitespace-nowrap rounded-lg bg-hopper-red px-6 py-3 text-sm font-semibold text-white hover:bg-hopper-red-dark transition-colors">
                Ver impacto en el mercado
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
