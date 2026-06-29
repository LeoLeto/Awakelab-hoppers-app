"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Circle, BookOpen,
  User, TrendingUp, BarChart2, FileText, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import {
  getProfile, calculateCompletion, getMissingFields,
  loadProfileFromDB, EMPTY_PROFILE,
  type HoppersProfileData,
} from "@/lib/profile";
import { recommendCertifications } from "@/lib/data/sapCertifications";
import { roleLabels } from "@/lib/data/sapProfiles";

interface DiagResult {
  empScore: number;
  seniority: string;
  skills: string[];
  empDesc: string;
  matches: { slug: string; name: string; matchPct: number; salaryES?: string; salaryDE?: string; demandLevel: string }[];
  salaryExpectations: { country: string; flag: string; salary: string }[];
}

const SENIORITY_LABELS: Record<string, string> = {
  junior:   "Junior · 0-3 años",
  mid:      "Intermedio · 3-5 años",
  senior:   "Senior · 5-7 años",
  architect: "Arquitecto / Lead · 8+ años",
};

function scoreColor(score: number) {
  return score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : score >= 40 ? "#F97316" : "#EF4444";
}

function completionColor(pct: number) {
  return pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<HoppersProfileData>(EMPTY_PROFILE);
  const [diag, setDiag] = useState<DiagResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const session = getSession();
      if (!session) { router.replace("/login"); return; }

      let p = getProfile(session.email);
      const fromDB = await loadProfileFromDB();
      if (fromDB) p = { ...EMPTY_PROFILE, ...(fromDB as Partial<HoppersProfileData>) };
      setProfile(p);
      setCompletion(calculateCompletion(p));
      setMissing(getMissingFields(p).map((f) => f.label));

      try {
        const stored = localStorage.getItem("hoppers_diag_result");
        if (stored) setDiag(JSON.parse(stored));
      } catch {}

      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-hopper-red/20 border-t-hopper-red rounded-full animate-spin" />
      </div>
    );
  }

  const session = getSession();
  const sc = scoreColor(diag?.empScore ?? 0);
  const cc = completionColor(completion);

  const recommendedCerts = recommendCertifications(
    profile.sapModules, profile.currentRole, profile.targetRole, profile.yearsExperience, 5,
  );

  const ownedCertNames = profile.certifications
    ? profile.certifications.split(", ").map((s) => s.trim()).filter(Boolean)
    : [];
  const wantedCertNames = profile.targetCertifications
    ? profile.targetCertifications.split(", ").map((s) => s.trim()).filter(Boolean)
    : [];

  const currentRoleLabel = roleLabels[profile.currentRole] ?? profile.currentRole ?? "—";
  const targetRoleLabel  = roleLabels[profile.targetRole]  ?? profile.targetRole  ?? "—";

  const salaries = diag?.salaryExpectations?.filter((s) => s.salary !== "N/D").slice(0, 2) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

      {/* ── Cabecera de perfil ─────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-hopper-red flex items-center justify-center text-white text-xl font-black shrink-0 overflow-hidden">
              {profile.photo
                ? <img src={profile.photo} className="w-full h-full object-cover" alt="" />
                : session?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-black text-hopper-black leading-tight">{session?.name}</h1>
              <p className="text-sm text-gray-400">{session?.email}</p>
              {profile.currentRole && (
                <p className="text-sm font-semibold text-hopper-red mt-0.5">{currentRoleLabel}</p>
              )}
            </div>
          </div>
          <Link href="/perfil">
            <Button variant="outline" size="sm" className="text-sm">Editar perfil</Button>
          </Link>
        </div>

        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Perfil completado</span>
            <span className="font-bold" style={{ color: cc }}>{completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completion}%`, backgroundColor: cc }} />
          </div>
          {missing.length > 0 && (
            <p className="text-xs text-gray-400">
              Falta por completar: {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` y ${missing.length - 3} más` : ""}
            </p>
          )}
        </div>
      </Card>

      {/* ── Empleabilidad + Ruta ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Índice de empleabilidad */}
        {diag ? (
          <Card className="p-5 bg-hopper-black text-white space-y-3">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Índice de empleabilidad</p>
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black" style={{ color: sc }}>{diag.empScore}%</p>
              <p className="text-sm text-gray-300 mb-1">{SENIORITY_LABELS[diag.seniority] ?? diag.seniority}</p>
            </div>
            {diag.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {diag.skills.slice(0, 4).map((s) => (
                  <span key={s} className="text-xs bg-hopper-red/20 text-hopper-red border border-hopper-red/30 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <Link href="/diagnostico" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
              Ver diagnóstico completo <ChevronRight className="w-3 h-3" />
            </Link>
          </Card>
        ) : (
          <Card className="p-5 bg-hopper-black text-white flex flex-col justify-between min-h-[180px]">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Índice de empleabilidad</p>
              <p className="text-sm text-gray-300">Aún no has completado el diagnóstico SAP.</p>
              <p className="text-xs text-gray-500 mt-1">Tarda menos de 3 minutos.</p>
            </div>
            <Link href="/diagnostico" className="mt-4 block">
              <Button className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white">
                Hacer diagnóstico →
              </Button>
            </Link>
          </Card>
        )}

        {/* Ruta profesional */}
        <Card className="p-5 space-y-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tu ruta profesional</p>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Rol actual</p>
              <p className="text-sm font-bold text-hopper-black">{currentRoleLabel || "—"}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-hopper-red shrink-0" />
            <div className="flex-1 bg-hopper-red/5 border border-hopper-red/20 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-0.5">Objetivo</p>
              <p className="text-sm font-bold text-hopper-red">{targetRoleLabel || "—"}</p>
            </div>
          </div>

          {profile.sapModules.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Módulos SAP</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.sapModules.slice(0, 5).map((m) => (
                  <span key={m} className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                ))}
                {profile.sapModules.length > 5 && (
                  <span className="text-xs text-gray-400 self-center">+{profile.sapModules.length - 5}</span>
                )}
              </div>
            </div>
          )}

          {salaries.length > 0 && (
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              {salaries.map((s) => (
                <div key={s.country} className="text-center bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xl">{s.flag}</p>
                  <p className="text-xs text-gray-400">{s.country}</p>
                  <p className="text-xs font-bold text-hopper-black mt-0.5">{s.salary}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Certificaciones recomendadas ───────────────────── */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-hopper-black">Certificaciones recomendadas</p>
          <Link href="/perfil" className="text-xs text-hopper-red hover:underline flex items-center gap-0.5">
            Gestionar <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {recommendedCerts.length > 0 ? (
          <div className="space-y-2">
            {recommendedCerts.map((cert) => {
              const short  = cert.name.replace(/^SAP Certified [^-]+ - /, "");
              const owned  = ownedCertNames.includes(cert.name);
              const wanted = !owned && wantedCertNames.includes(cert.name);
              return (
                <div
                  key={cert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    owned  ? "border-green-200 bg-green-50"
                    : wanted ? "border-amber-200 bg-amber-50"
                    : "border-gray-100 bg-gray-50"
                  }`}
                >
                  {owned
                    ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    : wanted
                    ? <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    : <Circle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-hopper-black leading-tight">{short}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{cert.level} · {cert.modules.join(", ")}</p>
                  </div>
                  {owned  && <span className="text-xs font-semibold text-green-700 shrink-0 mt-0.5">Obtenida</span>}
                  {wanted && <span className="text-xs font-semibold text-amber-700 shrink-0 mt-0.5">En lista</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-2">
            Completa tu perfil con módulos y rol para ver certificaciones recomendadas.
          </p>
        )}
      </Card>

      {/* ── Accesos rápidos ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/perfil",      Icon: User,      label: "Mi perfil",       sub: `${completion}% completado` },
          { href: "/mercado",     Icon: TrendingUp, label: "Mercado laboral", sub: "Ofertas SAP" },
          { href: "/salarios",    Icon: BarChart2,  label: "Salarios",        sub: "Por módulo y país" },
          { href: "/diagnostico", Icon: FileText,   label: "Diagnóstico",     sub: diag ? "Ver resultado" : "Hacer ahora" },
        ].map(({ href, Icon, label, sub }) => (
          <Link key={href} href={href}>
            <Card className="p-4 text-center hover:border-hopper-red/40 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center justify-center gap-1.5">
              <Icon className="w-6 h-6 text-hopper-red" />
              <p className="text-xs font-bold text-hopper-black">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
