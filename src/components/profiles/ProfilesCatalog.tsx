"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Code,
  Settings,
  Users,
  X,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  sapProfiles,
  profileCategories,
  demandLevels,
  type SAPProfile,
} from "@/lib/data/sapProfiles";
import { allSalaryData } from "@/lib/data/salaryData";
import { formatSalaryRange } from "@/lib/utils/formatters";
import { downloadProfileInfographicPDF } from "@/lib/pdf";

const LANGUAGE_BOOSTS: Record<string, { lang: string; boost: string }[]> = {
  default: [
    { lang: "Ingles", boost: "+30%" },
    { lang: "Aleman", boost: "+45%" },
    { lang: "Frances", boost: "+15%" },
  ],
  abap_developer: [
    { lang: "Ingles", boost: "+35%" },
    { lang: "Aleman", boost: "+50%" },
  ],
  btp_developer: [
    { lang: "Ingles", boost: "+40%" },
    { lang: "Aleman", boost: "+35%" },
  ],
  s4hana_cloud: [
    { lang: "Ingles", boost: "+35%" },
    { lang: "Aleman", boost: "+40%" },
  ],
  successfactors: [
    { lang: "Ingles", boost: "+40%" },
    { lang: "Portugues", boost: "+20%" },
  ],
};

function getLanguageBoosts(slug: string) {
  return LANGUAGE_BOOSTS[slug] || LANGUAGE_BOOSTS.default;
}

