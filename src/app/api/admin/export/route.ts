import { cookies } from "next/headers";
import ExcelJS from "exceljs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import { getProfileBySlug, getRoleLabel } from "@/lib/data/sapProfiles";
import { seniorityLabels } from "@/lib/data/salaryData";
import { LEARNING_GOAL_OPTIONS } from "@/lib/profile";

async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  if (!payload) return false;
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  if (payload.email.toLowerCase() === superadminEmail) return true;
  await connectDB();
  const user = await User.findById(payload.id).select("isAdmin").lean() as { isAdmin?: boolean } | null;
  return user?.isAdmin === true;
}

interface ExportUser {
  name: string;
  email: string;
  country?: string;
  createdAt?: Date;
  emailVerified?: boolean;
  yearsExperience?: string;
  currentRole?: string;
  targetRole?: string;
  salary?: string;
  linkedin?: string;
  sapModules?: string[];
  certifications?: string;
  targetCertifications?: string;
  diagnosticDone?: boolean;
  diagnosticDate?: Date;
  empScore?: number;
  topProfile?: string;
  skills?: string[];
  advisoryRequested?: boolean;
  advisoryDate?: Date;
  consentTreatment?: boolean;
  consentCommunications?: boolean;
  consentSharing?: boolean;
  consentDate?: Date;
  phone?: string;
  city?: string;
  bio?: string;
  education?: string;
  languages?: string[];
  availability?: string;
  jobPreferences?: string[];
  portfolio?: string;
  photo?: string;
  linkedinUrl?: string;
  diagnosticResult?: {
    salary?: string;
    seniority?: string;
    matches?: { name: string; matchPct?: number }[];
    recommendedCerts?: string[];
    trainingGaps?: string[];
    recommendedCourses?: { name: string }[];
  };
}

const yesNo = (v?: boolean) => (v ? "Sí" : "No");
const joinUnique = (values: (string | undefined)[]) => [...new Set(values.filter(Boolean))].join(" | ");

// The profile page stores "Objetivo principal" in the salary field, overwriting the salary
// range given in the diagnostic; that range survives in diagnosticResult.salary.
function salaryAndGoal(u: ExportUser) {
  const isGoal = !!u.salary && LEARNING_GOAL_OPTIONS.includes(u.salary);
  return {
    salary: (isGoal ? "" : u.salary) || u.diagnosticResult?.salary || "",
    learningGoal: isGoal ? u.salary : "",
  };
}

// The RGPD modal (treatment and sharing required, communications optional) has gated
// account creation since this commit; choices were only stored from consentDate onwards.
const CONSENT_MODAL_SINCE = new Date("2026-06-19T12:03:26Z");

function consentColumns(u: ExportUser) {
  if (u.consentDate) {
    return {
      consentSource: "Registrado",
      consentTreatment: yesNo(u.consentTreatment),
      consentSharing: yesNo(u.consentSharing),
      consentCommunications: yesNo(u.consentCommunications),
      consentDate: u.consentDate,
    };
  }
  if (u.createdAt && u.createdAt >= CONSENT_MODAL_SINCE) {
    return {
      consentSource: "Deducido (obligatorio al darse de alta)",
      consentTreatment: "Sí",
      consentSharing: "Sí",
      consentCommunications: "Desconocido",
      consentDate: null,
    };
  }
  return {
    consentSource: "Sin registro (alta anterior al consentimiento)",
    consentTreatment: "Desconocido",
    consentSharing: "Desconocido",
    consentCommunications: "Desconocido",
    consentDate: null,
  };
}

