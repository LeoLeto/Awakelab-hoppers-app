import { sapProfiles } from "@/lib/data/sapProfiles";
import { allSalaryData } from "@/lib/data/salaryData";
import { hoppersCourses, getCoursesForProfiles } from "@/lib/data/courses";
import type { HoppersCourse } from "@/lib/data/courses";
import { formatSalaryRange } from "@/lib/utils/formatters";

export type Seniority = "junior" | "mid" | "senior" | "architect";

export interface DiagnosticMatch {
  slug: string;
  name: string;
  module: string;
  demandLevel: string;
  trendDirection: string;
  avgJobPostings: number;
  certifications: string[];
  requiredSkills: string[];
  careerPath: string[];
  matchPct: number;
  salaryES?: string;
  salaryDE?: string;
}

export interface DiagnosticResult {
  skills: string[];
  seniority: Seniority;
  matches: DiagnosticMatch[];
  empScore: number;
  empDesc: string;
  topSlug: string;
  salaryExpectations: { country: string; flag: string; salary: string; label: string }[];
  recommendedCerts: string[];
  trainingGaps: string[];
  recommendedCourses: HoppersCourse[];
}

export type { HoppersCourse };

const skillKeywords: Record<string, { skill: string; profiles?: string[]; seniority?: Seniority }> = {
  fi: { skill: "FI", profiles: ["consultant_fi_co"] },
  finance: { skill: "FI", profiles: ["consultant_fi_co"] },
  finanzas: { skill: "FI", profiles: ["consultant_fi_co"] },
  contabilidad: { skill: "FI", profiles: ["consultant_fi_co"] },
  accounting: { skill: "FI", profiles: ["consultant_fi_co"] },
  cierres: { skill: "FI", profiles: ["consultant_fi_co"] },
  "activos fijos": { skill: "FI", profiles: ["consultant_fi_co"] },
  co: { skill: "CO", profiles: ["consultant_fi_co"] },
  controlling: { skill: "CO", profiles: ["consultant_fi_co"] },
  "centros de coste": { skill: "CO", profiles: ["consultant_fi_co"] },
  "cost center": { skill: "CO", profiles: ["consultant_fi_co"] },
  sd: { skill: "SD", profiles: ["consultant_sd"] },
  ventas: { skill: "SD", profiles: ["consultant_sd"] },
  sales: { skill: "SD", profiles: ["consultant_sd"] },
  facturación: { skill: "SD", profiles: ["consultant_sd"] },
  billing: { skill: "SD", profiles: ["consultant_sd"] },
  pedidos: { skill: "SD", profiles: ["consultant_sd"] },
  pricing: { skill: "SD", profiles: ["consultant_sd"] },
  mm: { skill: "MM", profiles: ["consultant_mm"] },
  materiales: { skill: "MM", profiles: ["consultant_mm"] },
  compras: { skill: "MM", profiles: ["consultant_mm"] },
  procurement: { skill: "MM", profiles: ["consultant_mm"] },
  inventario: { skill: "MM", profiles: ["consultant_mm"] },
  purchasing: { skill: "MM", profiles: ["consultant_mm"] },
  mrp: { skill: "MRP", profiles: ["consultant_mm", "consultant_pp"] },
  pp: { skill: "PP", profiles: ["consultant_pp"] },
  producción: { skill: "PP", profiles: ["consultant_pp"] },
  manufacturing: { skill: "PP", profiles: ["consultant_pp"] },
  fabricación: { skill: "PP", profiles: ["consultant_pp"] },
  abap: { skill: "ABAP", profiles: ["abap_developer"] },
  programación: { skill: "ABAP", profiles: ["abap_developer"] },
  desarrollo: { skill: "ABAP", profiles: ["abap_developer", "btp_developer"] },
  developer: { skill: "Development", profiles: ["abap_developer", "btp_developer"] },
  debugging: { skill: "Debugging", profiles: ["abap_developer"] },
  rap: { skill: "RAP", profiles: ["abap_developer"] },
  cds: { skill: "CDS Views", profiles: ["abap_developer"] },
  fiori: { skill: "Fiori/UI5", profiles: ["abap_developer", "btp_developer"] },
  ui5: { skill: "UI5", profiles: ["abap_developer", "btp_developer"] },
  amdp: { skill: "AMDP", profiles: ["abap_developer"] },
  odata: { skill: "OData", profiles: ["abap_developer", "btp_developer", "integration"] },
  basis: { skill: "Basis", profiles: ["basis_admin"] },
  administración: { skill: "Admin SAP", profiles: ["basis_admin"] },
  transporte: { skill: "Transportes", profiles: ["basis_admin"] },
  monitoreo: { skill: "Monitoreo", profiles: ["basis_admin"] },
  hana: { skill: "SAP HANA", profiles: ["basis_admin", "abap_developer", "s4hana_cloud"] },
  netweaver: { skill: "NetWeaver", profiles: ["basis_admin"] },
  "s/4hana": { skill: "S/4HANA", profiles: ["s4hana_cloud", "s4hana_migration"] },
  s4hana: { skill: "S/4HANA", profiles: ["s4hana_cloud", "s4hana_migration"] },
  cloud: { skill: "Cloud", profiles: ["s4hana_cloud", "btp_developer"] },
  "clean core": { skill: "Clean Core", profiles: ["s4hana_cloud"] },
  activate: { skill: "SAP Activate", profiles: ["s4hana_cloud", "project_manager"] },
  "fit to standard": { skill: "Fit-to-Standard", profiles: ["s4hana_cloud"] },
  "fit-to-standard": { skill: "Fit-to-Standard", profiles: ["s4hana_cloud"] },
  migración: { skill: "Migration", profiles: ["s4hana_migration"] },
  migration: { skill: "Migration", profiles: ["s4hana_migration"] },
  conversión: { skill: "System Conversion", profiles: ["s4hana_migration"] },
  brownfield: { skill: "Brownfield", profiles: ["s4hana_migration"] },
  greenfield: { skill: "Greenfield", profiles: ["s4hana_migration"] },
  ewm: { skill: "EWM", profiles: ["ewm_tm"] },
  warehouse: { skill: "Warehouse", profiles: ["ewm_tm"] },
  almacen: { skill: "Almacen", profiles: ["ewm_tm"] },
  logística: { skill: "Logística", profiles: ["ewm_tm"] },
  logistics: { skill: "Logistics", profiles: ["ewm_tm"] },
  tm: { skill: "TM", profiles: ["ewm_tm"] },
  successfactors: { skill: "SuccessFactors", profiles: ["successfactors"] },
  "employee central": { skill: "Employee Central", profiles: ["successfactors"] },
  rrhh: { skill: "RRHH", profiles: ["successfactors"] },
  "recursos humanos": { skill: "HR", profiles: ["successfactors"] },
  talento: { skill: "Talent", profiles: ["successfactors"] },
  nómina: { skill: "Payroll", profiles: ["successfactors"] },
  btp: { skill: "BTP", profiles: ["btp_developer"] },
  cap: { skill: "SAP CAP", profiles: ["btp_developer"] },
  build: { skill: "SAP Build", profiles: ["btp_developer"] },
  "cloud foundry": { skill: "Cloud Foundry", profiles: ["btp_developer"] },
  pi: { skill: "PI/PO", profiles: ["integration"] },
  po: { skill: "PI/PO", profiles: ["integration"] },
  cpi: { skill: "CPI", profiles: ["integration"] },
  integración: { skill: "Integración", profiles: ["integration"] },
  integration: { skill: "Integration", profiles: ["integration"] },
  idoc: { skill: "IDoc", profiles: ["integration"] },
  edi: { skill: "EDI", profiles: ["integration"] },
  api: { skill: "API", profiles: ["integration", "btp_developer"] },
  middleware: { skill: "Middleware", profiles: ["integration"] },
  proyecto: { skill: "Project Mgmt", profiles: ["project_manager"] },
  project: { skill: "Project Mgmt", profiles: ["project_manager"] },
  gestión: { skill: "Gestion", profiles: ["project_manager"] },
  scrum: { skill: "Scrum", profiles: ["project_manager"] },
  agile: { skill: "Agile", profiles: ["project_manager"] },
  pmp: { skill: "PMP", profiles: ["project_manager"] },
  stakeholder: { skill: "Stakeholders", profiles: ["project_manager"] },
  arquitectura: { skill: "Arquitectura", profiles: ["solution_architect"] },
  architect: { skill: "Architecture", profiles: ["solution_architect"] },
  enterprise: { skill: "Enterprise", profiles: ["solution_architect"] },
  seguridad: { skill: "Security", profiles: ["security_grc"] },
  security: { skill: "Security", profiles: ["security_grc"] },
  grc: { skill: "GRC", profiles: ["security_grc"] },
  autorizaciones: { skill: "Autorizaciones", profiles: ["security_grc"] },
  sod: { skill: "SoD", profiles: ["security_grc"] },
  auditoría: { skill: "Auditoría", profiles: ["security_grc"] },
  junior: { skill: "Junior", seniority: "junior" },
  senior: { skill: "Senior", seniority: "senior" },
  lead: { skill: "Lead", seniority: "architect" },
  manager: { skill: "Manager", seniority: "architect" },
  director: { skill: "Director", seniority: "architect" },
  arquitecto: { skill: "Arquitecto", seniority: "architect" },
  certificado: { skill: "Certificado SAP" },
  certificación: { skill: "Certificacion SAP" },
  certified: { skill: "Certified" },
};

