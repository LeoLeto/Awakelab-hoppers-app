export interface SAPModuleGroup {
  label: string;
  emoji: string;
  modules: string[];
}

export const SAP_MODULE_GROUPS: SAPModuleGroup[] = [
  { label: "ERP / S/4HANA",          emoji: "☁️",  modules: ["FI/CO", "SD", "MM", "PP"] },
  { label: "Supply Chain",            emoji: "🏭",  modules: ["EWM/TM"] },
  { label: "Migración & Cloud",       emoji: "🔄",  modules: ["S/4HANA Cloud", "S/4HANA Migration"] },
  { label: "HXM",                     emoji: "👥",  modules: ["SuccessFactors"] },
  { label: "Tecnología & Plataforma", emoji: "⚙️",  modules: ["ABAP", "Basis", "BTP", "PI/PO/CPI"] },
  { label: "Seguridad",               emoji: "🔒",  modules: ["Security/GRC"] },
  { label: "Analytics",               emoji: "📊",  modules: ["SAC"] },
  { label: "Otro",                    emoji: "➕",  modules: ["Otro"] },
];

export interface SAPCertification {
  id: string;
  name: string;
  role: string;
  modules: string[];
  level: "associate" | "professional" | "specialist";
}

export const SAP_ROLES: Record<string, string> = {
  business_user: "Usuario de Negocio",
  sales: "Ventas",
  presales: "Preventa",
  support_consultant: "Consultor de Soporte",
  consultant: "Consultor",
  data_analyst: "Analista de Datos",
  project_manager: "Jefe de Proyecto",
  developer: "Desarrollador",
  administrator: "Administrador",
  data_scientist: "Científico de Datos",
  architect: "Arquitecto",
};

