export interface SAPProfile {
  slug: string;
  name: string;
  nameEn: string;
  category: "functional" | "technical" | "management";
  module: string;
  description: string;
  requiredSkills: string[];
  certifications: string[];
  demandLevel: "critical" | "high" | "medium" | "low";
  migrationRelevance: "high" | "medium" | "low";
  careerPath: string[];
  avgJobPostings: number;
  trendDirection: "up" | "down" | "stable";
}

export const sapProfiles: SAPProfile[] = [
  {
    slug: "consultant_fi_co",
    name: "Consultor Funcional FI/CO",
    nameEn: "FI/CO Functional Consultant",
    category: "functional",
    module: "FI/CO",
    description:
      "Especialista en los modulos de Finanzas (FI) y Controlling (CO) de SAP. Responsable de la configuracion de procesos contables, gestion financiera, centros de coste y reportes financieros.",
    requiredSkills: [
      "Contabilidad financiera",
      "Controlling",
      "Gestion de activos",
      "Cierres contables",
      "Reporting financiero",
      "S/4HANA Finance",
      "Integracion FI-MM/SD",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Cloud Financial Accounting",
      "SAP Certified Associate - SAP S/4HANA Management Accounting",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Junior FI/CO", "Consultor FI/CO", "Senior FI/CO", "Lead / Arquitecto Financiero"],
    avgJobPostings: 340,
    trendDirection: "up",
  },
  {
    slug: "consultant_sd",
    name: "Consultor Funcional SD",
    nameEn: "SD Functional Consultant",
    category: "functional",
    module: "SD",
    description:
      "Experto en el modulo de Ventas y Distribucion. Configura procesos de ventas, facturacion, gestion de pedidos, precios y condiciones comerciales dentro del ecosistema SAP.",
    requiredSkills: [
      "Gestion de pedidos",
      "Facturacion",
      "Condiciones de precio",
      "Entregas y expediciones",
      "Integracion SD-MM/FI",
      "S/4HANA Sales",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Sales",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Junior SD", "Consultor SD", "Senior SD", "Lead Comercial SAP"],
    avgJobPostings: 280,
    trendDirection: "up",
  },
  {
    slug: "consultant_mm",
    name: "Consultor Funcional MM",
    nameEn: "MM Functional Consultant",
    category: "functional",
    module: "MM",
    description:
      "Especialista en Gestion de Materiales. Configura procesos de compras, gestion de inventarios, evaluacion de proveedores y planificacion de necesidades de materiales.",
    requiredSkills: [
      "Gestion de compras",
      "Inventario",
      "Evaluacion de proveedores",
      "MRP",
      "Gestion de almacenes",
      "Integracion MM-FI/SD",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Sourcing and Procurement",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Junior MM", "Consultor MM", "Senior MM", "Lead Supply Chain"],
    avgJobPostings: 260,
    trendDirection: "stable",
  },
  {
    slug: "consultant_pp",
    name: "Consultor Funcional PP",
    nameEn: "PP Functional Consultant",
    category: "functional",
    module: "PP",
    description:
      "Especialista en Planificacion de la Produccion. Configura procesos de fabricacion, planificacion de capacidades, ordenes de produccion y gestion de la cadena productiva.",
    requiredSkills: [
      "Planificacion de produccion",
      "MRP",
      "Gestion de capacidades",
      "Ordenes de fabricacion",
      "Integracion PP-MM/CO",
      "S/4HANA Manufacturing",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Manufacturing",
    ],
    demandLevel: "medium",
    migrationRelevance: "medium",
    careerPath: ["Junior PP", "Consultor PP", "Senior PP", "Lead Produccion"],
    avgJobPostings: 150,
    trendDirection: "stable",
  },
  {
    slug: "abap_developer",
    name: "Consultor ABAP (Classic + RAP/CDS)",
    nameEn: "ABAP Developer",
    category: "technical",
    module: "ABAP",
    description:
      "Desarrollador tecnico especializado en el lenguaje ABAP de SAP. Domina tanto el ABAP clasico como las nuevas tecnologias RAP (RESTful ABAP Programming) y CDS Views para S/4HANA.",
    requiredSkills: [
      "ABAP clasico",
      "ABAP OO",
      "RAP (RESTful ABAP)",
      "CDS Views",
      "Fiori/UI5",
      "AMDP",
      "ALV/Web Dynpro",
      "Debugging",
      "Performance tuning",
    ],
    certifications: [
      "SAP Certified Associate - Back-End Developer - ABAP Cloud",
      "SAP Certified Development Associate - ABAP with SAP NetWeaver",
    ],
    demandLevel: "critical",
    migrationRelevance: "high",
    careerPath: ["Junior ABAP", "Developer ABAP", "Senior ABAP", "Arquitecto Tecnico"],
    avgJobPostings: 420,
    trendDirection: "up",
  },
  {
    slug: "basis_admin",
    name: "Consultor Basis / NetWeaver",
    nameEn: "Basis Administrator",
    category: "technical",
    module: "Basis/NetWeaver",
    description:
      "Administrador de sistemas SAP. Responsable de la instalacion, configuracion, transporte, monitoreo y mantenimiento de la infraestructura SAP.",
    requiredSkills: [
      "Administracion SAP",
      "Transportes",
      "Monitoreo de sistemas",
      "SAP HANA DB",
      "Solution Manager",
      "S/4HANA Administration",
      "Linux/Windows Server",
    ],
    certifications: [
      "SAP Certified Technology Associate - SAP S/4HANA System Administration",
    ],
    demandLevel: "medium",
    migrationRelevance: "high",
    careerPath: ["Junior Basis", "Basis Admin", "Senior Basis", "Lead Infraestructura SAP"],
    avgJobPostings: 180,
    trendDirection: "stable",
  },
  {
    slug: "s4hana_cloud",
    name: "Consultor S/4HANA Cloud",
    nameEn: "S/4HANA Cloud Consultant",
    category: "functional",
    module: "S/4HANA Cloud",
    description:
      "Especialista en la implementacion y configuracion de SAP S/4HANA Cloud (Public y Private Edition). La habilidad mas demandada del ecosistema debido a la fecha limite de migracion 2027/2030.",
    requiredSkills: [
      "S/4HANA Cloud Public Ed.",
      "S/4HANA Cloud Private Ed.",
      "Fit-to-Standard",
      "Clean Core",
      "SAP BTP Integration",
      "Activate Methodology",
      "Key User Extensibility",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Cloud Public Edition",
      "SAP Certified Associate - SAP Activate Project Manager",
    ],
    demandLevel: "critical",
    migrationRelevance: "high",
    careerPath: ["Consultor Cloud Jr", "Consultor S/4HANA Cloud", "Senior Cloud", "Cloud Architect"],
    avgJobPostings: 520,
    trendDirection: "up",
  },
  {
    slug: "s4hana_migration",
    name: "Consultor S/4HANA Migration",
    nameEn: "S/4HANA Migration Consultant",
    category: "technical",
    module: "S/4HANA Migration",
    description:
      "Especialista en proyectos de migracion desde SAP ECC a S/4HANA. Domina las herramientas de conversion, validacion de datos y estrategias de migracion (Brownfield, Greenfield, Selective).",
    requiredSkills: [
      "System Conversion",
      "New Implementation",
      "Selective Data Transition",
      "SUM (Software Update Manager)",
      "DMLT / Data Migration",
      "Custom Code Adaptation",
      "Simplification Items",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA System Administration",
    ],
    demandLevel: "critical",
    migrationRelevance: "high",
    careerPath: ["Consultor Migration Jr", "Consultor Migration", "Senior Migration", "Migration Architect"],
    avgJobPostings: 380,
    trendDirection: "up",
  },
  {
    slug: "ewm_tm",
    name: "Consultor EWM / TM (Logistica)",
    nameEn: "EWM/TM Logistics Consultant",
    category: "functional",
    module: "EWM/TM",
    description:
      "Especialista en gestion avanzada de almacenes (Extended Warehouse Management) y transporte (Transportation Management) dentro del ecosistema SAP.",
    requiredSkills: [
      "SAP EWM",
      "SAP TM",
      "Gestion de almacenes",
      "Gestion de transporte",
      "Integracion EWM-MM/SD",
      "S/4HANA Logistics",
    ],
    certifications: [
      "SAP Certified Associate - SAP S/4HANA Extended Warehouse Management",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Junior Logistics", "Consultor EWM/TM", "Senior Logistics", "Lead Supply Chain"],
    avgJobPostings: 200,
    trendDirection: "up",
  },
  {
    slug: "successfactors",
    name: "Consultor SuccessFactors (HCM)",
    nameEn: "SuccessFactors Consultant",
    category: "functional",
    module: "SuccessFactors",
    description:
      "Especialista en la plataforma de gestion del capital humano de SAP. Configura modulos de Employee Central, reclutamiento, gestion del desempeno, formacion y compensacion.",
    requiredSkills: [
      "Employee Central",
      "Recruiting",
      "Performance & Goals",
      "Learning",
      "Compensation",
      "Integration Center",
      "SAP HCM/HR",
    ],
    certifications: [
      "SAP Certified Associate - SAP SuccessFactors Employee Central",
    ],
    demandLevel: "high",
    migrationRelevance: "medium",
    careerPath: ["Junior SF", "Consultor SuccessFactors", "Senior SF", "Lead HCM"],
    avgJobPostings: 250,
    trendDirection: "up",
  },
  {
    slug: "btp_developer",
    name: "SAP BTP Developer",
    nameEn: "SAP BTP Developer",
    category: "technical",
    module: "BTP",
    description:
      "Desarrollador en SAP Business Technology Platform. Crea extensiones, integraciones y aplicaciones usando SAP CAP, SAP Fiori, SAP Build y servicios de IA/ML de la plataforma.",
    requiredSkills: [
      "SAP CAP (Node.js/Java)",
      "SAP Fiori / UI5",
      "SAP Build Apps",
      "SAP Integration Suite",
      "Cloud Foundry",
      "SAP HANA Cloud",
      "RESTful APIs",
    ],
    certifications: [
      "SAP Certified Associate - SAP BTP Developer",
    ],
    demandLevel: "critical",
    migrationRelevance: "high",
    careerPath: ["BTP Junior Dev", "BTP Developer", "Senior BTP Dev", "BTP Architect"],
    avgJobPostings: 310,
    trendDirection: "up",
  },
  {
    slug: "integration",
    name: "Consultor Integracion (PI/PO/CPI)",
    nameEn: "SAP Integration Consultant",
    category: "technical",
    module: "PI/PO/CPI",
    description:
      "Especialista en integracion de sistemas con SAP. Domina SAP Process Integration (PI/PO) y SAP Cloud Platform Integration (CPI) para conectar SAP con sistemas externos.",
    requiredSkills: [
      "SAP PI/PO",
      "SAP CPI (Integration Suite)",
      "API Management",
      "EDI/IDoc",
      "SOAP/REST",
      "Mapeo de datos",
      "Middleware",
    ],
    certifications: [
      "SAP Certified Associate - SAP Integration Suite",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Integration Jr", "Consultor Integration", "Senior Integration", "Integration Architect"],
    avgJobPostings: 220,
    trendDirection: "up",
  },
  {
    slug: "project_manager",
    name: "Project Manager SAP",
    nameEn: "SAP Project Manager",
    category: "management",
    module: "Cross-module",
    description:
      "Lider de proyectos SAP con vision transversal. Gestiona equipos, plazos, presupuestos y stakeholders en implementaciones y migraciones SAP de gran escala.",
    requiredSkills: [
      "Gestion de proyectos",
      "SAP Activate",
      "Agile/Scrum",
      "Gestion de stakeholders",
      "Presupuestacion",
      "Risk Management",
      "Conocimiento funcional SAP",
    ],
    certifications: [
      "SAP Certified Associate - SAP Activate Project Manager",
      "PMP",
      "PRINCE2",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Team Lead", "Project Manager", "Senior PM", "Program Director"],
    avgJobPostings: 190,
    trendDirection: "up",
  },
  {
    slug: "solution_architect",
    name: "Solution Architect SAP",
    nameEn: "SAP Solution Architect",
    category: "management",
    module: "Cross-module",
    description:
      "Arquitecto de soluciones con vision integral del ecosistema SAP. Disena la arquitectura tecnica y funcional para grandes transformaciones, alineando tecnologia con objetivos de negocio.",
    requiredSkills: [
      "Arquitectura empresarial",
      "S/4HANA Architecture",
      "SAP BTP",
      "Integracion de sistemas",
      "Cloud strategy",
      "Design Thinking",
      "Conocimiento multi-modulo",
    ],
    certifications: [
      "SAP Certified Professional - Solution Architect",
    ],
    demandLevel: "high",
    migrationRelevance: "high",
    careerPath: ["Senior Consultant", "Solution Architect", "Enterprise Architect", "CTO / VP Technology"],
    avgJobPostings: 130,
    trendDirection: "up",
  },
  {
    slug: "security_grc",
    name: "SAP Security / GRC",
    nameEn: "SAP Security & GRC Consultant",
    category: "technical",
    module: "Security/GRC",
    description:
      "Especialista en seguridad de sistemas SAP y gobierno, riesgo y cumplimiento (GRC). Gestiona roles, autorizaciones, segregacion de funciones y auditorias de acceso.",
    requiredSkills: [
      "Roles y autorizaciones",
      "SAP GRC Access Control",
      "Segregacion de funciones (SoD)",
      "Auditoria de accesos",
      "SUIM/PFCG",
      "Identity Management",
      "S/4HANA Security",
    ],
    certifications: [
      "SAP Certified Associate - SAP Access Control",
    ],
    demandLevel: "medium",
    migrationRelevance: "medium",
    careerPath: ["Security Junior", "Security Consultant", "Senior Security", "CISO / Lead Security"],
    avgJobPostings: 140,
    trendDirection: "stable",
  },
];

export function getProfileBySlug(slug: string): SAPProfile | undefined {
  return sapProfiles.find((p) => p.slug === slug);
}

export function getProfilesByCategory(
  category: SAPProfile["category"]
): SAPProfile[] {
  return sapProfiles.filter((p) => p.category === category);
}

export function getProfilesByDemand(
  level: SAPProfile["demandLevel"]
): SAPProfile[] {
  return sapProfiles.filter((p) => p.demandLevel === level);
}

export const profileCategories = {
  functional: "Funcional",
  technical: "Tecnico",
  management: "Gestion / Liderazgo",
};

export const demandLevels = {
  critical: { label: "Critica", color: "text-red-600 bg-red-50 border-red-200" },
  high: { label: "Alta", color: "text-orange-600 bg-orange-50 border-orange-200" },
  medium: { label: "Media", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  low: { label: "Baja", color: "text-green-600 bg-green-50 border-green-200" },
};

export const roleLabels: Record<string, string> = {
  consultant_fi_co: "Consultor FI/CO",
  consultant_sd: "Consultor SD",
  consultant_mm: "Consultor MM",
  consultant_pp: "Consultor PP",
  abap_developer: "Desarrollador ABAP",
  basis_admin: "Administrador Basis",
  s4hana_cloud: "Consultor S/4HANA Cloud",
  s4hana_migration: "Consultor Migracion S/4HANA",
  ewm_tm: "Consultor EWM/TM",
  successfactors: "Consultor SuccessFactors",
  btp_developer: "Desarrollador BTP",
  integration: "Consultor Integracion",
  project_manager: "Project Manager SAP",
  solution_architect: "Solution Architect SAP",
  security_grc: "Consultor Security/GRC",
};
