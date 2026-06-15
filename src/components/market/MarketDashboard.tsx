"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Briefcase,
  Globe,
  Clock,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sapProfiles, demandLevels } from "@/lib/data/sapProfiles";
import { allSalaryData } from "@/lib/data/salaryData";

const totalJobPostings = sapProfiles.reduce(
  (acc, p) => acc + p.avgJobPostings,
  0
);
const criticalProfiles = sapProfiles.filter(
  (p) => p.demandLevel === "critical"
).length;
const growingProfiles = sapProfiles.filter(
  (p) => p.trendDirection === "up"
).length;

const demandByCategory = [
  {
    name: "Funcional",
    value: sapProfiles
      .filter((p) => p.category === "functional")
      .reduce((acc, p) => acc + p.avgJobPostings, 0),
  },
  {
    name: "Tecnico",
    value: sapProfiles
      .filter((p) => p.category === "technical")
      .reduce((acc, p) => acc + p.avgJobPostings, 0),
  },
  {
    name: "Gestion",
    value: sapProfiles
      .filter((p) => p.category === "management")
      .reduce((acc, p) => acc + p.avgJobPostings, 0),
  },
];

const COLORS = ["#FF1800", "#B79E80", "#3C0405"];

const weeklyTrend = [
  { week: "Sem 1", postings: 3200 },
  { week: "Sem 2", postings: 3350 },
  { week: "Sem 3", postings: 3100 },
  { week: "Sem 4", postings: 3500 },
  { week: "Sem 5", postings: 3420 },
  { week: "Sem 6", postings: 3650 },
  { week: "Sem 7", postings: 3580 },
  { week: "Sem 8", postings: 3800 },
  { week: "Sem 9", postings: 3720 },
  { week: "Sem 10", postings: 3900 },
  { week: "Sem 11", postings: 3850 },
  { week: "Sem 12", postings: 4020 },
];

const regionData = [
  { region: "Espana", postings: 850, avgSalary: 55210 },
  { region: "Alemania", postings: 1200, avgSalary: 82000 },
  { region: "Suiza", postings: 320, avgSalary: 145000 },
  { region: "Francia", postings: 680, avgSalary: 62000 },
  { region: "Italia", postings: 420, avgSalary: 52000 },
  { region: "Mexico", postings: 380, avgSalary: 48000 },
  { region: "USA", postings: 560, avgSalary: 145000 },
];

const TrendIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
  if (direction === "up")
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (direction === "down")
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
};

export default function MarketDashboard() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-hopper-beige/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-hopper-red/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-hopper-red" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hopper-black">
                  {totalJobPostings.toLocaleString("es-ES")}+
                </p>
                <p className="text-xs text-hopper-black/40">Ofertas SAP activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-hopper-beige/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hopper-black">
                  {criticalProfiles}
                </p>
                <p className="text-xs text-hopper-black/40">Perfiles con demanda critica</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-hopper-beige/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hopper-black">14</p>
                <p className="text-xs text-hopper-black/40">Paises monitorizados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-hopper-beige/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-hopper-black">
                  {growingProfiles}/{sapProfiles.length}
                </p>
                <p className="text-xs text-hopper-black/40">Perfiles en alza</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly trend */}
        <Card className="lg:col-span-2 border-hopper-beige/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-hopper-black">
              Evolucion de ofertas SAP (ultimas 12 semanas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDC9B320" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#000A1A60" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#000A1A60" }} />
                  <Tooltip
                    contentStyle={{
                      borderColor: "#DDC9B3",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="postings"
                    stroke="#FF1800"
                    strokeWidth={2}
                    dot={{ fill: "#FF1800", r: 3 }}
                    name="Ofertas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demand by category */}
        <Card className="border-hopper-beige/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-hopper-black">
              Demanda por categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demandByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {demandByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderColor: "#DDC9B3",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) =>
                      `${Number(value).toLocaleString("es-ES")} ofertas`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {demandByCategory.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="text-xs text-hopper-black/50">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Profiles Ranked */}
      <Card className="border-hopper-beige/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-hopper-black">
            Ranking de perfiles por demanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sapProfiles
              .sort((a, b) => b.avgJobPostings - a.avgJobPostings)
              .map((profile, i) => {
                const demand = demandLevels[profile.demandLevel];
                const maxPostings = sapProfiles[0]?.avgJobPostings || 1;
                return (
                  <div
                    key={profile.slug}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-sm font-mono text-hopper-black/30 w-6 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-hopper-black truncate">
                          {profile.name}
                        </span>
                        <TrendIcon direction={profile.trendDirection} />
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${demand.color} border shrink-0`}
                        >
                          {demand.label}
                        </Badge>
                      </div>
                      <div className="h-1.5 bg-hopper-beige/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-hopper-murray to-hopper-red rounded-full transition-all duration-500"
                          style={{
                            width: `${(profile.avgJobPostings / maxPostings) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-hopper-black/50 w-20 text-right">
                      ~{profile.avgJobPostings} ofertas
                    </span>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Region comparison */}
      <Card className="border-hopper-beige/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-hopper-black">
            Ofertas SAP por region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDC9B320" />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11, fill: "#000A1A60" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#000A1A60" }} />
                <Tooltip
                  contentStyle={{
                    borderColor: "#DDC9B3",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="postings"
                  fill="#FF1800"
                  radius={[4, 4, 0, 0]}
                  name="Ofertas"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* S/4HANA Migration Banner */}
      <div className="rounded-xl bg-gradient-to-r from-hopper-black to-hopper-granate p-8 sm:p-10">
        <div className="flex items-start gap-4">
          <Clock className="h-8 w-8 text-hopper-red shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              El efecto S/4HANA en el mercado laboral
            </h3>
            <p className="text-white/60 leading-relaxed max-w-3xl">
              Con la fecha limite de migracion de SAP ECC fijada para 2027
              (extension hasta 2030), las empresas estan acelerando sus
              proyectos de conversion. Esto ha generado un incremento del 35% en
              la demanda de consultores especializados en S/4HANA Cloud,
              migracion de datos y arquitectura de soluciones. Los perfiles con
              certificacion en S/4HANA ven un incremento salarial de hasta un
              12% respecto a sus pares no certificados.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-hopper-red">+35%</p>
                <p className="text-xs text-white/40 mt-1">
                  Incremento demanda S/4HANA
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-hopper-beige">2027</p>
                <p className="text-xs text-white/40 mt-1">
                  Fin mantenimiento ECC
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">+12%</p>
                <p className="text-xs text-white/40 mt-1">
                  Bonus por certificacion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