export const SAP_CERTIFICATIONS: SAPCertification[] = [
  // ADMINISTRATOR (9)
  { id: "admin_s4_system", name: "SAP Certified Technology Associate - SAP S/4HANA System Administration", role: "administrator", modules: ["Basis", "S/4HANA Migration"], level: "associate" },
  { id: "admin_hana", name: "SAP Certified Technology Associate - SAP HANA 2.0 Administration", role: "administrator", modules: ["Basis"], level: "associate" },
  { id: "admin_basis", name: "SAP Certified Technology Associate - SAP Basis Administration", role: "administrator", modules: ["Basis"], level: "associate" },
  { id: "admin_sf", name: "SAP Certified Technology Associate - SAP SuccessFactors Administration", role: "administrator", modules: ["SuccessFactors"], level: "associate" },
  { id: "admin_btp", name: "SAP Certified Technology Associate - SAP BTP Administrator", role: "administrator", modules: ["BTP"], level: "associate" },
  { id: "admin_integration", name: "SAP Certified Technology Associate - SAP Integration Suite Administrator", role: "administrator", modules: ["PI/PO/CPI", "BTP"], level: "associate" },
  { id: "admin_identity", name: "SAP Certified Technology Associate - Cloud Identity Services", role: "administrator", modules: ["Security/GRC", "BTP"], level: "associate" },
  { id: "admin_fiori", name: "SAP Certified Technology Associate - SAP Fiori System Administration", role: "administrator", modules: ["Basis", "ABAP"], level: "associate" },
  { id: "admin_ewm", name: "SAP Certified Technology Associate - SAP EWM on S/4HANA", role: "administrator", modules: ["EWM/TM"], level: "associate" },

  // ARCHITECT (7)
  { id: "arch_enterprise", name: "SAP Certified Professional - SAP Enterprise Architecture", role: "architect", modules: ["S/4HANA Migration", "S/4HANA Cloud"], level: "professional" },
  { id: "arch_mdg", name: "SAP Certified Professional - SAP Master Data Governance", role: "architect", modules: ["S/4HANA Migration", "FI/CO"], level: "professional" },
  { id: "arch_btp", name: "SAP Certified Specialist - SAP BTP Solution Architecture", role: "architect", modules: ["BTP"], level: "specialist" },
  { id: "arch_integration", name: "SAP Certified Professional - SAP Integration Solution Design", role: "architect", modules: ["PI/PO/CPI", "BTP"], level: "professional" },
  { id: "arch_s4cloud", name: "SAP Certified Professional - SAP S/4HANA Cloud Solution Architecture", role: "architect", modules: ["S/4HANA Cloud", "S/4HANA Migration"], level: "professional" },
  { id: "arch_sac", name: "SAP Certified Professional - SAP Analytics Cloud Planning", role: "architect", modules: ["SAC"], level: "professional" },
  { id: "arch_process", name: "SAP Certified Technology Associate - SAP Process Orchestration", role: "architect", modules: ["PI/PO/CPI"], level: "associate" },

  // BUSINESS USER (5)
  { id: "buser_fi_cloud", name: "SAP Certified Associate - SAP S/4HANA Cloud - Financial Accounting Business User", role: "business_user", modules: ["FI/CO", "S/4HANA Cloud"], level: "associate" },
  { id: "buser_procurement", name: "SAP Certified Associate - SAP S/4HANA Cloud - Procurement Business User", role: "business_user", modules: ["MM", "S/4HANA Cloud"], level: "associate" },
  { id: "buser_sales", name: "SAP Certified Associate - SAP S/4HANA Cloud - Sales Order Management Business User", role: "business_user", modules: ["SD", "S/4HANA Cloud"], level: "associate" },
  { id: "buser_pm", name: "SAP Certified Associate - SAP S/4HANA Cloud - Project Management Business User", role: "business_user", modules: ["S/4HANA Cloud"], level: "associate" },
  { id: "buser_sf", name: "SAP Certified Associate - SAP SuccessFactors Business User", role: "business_user", modules: ["SuccessFactors"], level: "associate" },

  // CONSULTANT - FI/CO
  { id: "cons_fi", name: "SAP Certified Associate - SAP S/4HANA for Financial Accounting", role: "consultant", modules: ["FI/CO"], level: "associate" },
  { id: "cons_co", name: "SAP Certified Associate - SAP S/4HANA for Management Accounting", role: "consultant", modules: ["FI/CO"], level: "associate" },
  { id: "cons_fi_cloud", name: "SAP Certified Associate - SAP S/4HANA Cloud - Financial Accounting", role: "consultant", modules: ["FI/CO", "S/4HANA Cloud"], level: "associate" },
  { id: "cons_fi_pro", name: "SAP Certified Professional - SAP S/4HANA for Financial Accounting", role: "consultant", modules: ["FI/CO"], level: "professional" },
  { id: "cons_co_pro", name: "SAP Certified Professional - SAP S/4HANA for Management Accounting", role: "consultant", modules: ["FI/CO"], level: "professional" },
  { id: "cons_asset", name: "SAP Certified Associate - SAP S/4HANA Asset Management", role: "consultant", modules: ["FI/CO", "PP"], level: "associate" },

  // CONSULTANT - SD
  { id: "cons_sd", name: "SAP Certified Associate - SAP S/4HANA Sales", role: "consultant", modules: ["SD"], level: "associate" },
  { id: "cons_sd_cloud", name: "SAP Certified Associate - SAP S/4HANA Cloud - Sales", role: "consultant", modules: ["SD", "S/4HANA Cloud"], level: "associate" },
  { id: "cons_sd_pro", name: "SAP Certified Professional - SAP S/4HANA Sales", role: "consultant", modules: ["SD"], level: "professional" },

  // CONSULTANT - MM
  { id: "cons_mm", name: "SAP Certified Associate - SAP S/4HANA Sourcing and Procurement", role: "consultant", modules: ["MM"], level: "associate" },
  { id: "cons_mm_cloud", name: "SAP Certified Associate - SAP S/4HANA Cloud - Sourcing and Procurement", role: "consultant", modules: ["MM", "S/4HANA Cloud"], level: "associate" },
  { id: "cons_mm_pro", name: "SAP Certified Professional - SAP S/4HANA Sourcing and Procurement", role: "consultant", modules: ["MM"], level: "professional" },

  // CONSULTANT - PP
  { id: "cons_pp", name: "SAP Certified Associate - SAP S/4HANA Production Planning and Manufacturing", role: "consultant", modules: ["PP"], level: "associate" },
  { id: "cons_pp_cloud", name: "SAP Certified Associate - SAP S/4HANA Cloud - Manufacturing", role: "consultant", modules: ["PP", "S/4HANA Cloud"], level: "associate" },

  // CONSULTANT - EWM/TM
  { id: "cons_ewm", name: "SAP Certified Associate - SAP S/4HANA Warehouse Management", role: "consultant", modules: ["EWM/TM"], level: "associate" },
  { id: "cons_tm", name: "SAP Certified Associate - SAP Transportation Management", role: "consultant", modules: ["EWM/TM"], level: "associate" },

  // CONSULTANT - SuccessFactors
  { id: "cons_sf_ec", name: "SAP Certified Associate - SAP SuccessFactors Employee Central Core", role: "consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "cons_sf_rec", name: "SAP Certified Associate - SAP SuccessFactors Recruiting Management", role: "consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "cons_sf_lrn", name: "SAP Certified Associate - SAP SuccessFactors Learning", role: "consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "cons_sf_perf", name: "SAP Certified Associate - SAP SuccessFactors Performance and Goal Management", role: "consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "cons_sf_comp", name: "SAP Certified Associate - SAP SuccessFactors Compensation", role: "consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "cons_sf_onb", name: "SAP Certified Associate - SAP SuccessFactors Onboarding", role: "consultant", modules: ["SuccessFactors"], level: "associate" },

  // CONSULTANT - GRC/Security
  { id: "cons_grc", name: "SAP Certified Associate - SAP Access Control", role: "consultant", modules: ["Security/GRC"], level: "associate" },
  { id: "cons_iag", name: "SAP Certified Associate - SAP Identity Access Governance", role: "consultant", modules: ["Security/GRC", "BTP"], level: "associate" },

  // CONSULTANT - Integration/BTP
  { id: "cons_integration", name: "SAP Certified Associate - SAP Integration Suite", role: "consultant", modules: ["PI/PO/CPI", "BTP"], level: "associate" },
  { id: "cons_bpa", name: "SAP Certified Associate - SAP Build Process Automation", role: "consultant", modules: ["BTP"], level: "associate" },
  { id: "cons_s4impl", name: "SAP Certified Associate - SAP S/4HANA Cloud Implementation", role: "consultant", modules: ["S/4HANA Migration", "S/4HANA Cloud"], level: "associate" },

  // DATA ANALYST (6)
  { id: "da_sac", name: "SAP Certified Application Associate - SAP Analytics Cloud", role: "data_analyst", modules: ["SAC"], level: "associate" },
  { id: "da_webi", name: "SAP Certified Application Associate - SAP BusinessObjects Web Intelligence", role: "data_analyst", modules: ["SAC"], level: "associate" },
  { id: "da_bi", name: "SAP Certified Application Associate - SAP BusinessObjects BI Platform", role: "data_analyst", modules: ["SAC"], level: "associate" },
  { id: "da_bw", name: "SAP Certified Application Associate - SAP BW/4HANA", role: "data_analyst", modules: ["SAC", "S/4HANA Migration"], level: "associate" },
  { id: "da_datasphere", name: "SAP Certified Application Associate - SAP Datasphere", role: "data_analyst", modules: ["SAC", "BTP"], level: "associate" },
  { id: "da_bpc", name: "SAP Certified Application Associate - SAP BusinessObjects Planning and Consolidation", role: "data_analyst", modules: ["FI/CO", "SAC"], level: "associate" },

  // DATA SCIENTIST (2)
  { id: "ds_ai_core", name: "SAP Certified Associate - SAP AI Core and AI Launchpad", role: "data_scientist", modules: ["BTP"], level: "associate" },
  { id: "ds_ml", name: "SAP Certified Associate - Machine Learning with SAP AI Business Services", role: "data_scientist", modules: ["BTP"], level: "associate" },

  // DEVELOPER (8)
  { id: "dev_abap_cloud", name: "SAP Certified Associate - Back-End Developer - ABAP Cloud", role: "developer", modules: ["ABAP", "BTP", "S/4HANA Cloud"], level: "associate" },
  { id: "dev_abap", name: "SAP Certified Development Associate - ABAP with SAP NetWeaver", role: "developer", modules: ["ABAP", "Basis"], level: "associate" },
  { id: "dev_build_apps", name: "SAP Certified Associate - SAP Build Apps", role: "developer", modules: ["BTP"], level: "associate" },
  { id: "dev_frontend", name: "SAP Certified Associate - Front-End Developer", role: "developer", modules: ["ABAP", "BTP"], level: "associate" },
  { id: "dev_fiori", name: "SAP Certified Development Associate - SAP Fiori Application Developer", role: "developer", modules: ["ABAP", "BTP"], level: "associate" },
  { id: "dev_ext", name: "SAP Certified Associate - Developer - SAP Extension Suite", role: "developer", modules: ["BTP", "ABAP"], level: "associate" },
  { id: "dev_integration", name: "SAP Certified Development Associate - SAP Integration Developer", role: "developer", modules: ["PI/PO/CPI", "BTP"], level: "associate" },
  { id: "dev_mobile", name: "SAP Certified Associate - Developer - SAP Mobile Services", role: "developer", modules: ["BTP"], level: "associate" },

  // PRESALES (9)
  { id: "pre_s4", name: "SAP Certified Associate - SAP S/4HANA Cloud Presales", role: "presales", modules: ["S/4HANA Cloud", "S/4HANA Migration"], level: "associate" },
  { id: "pre_sf", name: "SAP Certified Associate - SAP SuccessFactors Presales", role: "presales", modules: ["SuccessFactors"], level: "associate" },
  { id: "pre_sac", name: "SAP Certified Associate - SAP Analytics Cloud Presales", role: "presales", modules: ["SAC"], level: "associate" },
  { id: "pre_btp", name: "SAP Certified Associate - SAP BTP Presales", role: "presales", modules: ["BTP"], level: "associate" },
  { id: "pre_cx", name: "SAP Certified Associate - SAP Customer Experience Presales", role: "presales", modules: ["SD"], level: "associate" },
  { id: "pre_ariba", name: "SAP Certified Associate - SAP Ariba Presales", role: "presales", modules: ["MM"], level: "associate" },
  { id: "pre_spend", name: "SAP Certified Associate - SAP Spend Management Presales", role: "presales", modules: ["MM", "FI/CO"], level: "associate" },
  { id: "pre_erp", name: "SAP Certified Associate - SAP ERP Presales", role: "presales", modules: ["FI/CO", "SD", "MM", "PP"], level: "associate" },
  { id: "pre_clm", name: "SAP Certified Associate - SAP CLM Presales", role: "presales", modules: ["MM", "SD"], level: "associate" },

  // PROJECT MANAGER (7)
  { id: "pm_activate", name: "SAP Certified Associate - SAP Activate Project Manager", role: "project_manager", modules: ["S/4HANA Migration", "S/4HANA Cloud"], level: "associate" },
  { id: "pm_activate_pro", name: "SAP Certified Professional - SAP Activate Project Manager", role: "project_manager", modules: ["S/4HANA Migration", "S/4HANA Cloud"], level: "professional" },
  { id: "pm_change", name: "SAP Certified Associate - SAP Change Management", role: "project_manager", modules: ["S/4HANA Migration"], level: "associate" },
  { id: "pm_solman", name: "SAP Certified Technology Associate - SAP Solution Manager", role: "project_manager", modules: ["Basis", "S/4HANA Migration"], level: "associate" },
  { id: "pm_cloud_ops", name: "SAP Certified Associate - SAP Cloud Operations", role: "project_manager", modules: ["S/4HANA Cloud", "BTP"], level: "associate" },
  { id: "pm_agile", name: "SAP Certified Associate - SAP Agile Delivery", role: "project_manager", modules: ["S/4HANA Cloud"], level: "associate" },
  { id: "pm_rise", name: "SAP Certified Associate - RISE with SAP S/4HANA Cloud", role: "project_manager", modules: ["S/4HANA Cloud", "S/4HANA Migration"], level: "associate" },

  // SALES (9)
  { id: "sales_s4", name: "SAP Certified Associate - SAP S/4HANA Cloud Sales", role: "sales", modules: ["S/4HANA Cloud", "SD"], level: "associate" },
  { id: "sales_sf", name: "SAP Certified Associate - SAP SuccessFactors Sales", role: "sales", modules: ["SuccessFactors"], level: "associate" },
  { id: "sales_cx", name: "SAP Certified Associate - SAP Customer Experience Sales", role: "sales", modules: ["SD"], level: "associate" },
  { id: "sales_sac", name: "SAP Certified Associate - SAP Analytics Cloud Sales", role: "sales", modules: ["SAC"], level: "associate" },
  { id: "sales_ariba", name: "SAP Certified Associate - SAP Ariba Sales", role: "sales", modules: ["MM"], level: "associate" },
  { id: "sales_btp", name: "SAP Certified Associate - SAP BTP Sales", role: "sales", modules: ["BTP"], level: "associate" },
  { id: "sales_spend", name: "SAP Certified Associate - SAP Spend Management Sales", role: "sales", modules: ["MM", "FI/CO"], level: "associate" },
  { id: "sales_rise", name: "SAP Certified Associate - RISE with SAP Sales", role: "sales", modules: ["S/4HANA Cloud", "S/4HANA Migration"], level: "associate" },
  { id: "sales_hxm", name: "SAP Certified Associate - SAP HXM Solutions Sales", role: "sales", modules: ["SuccessFactors"], level: "associate" },

  // SUPPORT CONSULTANT (5)
  { id: "sup_basis", name: "SAP Certified Technology Support Associate - SAP Basis", role: "support_consultant", modules: ["Basis"], level: "associate" },
  { id: "sup_hana", name: "SAP Certified Technology Support Associate - SAP HANA", role: "support_consultant", modules: ["Basis"], level: "associate" },
  { id: "sup_s4", name: "SAP Certified Technology Support Associate - SAP S/4HANA", role: "support_consultant", modules: ["S/4HANA Migration", "FI/CO", "SD", "MM"], level: "associate" },
  { id: "sup_sf", name: "SAP Certified Technology Support Associate - SAP SuccessFactors", role: "support_consultant", modules: ["SuccessFactors"], level: "associate" },
  { id: "sup_btp", name: "SAP Certified Technology Support Associate - SAP BTP", role: "support_consultant", modules: ["BTP"], level: "associate" },
];

export function recommendCertifications(
  selectedModules: string[],
  currentRole: string,
  targetRole: string,
  yearsExperience: string,
  maxResults = 10,
): SAPCertification[] {
  const years = parseInt(yearsExperience) || 0;
  const isSenior = years >= 5;

  const scored = SAP_CERTIFICATIONS.map((cert) => {
    let score = 0;

    // Module overlap (max 40 pts)
    if (selectedModules.length > 0) {
      const matches = cert.modules.filter((m) => selectedModules.includes(m)).length;
      score += (matches / cert.modules.length) * 40;
    }

    // Role match (max 35 pts)
    if (cert.role === targetRole) score += 35;
    else if (cert.role === currentRole) score += 20;

    // Level appropriateness (max 25 pts)
    if (cert.level === "professional") {
      score += isSenior ? 25 : 5;
    } else if (cert.level === "specialist") {
      score += isSenior ? 20 : 12;
    } else {
      score += isSenior ? 10 : 25;
    }

    return { cert, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.cert);
}
