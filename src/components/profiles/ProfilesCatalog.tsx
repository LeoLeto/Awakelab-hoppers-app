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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sapProfiles,
  profileCategories,
  demandLevels,
  type SAPProfile,
} from "@/lib/data/sapProfiles";
import { allSalaryData } from "@/lib/data/salaryData";
import { formatSalaryRange } from "@/lib/utils/formatters";

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

function ProfileCard({ profile }: { profile: SAPProfile }) {
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
            <div className="flex items-center gap-4 pt-2">
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfilesCatalog() {
  return (
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
              <ProfileCard key={profile.slug} profile={profile} />
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
                <ProfileCard key={profile.slug} profile={profile} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