function InfographicModal({ profile, onClose }: { profile: SAPProfile; onClose: () => void }) {
  const salaries = ["ES", "DE", "CH", "US", "MX"].map((code) => {
    const countryNames: Record<string, string> = { ES: "España", DE: "Alemania", CH: "Suiza", US: "USA", MX: "Mexico" };
    const flags: Record<string, string> = { ES: "🇪🇸", DE: "🇩🇪", CH: "🇨🇭", US: "🇺🇸", MX: "🇲🇽" };
    const s = allSalaryData.find(
      (e) => e.role === profile.slug && e.country === code && e.seniority === "senior" && e.employmentType === "permanent"
    );
    return { code, name: countryNames[code], flag: flags[code], salary: s ? formatSalaryRange(s.salaryMin, s.salaryMax, s.currency) : null };
  }).filter((s) => s.salary);

  const langBoosts = getLanguageBoosts(profile.slug);
  const demandLabel = profile.demandLevel === "critical" ? "Critica" : profile.demandLevel === "high" ? "Alta" : "Media";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-hopper-black text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-hopper-red rounded flex items-center justify-center text-white text-[10px] font-black">H</div>
              <span className="text-xs text-white/40 uppercase tracking-wider">Hoppers Academy | Infografia de Perfil</span>
            </div>
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="text-sm text-white/50">{profile.module}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          <span className="bg-hopper-red text-white text-xs px-3 py-1 rounded-full font-semibold">
            Demanda {demandLabel}
          </span>
          <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
            {profile.trendDirection === "up" ? "En alza" : profile.trendDirection === "down" ? "En baja" : "Estable"}
          </span>
          <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
            ~{profile.avgJobPostings} ofertas activas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { v: `${profile.avgJobPostings}+`, l: "Ofertas" },
            { v: `${profile.careerPath.length}`, l: "Niveles" },
            { v: `${profile.requiredSkills.length}`, l: "Skills" },
            { v: `${profile.certifications.length}`, l: "Certs" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-hopper-red">{s.v}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {salaries.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Salario Senior por pais</p>
            <div className="space-y-2">
              {salaries.map((s) => (
                <div key={s.code} className="flex justify-between items-center text-sm">
                  <span className="text-white/60">{s.flag} {s.name}</span>
                  <span className="font-bold text-white">{s.salary}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Bonus por idioma</p>
          <div className="flex gap-3">
            {langBoosts.map((lb) => (
              <div key={lb.lang} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-sm font-bold text-hopper-red">{lb.boost}</p>
                <p className="text-xs text-white/40">{lb.lang}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Ruta profesional</p>
          <div className="flex items-center gap-2 flex-wrap">
            {profile.careerPath.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded ${i === profile.careerPath.length - 1 ? "bg-hopper-red text-white font-semibold" : "bg-white/10 text-white/60"}`}>
                  {step}
                </span>
                {i < profile.careerPath.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Skills requeridos</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.requiredSkills.map((s) => (
              <span key={s} className="bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded">{s}</span>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Certificaciones</p>
          <div className="space-y-1">
            {profile.certifications.map((c) => (
              <p key={c} className="text-xs text-white/60">→ {c}</p>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            onClick={() => downloadProfileInfographicPDF(profile.slug)}
            className="bg-hopper-red hover:bg-hopper-red/90 text-white gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar infografia PDF
          </Button>
          <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

const categoryIcons = {
  functional: Settings,
  technical: Code,
  management: Users,
};

const TrendIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
  if (direction === "up")
    return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (direction === "down")
    return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-yellow-500" />;
};

function ProfileCard({ profile, onOpenInfographic }: { profile: SAPProfile; onOpenInfographic: (p: SAPProfile) => void }) {
  const [expanded, setExpanded] = useState(false);
  const demand = demandLevels[profile.demandLevel];

  const salaryES = allSalaryData.find(
    (e) =>
      e.role === profile.slug &&
      e.country === "ES" &&
      e.seniority === "senior" &&
      e.employmentType === "permanent"
  );
  const salaryDE = allSalaryData.find(
    (e) =>
      e.role === profile.slug &&
      e.country === "DE" &&
      e.seniority === "senior" &&
      e.employmentType === "permanent"
  );

  const Icon = categoryIcons[profile.category];

  return (
    <Card className="border-hopper-beige/60 hover:border-hopper-murray/40 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-hopper-beige/30 flex items-center justify-center">
              <Icon className="h-5 w-5 text-hopper-murray" />
            </div>
            <div>
              <h3 className="font-bold text-hopper-black">{profile.name}</h3>
              <p className="text-xs text-hopper-black/40">{profile.module}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon direction={profile.trendDirection} />
            <Badge
              variant="outline"
              className={`text-[10px] ${demand.color} border`}
            >
              {demand.label}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-hopper-black/60 leading-relaxed mb-4">
          {profile.description}
        </p>

        {/* Salary preview */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {salaryES && (
            <div className="bg-hopper-beige/15 rounded-lg p-3">
              <p className="text-[10px] text-hopper-black/40 uppercase tracking-wider mb-1">
                Espana (Senior)
              </p>
              <p className="text-sm font-bold text-hopper-black">
                {formatSalaryRange(
                  salaryES.salaryMin,
                  salaryES.salaryMax,
                  salaryES.currency
                )}
              </p>
            </div>
          )}
          {salaryDE && (
            <div className="bg-hopper-beige/15 rounded-lg p-3">
              <p className="text-[10px] text-hopper-black/40 uppercase tracking-wider mb-1">
                Alemania (Senior)
              </p>
              <p className="text-sm font-bold text-hopper-black">
                {formatSalaryRange(
                  salaryDE.salaryMin,
                  salaryDE.salaryMax,
                  salaryDE.currency
                )}
              </p>
            </div>
          )}
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-hopper-red hover:text-hopper-red-dark transition-colors flex items-center gap-1"
        >
          {expanded ? "Menos detalles" : "Mas detalles"}
          <ChevronRight
            className={`h-3 w-3 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-hopper-beige/30 space-y-4">
            {/* Skills */}
            <div>
              <p className="text-xs font-semibold text-hopper-black/60 uppercase tracking-wider mb-2">
                Skills requeridos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.requiredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-[10px] bg-hopper-beige/20 text-hopper-black/60 border-hopper-beige/40"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p className="text-xs font-semibold text-hopper-black/60 uppercase tracking-wider mb-2">
                Certificaciones relevantes
              </p>
              <ul className="space-y-1">
                {profile.certifications.map((cert) => (
                  <li
                    key={cert}
                    className="text-xs text-hopper-black/50 flex items-start gap-1.5"
                  >
                    <span className="text-hopper-red mt-0.5">-</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Path */}
            <div>
              <p className="text-xs font-semibold text-hopper-black/60 uppercase tracking-wider mb-2">
                Ruta profesional
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {profile.careerPath.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-xs text-hopper-black/60 bg-hopper-beige/20 px-2 py-1 rounded">
                      {step}
                    </span>
                    {i < profile.careerPath.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-hopper-black/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <span className="text-xs text-hopper-black/40">
                ~{profile.avgJobPostings} ofertas activas
              </span>
              <span className="text-xs text-hopper-black/40">
                Relevancia migracion:{" "}
                <span className="font-medium capitalize">
                  {profile.migrationRelevance === "high"
                    ? "Alta"
                    : profile.migrationRelevance === "medium"
                    ? "Media"
                    : "Baja"}
                </span>
              </span>
              <button
                onClick={() => onOpenInfographic(profile)}
                className="text-xs font-semibold text-hopper-red hover:underline ml-auto"
              >
                Ver infografia del perfil →
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfilesCatalog() {
  const [infographicProfile, setInfographicProfile] = useState<SAPProfile | null>(null);

  return (
    <>
      {infographicProfile && (
        <InfographicModal profile={infographicProfile} onClose={() => setInfographicProfile(null)} />
      )}
      <Tabs defaultValue="all">
        <TabsList className="bg-hopper-beige/20 mb-8">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="functional">Funcional</TabsTrigger>
          <TabsTrigger value="technical">Tecnico</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sapProfiles
              .sort((a, b) => b.avgJobPostings - a.avgJobPostings)
              .map((profile) => (
                <ProfileCard key={profile.slug} profile={profile} onOpenInfographic={setInfographicProfile} />
              ))}
          </div>
        </TabsContent>

        {(["functional", "technical", "management"] as const).map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sapProfiles
                .filter((p) => p.category === cat)
                .sort((a, b) => b.avgJobPostings - a.avgJobPostings)
                .map((profile) => (
                  <ProfileCard key={profile.slug} profile={profile} onOpenInfographic={setInfographicProfile} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
