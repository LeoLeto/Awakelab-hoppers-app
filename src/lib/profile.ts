export interface HoppersProfileData {
  name: string;
  email: string;
  country: string;
  sapModules: string[];
  certifications: string;
  currentRole: string;
  targetRole: string;
  yearsExperience: string;
  linkedin: string;
  salary: string;
  phone: string;
  city: string;
  bio: string;
  education: string;
  languages: string[];
  availability: string;
  jobPreferences: string[];
  portfolio: string;
  photo: string;
}

export const EMPTY_PROFILE: HoppersProfileData = {
  name: "", email: "", country: "", sapModules: [], certifications: "",
  currentRole: "", targetRole: "", yearsExperience: "", linkedin: "", salary: "",
  phone: "", city: "", bio: "", education: "", languages: [], availability: "",
  jobPreferences: [], portfolio: "", photo: "",
};

const PROFILE_KEY = (email: string) => `hoppers_profile_${email.toLowerCase()}`;

export function getProfile(email: string): HoppersProfileData {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE };
  try {
    const stored = localStorage.getItem(PROFILE_KEY(email));
    return stored ? { ...EMPTY_PROFILE, ...JSON.parse(stored) } : { ...EMPTY_PROFILE };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveProfile(email: string, profile: HoppersProfileData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY(email), JSON.stringify(profile));
}

export function buildProfileFromDiagnostic(
  session: { name: string; email: string; country: string },
  diagResult: Record<string, unknown> | null,
): Partial<HoppersProfileData> {
  const base: Partial<HoppersProfileData> = {
    name: session.name,
    email: session.email,
    country: session.country,
  };
  if (!diagResult) return base;
  const r = diagResult as Record<string, unknown>;
  if (Array.isArray(r.modules)) base.sapModules = r.modules as string[];
  if (typeof r.certifications === "string") base.certifications = r.certifications;
  if (typeof r.currentRole === "string") base.currentRole = r.currentRole;
  if (typeof r.targetRole === "string") base.targetRole = r.targetRole;
  if (typeof r.yearsExperience === "string") base.yearsExperience = r.yearsExperience;
  if (typeof r.linkedin === "string") base.linkedin = r.linkedin;
  if (typeof r.salary === "string") base.salary = r.salary;
  return base;
}

interface CompletionField {
  key: keyof HoppersProfileData;
  points: number;
  label: string;
  section: "básica" | "SAP" | "online" | "preferencias" | "sobre_mi";
}

export const COMPLETION_FIELDS: CompletionField[] = [
  { key: "name",           points: 5,  label: "Nombre completo",    section: "básica" },
  { key: "email",          points: 5,  label: "Email",              section: "básica" },
  { key: "country",        points: 5,  label: "País",               section: "básica" },
  { key: "sapModules",     points: 5,  label: "Módulos SAP",        section: "SAP" },
  { key: "currentRole",    points: 3,  label: "Rol actual",         section: "SAP" },
  { key: "targetRole",     points: 2,  label: "Rol objetivo",       section: "SAP" },
  { key: "linkedin",       points: 5,  label: "LinkedIn",           section: "online" },
  { key: "salary",         points: 5,  label: "Salario actual",     section: "preferencias" },
  { key: "phone",          points: 10, label: "Teléfono",           section: "básica" },
  { key: "city",           points: 5,  label: "Ciudad",             section: "básica" },
  { key: "bio",            points: 10, label: "Resumen profesional", section: "sobre_mi" },
  { key: "education",      points: 10, label: "Educación",          section: "sobre_mi" },
  { key: "languages",      points: 5,  label: "Idiomas",            section: "sobre_mi" },
  { key: "availability",   points: 5,  label: "Disponibilidad",     section: "preferencias" },
  { key: "jobPreferences", points: 5,  label: "Modalidad de trabajo", section: "preferencias" },
  { key: "portfolio",      points: 5,  label: "Portfolio / GitHub", section: "online" },
  { key: "photo",          points: 10, label: "Foto de perfil",     section: "básica" },
];

function fieldHasValue(profile: HoppersProfileData, key: keyof HoppersProfileData): boolean {
  const v = profile[key];
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === "string" && v.trim().length > 0;
}

export function calculateCompletion(profile: HoppersProfileData): number {
  return COMPLETION_FIELDS.reduce((sum, f) => {
    return sum + (fieldHasValue(profile, f.key) ? f.points : 0);
  }, 0);
}

export function getMissingFields(profile: HoppersProfileData): CompletionField[] {
  return COMPLETION_FIELDS.filter((f) => !fieldHasValue(profile, f.key));
}
