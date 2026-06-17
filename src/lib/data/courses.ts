export interface CourseEdition {
  period: string;
  type: "confirmed" | "webinar" | "private";
}

export interface HoppersCourse {
  id: string;
  name: string;
  category: "B2C" | "BTP" | "SAC" | "SFDC";
  description: string;
  durationHours?: number;
  profiles: string[];
  editions: CourseEdition[];
}

export const hoppersCourses: HoppersCourse[] = [
  {
    id: "finanzas_core",
    name: "SAP Finanzas Core - S/4HANA Public Cloud",
    category: "B2C",
    description: "SAP S/4HANA Public o Private – Finanzas Core + Certificado SAP",
    durationHours: 100,
    profiles: ["consultant_fi_co", "s4hana_cloud", "s4hana_migration"],
    editions: [
      { period: "Abr 2026 (1ª)", type: "confirmed" },
      { period: "Jun 2026 (1ª)", type: "webinar" },
      { period: "Oct 2026 (1ª)", type: "private" },
      { period: "Dic 2026 (2ª)", type: "webinar" },
      { period: "Ene 2027 (2ª)", type: "confirmed" },
      { period: "Mar 2027 (2ª)", type: "webinar" },
      { period: "May 2027 (1ª)", type: "private" },
      { period: "Jul 2027 (2ª)", type: "webinar" },
      { period: "Oct 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "supply_chain",
    name: "SAP Supply Chain - S/4HANA Private Cloud",
    category: "B2C",
    description: "SAP S/4HANA Avanzado Supply Chain + ZLC + 1 Certificado SAP",
    durationHours: 200,
    profiles: ["consultant_mm", "consultant_pp", "ewm_tm", "s4hana_migration"],
    editions: [
      { period: "Jun 2026 (1ª)", type: "webinar" },
      { period: "Sep 2026 (1ª)", type: "confirmed" },
      { period: "Dic 2026 (2ª)", type: "webinar" },
      { period: "Mar 2027 (1ª)", type: "confirmed" },
      { period: "Jun 2027 (2ª)", type: "webinar" },
      { period: "Sep 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "supply_chain_expertos",
    name: "SAP Supply Chain para Expertos - S/4HANA Private Cloud",
    category: "B2C",
    description: "SAP S/4HANA Supply Chain Experto (Warehouse / EWM)",
    profiles: ["ewm_tm", "consultant_mm", "consultant_pp"],
    editions: [
      { period: "Oct 2026 (1ª)", type: "webinar" },
      { period: "Feb 2027 (1ª)", type: "confirmed" },
      { period: "Oct 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "btp_admin",
    name: "Introduction to SAP BTP Administration",
    category: "BTP",
    description: "Administración de SAP Business Technology Platform",
    durationHours: 24,
    profiles: ["btp_developer", "basis_admin", "integration", "solution_architect"],
    editions: [
      { period: "Jul 2026 (1ª)", type: "confirmed" },
      { period: "Feb 2027 (1ª)", type: "confirmed" },
      { period: "Sep 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "sac",
    name: "SAP Exploring SAP Analytics Cloud",
    category: "SAC",
    description: "Exploración y uso de SAP Analytics Cloud",
    durationHours: 14,
    profiles: ["consultant_fi_co", "project_manager", "solution_architect"],
    editions: [
      { period: "Jul 2026 (1ª)", type: "webinar" },
      { period: "Oct 2026 (1ª)", type: "confirmed" },
      { period: "Feb 2027 (1ª)", type: "confirmed" },
      { period: "Sep 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "concur_expenses",
    name: "SAP Concur Expenses - Administrador",
    category: "B2C",
    description: "Administración de SAP Concur Expenses / Travel + NUVA",
    durationHours: 8,
    profiles: ["basis_admin", "consultant_fi_co"],
    editions: [
      { period: "Jun 2026 (1ª)", type: "confirmed" },
      { period: "Sep 2026 (1ª)", type: "confirmed" },
      { period: "Ene 2027 (1ª)", type: "confirmed" },
      { period: "Abr 2027 (1ª)", type: "confirmed" },
      { period: "Oct 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "concur_travel",
    name: "SAP Concur Travel & Request - Administrador",
    category: "B2C",
    description: "Administración de SAP Concur Travel & Request + NUVA",
    durationHours: 8,
    profiles: ["basis_admin", "consultant_fi_co"],
    editions: [
      { period: "Jul 2026 (1ª)", type: "confirmed" },
      { period: "Oct 2026 (1ª)", type: "confirmed" },
      { period: "Feb 2027 (1ª)", type: "confirmed" },
      { period: "May 2027 (1ª)", type: "confirmed" },
      { period: "Nov 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "sfdc_agentforce_full",
    name: "SFDC Agentforce + Data 360 + 2x Certificaciones SFDC",
    category: "SFDC",
    description: "Salesforce Agentforce + Data 360 con doble certificación SFDC",
    durationHours: 200,
    profiles: [],
    editions: [
      { period: "Jul 2026 (1ª)", type: "webinar" },
      { period: "Oct 2026 (2ª)", type: "confirmed" },
      { period: "Feb 2027 (1ª)", type: "webinar" },
      { period: "May 2027 (2ª)", type: "confirmed" },
      { period: "Sep 2027 (1ª)", type: "webinar" },
      { period: "Nov 2027 (1ª)", type: "confirmed" },
    ],
  },
  {
    id: "sfdc_agentforce_basic",
    name: "SFDC Agentforce + 1 Certificación SFDC",
    category: "SFDC",
    description: "Salesforce Agentforce con certificación SFDC incluida",
    profiles: [],
    editions: [
      { period: "Nov 2026 (1ª)", type: "webinar" },
      { period: "Feb 2027 (2ª)", type: "confirmed" },
      { period: "Jul 2027 (1ª)", type: "confirmed" },
      { period: "Nov 2027 (2ª)", type: "confirmed" },
    ],
  },
];

export function getCoursesForProfiles(profileSlugs: string[]): HoppersCourse[] {
  const matched: HoppersCourse[] = [];
  const rest: HoppersCourse[] = [];

  for (const course of hoppersCourses) {
    if (course.profiles.some((p) => profileSlugs.includes(p))) {
      matched.push(course);
    } else {
      rest.push(course);
    }
  }

  return [...matched, ...rest];
}

export function nextEdition(course: HoppersCourse): CourseEdition | undefined {
  return course.editions.find((e) => e.type === "confirmed") ?? course.editions[0];
}