export function extractSkills(
  text: string,
  yearsExperience?: string
): { skills: string[]; profileScores: Record<string, number>; seniority: Seniority } {
  const lower = text.toLowerCase();
  const found = new Map<string, boolean>();
  const profileScores: Record<string, number> = {};
  let detectedSeniority: Seniority = "mid";

  const yearMatch = lower.match(/(\d+)\s*(anos?|years?|a.os)/);
  if (yearMatch) {
    const y = parseInt(yearMatch[1]);
    if (y <= 3) detectedSeniority = "junior";
    else if (y <= 5) detectedSeniority = "mid";
    else if (y <= 7) detectedSeniority = "senior";
    else detectedSeniority = "architect";
  }

  if (yearsExperience) {
    if (yearsExperience === "0" || yearsExperience === "1-3") detectedSeniority = "junior";
    else if (yearsExperience === "3-5") detectedSeniority = "mid";
    else if (yearsExperience === "5-7") detectedSeniority = "senior";
    else if (yearsExperience === "7+") detectedSeniority = "architect";
  }

  Object.entries(skillKeywords).forEach(([kw, data]) => {
    if (lower.includes(kw)) {
      found.set(data.skill, true);
      if (data.profiles) {
        data.profiles.forEach((p) => {
          profileScores[p] = (profileScores[p] || 0) + 1;
        });
      }
      if (data.seniority) detectedSeniority = data.seniority;
    }
  });

  return { skills: [...found.keys()], profileScores, seniority: detectedSeniority };
}