export async function GET() {
  if (!(await checkAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  await connectDB();
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  const users = await User.find({ email: { $ne: superadminEmail } })
    .select("name email country createdAt emailVerified yearsExperience currentRole targetRole salary linkedin sapModules certifications targetCertifications diagnosticDone diagnosticDate empScore topProfile skills advisoryRequested advisoryDate consentTreatment consentCommunications consentSharing consentDate phone city bio education languages availability jobPreferences portfolio photo linkedinUrl diagnosticResult")
    .sort({ createdAt: -1 })
    .lean() as unknown as ExportUser[];

  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Inscritos", { views: [{ state: "frozen", ySplit: 1 }] });

  sheet.columns = [
    { header: "Nombre", key: "name", width: 28 },
    { header: "Email", key: "email", width: 34 },
    { header: "Teléfono", key: "phone", width: 18 },
    { header: "País", key: "country", width: 16 },
    { header: "Ciudad", key: "city", width: 18 },
    { header: "Fecha registro", key: "createdAt", width: 16, style: { numFmt: "dd/mm/yyyy" } },
    { header: "Email verificado", key: "emailVerified", width: 16 },
    { header: "Años experiencia SAP", key: "yearsExperience", width: 20 },
    { header: "Rol actual", key: "currentRole", width: 28 },
    { header: "Rol objetivo", key: "targetRole", width: 28 },
    { header: "Salario actual", key: "salary", width: 18 },
    { header: "Objetivo principal", key: "learningGoal", width: 22 },
    { header: "LinkedIn", key: "linkedin", width: 36 },
    { header: "Portfolio / GitHub", key: "portfolio", width: 32 },
    { header: "Módulos SAP", key: "sapModules", width: 32 },
    { header: "Certificaciones obtenidas", key: "certifications", width: 32 },
    { header: "Certificaciones deseadas", key: "targetCertifications", width: 32 },
    { header: "Formación académica", key: "education", width: 36 },
    { header: "Idiomas", key: "languages", width: 24 },
    { header: "Disponibilidad de estudio", key: "availability", width: 22 },
    { header: "Formato de curso preferido", key: "jobPreferences", width: 24 },
    { header: "Motivación y objetivos", key: "bio", width: 50 },
    { header: "Tiene foto", key: "hasPhoto", width: 12 },
    { header: "Diagnóstico completado", key: "diagnosticDone", width: 22 },
    { header: "Fecha diagnóstico", key: "diagnosticDate", width: 18, style: { numFmt: "dd/mm/yyyy" } },
    { header: "Empleabilidad (%)", key: "empScore", width: 18 },
    { header: "Seniority", key: "seniority", width: 26 },
    { header: "Perfil top", key: "topProfile", width: 28 },
    { header: "Perfiles afines (% encaje)", key: "matches", width: 50 },
    { header: "Skills identificadas", key: "skills", width: 40 },
    { header: "Brechas formativas", key: "trainingGaps", width: 40 },
    { header: "Certificaciones recomendadas", key: "recommendedCerts", width: 50 },
    { header: "Cursos recomendados", key: "recommendedCourses", width: 50 },
    { header: "Asesoría solicitada", key: "advisoryRequested", width: 20 },
    { header: "Fecha asesoría", key: "advisoryDate", width: 16, style: { numFmt: "dd/mm/yyyy" } },
    { header: "Acepta comunicaciones", key: "consentCommunications", width: 22 },
    { header: "Acepta tratamiento datos", key: "consentTreatment", width: 24 },
    { header: "Acepta compartir con partners", key: "consentSharing", width: 28 },
    { header: "Fecha consentimiento", key: "consentDate", width: 20, style: { numFmt: "dd/mm/yyyy" } },
    { header: "Origen consentimiento", key: "consentSource", width: 40 },
  ];

  for (const u of users) {
    const diag = u.diagnosticResult;
    sheet.addRow({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      country: u.country || "",
      city: u.city || "",
      createdAt: u.createdAt ?? null,
      emailVerified: yesNo(u.emailVerified),
      yearsExperience: u.yearsExperience || "",
      currentRole: getRoleLabel(u.currentRole),
      targetRole: getRoleLabel(u.targetRole),
      ...salaryAndGoal(u),
      linkedin: joinUnique([u.linkedin, u.linkedinUrl]),
      portfolio: u.portfolio || "",
      sapModules: u.sapModules?.join(", ") ?? "",
      certifications: u.certifications || "",
      targetCertifications: u.targetCertifications || "",
      education: u.education || "",
      languages: u.languages?.join(", ") ?? "",
      availability: u.availability || "",
      jobPreferences: u.jobPreferences?.join(", ") ?? "",
      bio: u.bio || "",
      hasPhoto: yesNo(!!u.photo),
      diagnosticDone: yesNo(u.diagnosticDone),
      diagnosticDate: u.diagnosticDate ?? null,
      empScore: u.empScore ?? null,
      seniority: diag?.seniority ? seniorityLabels[diag.seniority as keyof typeof seniorityLabels] ?? diag.seniority : "",
      topProfile: u.topProfile ? getProfileBySlug(u.topProfile)?.name ?? u.topProfile : "",
      matches: diag?.matches?.map(m => m.matchPct !== undefined ? `${m.name} (${m.matchPct}%)` : m.name).join(", ") ?? "",
      skills: u.skills?.join(", ") ?? "",
      trainingGaps: diag?.trainingGaps?.join(", ") ?? "",
      recommendedCerts: diag?.recommendedCerts?.join(", ") ?? "",
      recommendedCourses: diag?.recommendedCourses?.map(c => c.name).join(", ") ?? "",
      advisoryRequested: yesNo(u.advisoryRequested),
      advisoryDate: u.advisoryDate ?? null,
      ...consentColumns(u),
    });
  }

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
  header.alignment = { vertical: "middle" };
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: sheet.rowCount, column: sheet.columns.length } };

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="hoppers-inscritos-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