export function calculateMatches(
  profileScores: Record<string, number>,
  seniority: Seniority
): DiagnosticMatch[] {
  const maxScore = Math.max(...Object.values(profileScores), 1);

  return sapProfiles
    .map((p) => {
      const rawScore = profileScores[p.slug] || 0;
      let matchPct = Math.min(Math.round((rawScore / Math.max(maxScore, 3)) * 100), 95);
      if (p.demandLevel === "critical") matchPct = Math.min(matchPct + 10, 98);
      else if (p.demandLevel === "high") matchPct = Math.min(matchPct + 5, 95);
      if (rawScore > 0 && matchPct < 25) matchPct = 25;

      const salaryES = allSalaryData.find(
        (e) => e.role === p.slug && e.country === "ES" && e.seniority === seniority && e.employmentType === "permanent"
      );
      const salaryDE = allSalaryData.find(
        (e) => e.role === p.slug && e.country === "DE" && e.seniority === seniority && e.employmentType === "permanent"
      );

      return {
        slug: p.slug,
        name: p.name,
        module: p.module,
        demandLevel: p.demandLevel,
        trendDirection: p.trendDirection,
        avgJobPostings: p.avgJobPostings,
        certifications: p.certifications,
        requiredSkills: p.requiredSkills,
        careerPath: p.careerPath,
        matchPct,
        salaryES: salaryES ? formatSalaryRange(salaryES.salaryMin, salaryES.salaryMax, salaryES.currency) : undefined,
        salaryDE: salaryDE ? formatSalaryRange(salaryDE.salaryMin, salaryDE.salaryMax, salaryDE.currency) : undefined,
      };
    })
    .sort((a, b) => b.matchPct - a.matchPct);
}

export function buildDiagnosticResult(text: string, yearsExperience?: string): DiagnosticResult {
  const { skills, profileScores, seniority } = extractSkills(text, yearsExperience);
  const matches = calculateMatches(profileScores, seniority);
  const topMatch = matches[0];
  const empScore = Math.min(Math.max(Math.round(topMatch.matchPct * 0.9 + skills.length * 3), 15), 96);

  let empDesc = "";
  if (empScore >= 80) empDesc = "Excelente posicionamiento. Tu perfil tiene alta demanda en el mercado SAP actual.";
  else if (empScore >= 60) empDesc = "Buen perfil con oportunidades claras. Algunas certificaciones clave podrian impulsar tu empleabilidad.";
  else if (empScore >= 40) empDesc = "Perfil con potencial. Recomendamos formacion especifica para acceder a los roles de mayor demanda.";
  else empDesc = "Estas en el inicio de tu camino SAP. La formacion adecuada puede abrir grandes oportunidades.";

  const countryMeta = [
    { country: "ES", flag: "🇪🇸", name: "España" },
    { country: "DE", flag: "🇩🇪", name: "Alemania" },
    { country: "US", flag: "🇺🇸", name: "USA" },
  ];
  const salaryExpectations = countryMeta.map(({ country, flag, name }) => {
    const entry = allSalaryData.find(
      (e) => e.role === topMatch.slug && e.country === country && e.seniority === seniority && e.employmentType === "permanent"
    );
    return {
      country: name,
      flag,
      salary: entry ? formatSalaryRange(entry.salaryMin, entry.salaryMax, entry.currency) : "N/D",
      label: `${seniority} - ${topMatch.name}`,
    };
  });

  const recommendedCerts = matches
    .slice(0, 3)
    .flatMap((m) => m.certifications)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5);

  const topProfile = sapProfiles.find((p) => p.slug === topMatch.slug);
  const trainingGaps =
    topProfile?.requiredSkills.filter(
      (s) => !skills.some((es) => s.toLowerCase().includes(es.toLowerCase()) || es.toLowerCase().includes(s.toLowerCase().substring(0, 4)))
    ) || [];

  const topSlugs = matches.slice(0, 3).map((m) => m.slug);
  const recommendedCourses = getCoursesForProfiles(topSlugs);

  return {
    skills,
    seniority,
    matches: matches.slice(0, 5),
    empScore,
    empDesc,
    topSlug: topMatch.slug,
    salaryExpectations,
    recommendedCerts,
    trainingGaps,
    recommendedCourses,
  };
}
