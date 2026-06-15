export type Seniority = "junior" | "mid" | "senior" | "architect";
export type EmploymentType = "permanent" | "freelance";

export interface SalaryEntry {
  country: string;
  city?: string;
  role: string;
  seniority: Seniority;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  dailyRateMin?: number;
  dailyRateMax?: number;
  certificationBonusPct?: number;
  source?: string;
}

export const seniorityLabels: Record<Seniority, string> = {
  junior: "Junior (0-3 anos)",
  mid: "Intermedio (3-5 anos)",
  senior: "Senior (5-7+ anos)",
  architect: "Arquitecto / Lead (8+ anos)",
};

export const seniorityYears: Record<Seniority, string> = {
  junior: "0-3",
  mid: "3-5",
  senior: "5-7+",
  architect: "8+",
};

// SPAIN - Based on provided benchmark data
const spainPermanent: SalaryEntry[] = [
  // FI/CO
  { country: "ES", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 22000, salaryMax: 28000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 60000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 55000, salaryMax: 70000, currency: "EUR", certificationBonusPct: 12 },
  { country: "ES", role: "consultant_fi_co", seniority: "architect", employmentType: "permanent", salaryMin: 60000, salaryMax: 80000, currency: "EUR", certificationBonusPct: 12 },
  // SD
  { country: "ES", role: "consultant_sd", seniority: "junior", employmentType: "permanent", salaryMin: 22000, salaryMax: 28000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "consultant_sd", seniority: "mid", employmentType: "permanent", salaryMin: 38000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "consultant_sd", seniority: "senior", employmentType: "permanent", salaryMin: 52000, salaryMax: 68000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "consultant_sd", seniority: "architect", employmentType: "permanent", salaryMin: 58000, salaryMax: 78000, currency: "EUR", certificationBonusPct: 12 },
  // MM
  { country: "ES", role: "consultant_mm", seniority: "junior", employmentType: "permanent", salaryMin: 22000, salaryMax: 27000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "consultant_mm", seniority: "mid", employmentType: "permanent", salaryMin: 38000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "consultant_mm", seniority: "senior", employmentType: "permanent", salaryMin: 50000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "consultant_mm", seniority: "architect", employmentType: "permanent", salaryMin: 58000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 12 },
  // PP
  { country: "ES", role: "consultant_pp", seniority: "junior", employmentType: "permanent", salaryMin: 22000, salaryMax: 27000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "consultant_pp", seniority: "mid", employmentType: "permanent", salaryMin: 38000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "consultant_pp", seniority: "senior", employmentType: "permanent", salaryMin: 50000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "consultant_pp", seniority: "architect", employmentType: "permanent", salaryMin: 55000, salaryMax: 72000, currency: "EUR", certificationBonusPct: 12 },
  // ABAP
  { country: "ES", role: "abap_developer", seniority: "junior", employmentType: "permanent", salaryMin: 24000, salaryMax: 30000, currency: "EUR", certificationBonusPct: 7 },
  { country: "ES", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 58000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 55000, salaryMax: 70000, currency: "EUR", certificationBonusPct: 12 },
  { country: "ES", role: "abap_developer", seniority: "architect", employmentType: "permanent", salaryMin: 62000, salaryMax: 85000, currency: "EUR", certificationBonusPct: 12 },
  // Basis
  { country: "ES", role: "basis_admin", seniority: "junior", employmentType: "permanent", salaryMin: 23000, salaryMax: 28000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "basis_admin", seniority: "mid", employmentType: "permanent", salaryMin: 38000, salaryMax: 52000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "basis_admin", seniority: "senior", employmentType: "permanent", salaryMin: 50000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "basis_admin", seniority: "architect", employmentType: "permanent", salaryMin: 55000, salaryMax: 72000, currency: "EUR", certificationBonusPct: 12 },
  // S/4HANA Cloud
  { country: "ES", role: "s4hana_cloud", seniority: "junior", employmentType: "permanent", salaryMin: 26000, salaryMax: 32000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "s4hana_cloud", seniority: "mid", employmentType: "permanent", salaryMin: 45000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 60000, salaryMax: 80000, currency: "EUR", certificationBonusPct: 12 },
  { country: "ES", role: "s4hana_cloud", seniority: "architect", employmentType: "permanent", salaryMin: 70000, salaryMax: 95000, currency: "EUR", certificationBonusPct: 12 },
  // S/4HANA Migration
  { country: "ES", role: "s4hana_migration", seniority: "mid", employmentType: "permanent", salaryMin: 45000, salaryMax: 62000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "s4hana_migration", seniority: "senior", employmentType: "permanent", salaryMin: 58000, salaryMax: 78000, currency: "EUR", certificationBonusPct: 12 },
  { country: "ES", role: "s4hana_migration", seniority: "architect", employmentType: "permanent", salaryMin: 68000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 12 },
  // EWM/TM
  { country: "ES", role: "ewm_tm", seniority: "mid", employmentType: "permanent", salaryMin: 42000, salaryMax: 58000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "ewm_tm", seniority: "senior", employmentType: "permanent", salaryMin: 55000, salaryMax: 72000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "ewm_tm", seniority: "architect", employmentType: "permanent", salaryMin: 62000, salaryMax: 82000, currency: "EUR", certificationBonusPct: 12 },
  // SuccessFactors
  { country: "ES", role: "successfactors", seniority: "junior", employmentType: "permanent", salaryMin: 24000, salaryMax: 30000, currency: "EUR", certificationBonusPct: 5 },
  { country: "ES", role: "successfactors", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 58000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "successfactors", seniority: "senior", employmentType: "permanent", salaryMin: 52000, salaryMax: 68000, currency: "EUR", certificationBonusPct: 10 },
  // BTP
  { country: "ES", role: "btp_developer", seniority: "mid", employmentType: "permanent", salaryMin: 42000, salaryMax: 60000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "btp_developer", seniority: "senior", employmentType: "permanent", salaryMin: 55000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 12 },
  // Integration
  { country: "ES", role: "integration", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 58000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "integration", seniority: "senior", employmentType: "permanent", salaryMin: 52000, salaryMax: 70000, currency: "EUR", certificationBonusPct: 10 },
  // PM
  { country: "ES", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 58000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "project_manager", seniority: "architect", employmentType: "permanent", salaryMin: 65000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 10 },
  // Solution Architect
  { country: "ES", role: "solution_architect", seniority: "senior", employmentType: "permanent", salaryMin: 60000, salaryMax: 80000, currency: "EUR", certificationBonusPct: 10 },
  { country: "ES", role: "solution_architect", seniority: "architect", employmentType: "permanent", salaryMin: 70000, salaryMax: 95000, currency: "EUR", certificationBonusPct: 12 },
  // Security/GRC
  { country: "ES", role: "security_grc", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 8 },
  { country: "ES", role: "security_grc", seniority: "senior", employmentType: "permanent", salaryMin: 50000, salaryMax: 68000, currency: "EUR", certificationBonusPct: 10 },
];

// Spain Freelance
const spainFreelance: SalaryEntry[] = [
  { country: "ES", role: "consultant_fi_co", seniority: "junior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 250, dailyRateMax: 400 },
  { country: "ES", role: "consultant_fi_co", seniority: "mid", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 400, dailyRateMax: 600 },
  { country: "ES", role: "consultant_fi_co", seniority: "senior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 600, dailyRateMax: 850 },
  { country: "ES", role: "abap_developer", seniority: "junior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 280, dailyRateMax: 420 },
  { country: "ES", role: "abap_developer", seniority: "mid", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 420, dailyRateMax: 650 },
  { country: "ES", role: "abap_developer", seniority: "senior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 650, dailyRateMax: 900 },
  { country: "ES", role: "s4hana_cloud", seniority: "mid", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 450, dailyRateMax: 700 },
  { country: "ES", role: "s4hana_cloud", seniority: "senior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 700, dailyRateMax: 1000 },
  { country: "ES", role: "ewm_tm", seniority: "senior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 500, dailyRateMax: 750 },
  { country: "ES", role: "project_manager", seniority: "senior", employmentType: "freelance", salaryMin: 0, salaryMax: 0, currency: "EUR", dailyRateMin: 600, dailyRateMax: 900 },
];

// GERMANY
const germanyPermanent: SalaryEntry[] = [
  { country: "DE", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 40000, salaryMax: 52000, currency: "EUR", certificationBonusPct: 8 },
  { country: "DE", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 58000, salaryMax: 78000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 75000, salaryMax: 95000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "consultant_fi_co", seniority: "architect", employmentType: "permanent", salaryMin: 90000, salaryMax: 120000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "abap_developer", seniority: "junior", employmentType: "permanent", salaryMin: 42000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 8 },
  { country: "DE", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 60000, salaryMax: 80000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 78000, salaryMax: 100000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "abap_developer", seniority: "architect", employmentType: "permanent", salaryMin: 95000, salaryMax: 130000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "s4hana_cloud", seniority: "mid", employmentType: "permanent", salaryMin: 65000, salaryMax: 85000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 85000, salaryMax: 110000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "s4hana_cloud", seniority: "architect", employmentType: "permanent", salaryMin: 100000, salaryMax: 140000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 80000, salaryMax: 105000, currency: "EUR", certificationBonusPct: 8 },
  { country: "DE", role: "solution_architect", seniority: "senior", employmentType: "permanent", salaryMin: 90000, salaryMax: 120000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "consultant_sd", seniority: "mid", employmentType: "permanent", salaryMin: 55000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "consultant_sd", seniority: "senior", employmentType: "permanent", salaryMin: 72000, salaryMax: 92000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "consultant_mm", seniority: "mid", employmentType: "permanent", salaryMin: 55000, salaryMax: 73000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "consultant_mm", seniority: "senior", employmentType: "permanent", salaryMin: 70000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 12 },
  { country: "DE", role: "basis_admin", seniority: "mid", employmentType: "permanent", salaryMin: 55000, salaryMax: 72000, currency: "EUR", certificationBonusPct: 8 },
  { country: "DE", role: "basis_admin", seniority: "senior", employmentType: "permanent", salaryMin: 70000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 10 },
  { country: "DE", role: "security_grc", seniority: "mid", employmentType: "permanent", salaryMin: 58000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 8 },
  { country: "DE", role: "security_grc", seniority: "senior", employmentType: "permanent", salaryMin: 72000, salaryMax: 95000, currency: "EUR", certificationBonusPct: 10 },
];

// SWITZERLAND
const switzerlandPermanent: SalaryEntry[] = [
  { country: "CH", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 75000, salaryMax: 95000, currency: "CHF", certificationBonusPct: 8 },
  { country: "CH", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 100000, salaryMax: 130000, currency: "CHF", certificationBonusPct: 10 },
  { country: "CH", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 125000, salaryMax: 160000, currency: "CHF", certificationBonusPct: 12 },
  { country: "CH", role: "consultant_fi_co", seniority: "architect", employmentType: "permanent", salaryMin: 150000, salaryMax: 200000, currency: "CHF", certificationBonusPct: 12 },
  { country: "CH", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 105000, salaryMax: 135000, currency: "CHF", certificationBonusPct: 10 },
  { country: "CH", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 130000, salaryMax: 170000, currency: "CHF", certificationBonusPct: 12 },
  { country: "CH", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 140000, salaryMax: 180000, currency: "CHF", certificationBonusPct: 12 },
  { country: "CH", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 130000, salaryMax: 170000, currency: "CHF", certificationBonusPct: 10 },
  { country: "CH", role: "solution_architect", seniority: "senior", employmentType: "permanent", salaryMin: 145000, salaryMax: 190000, currency: "CHF", certificationBonusPct: 12 },
];

// FRANCE
const francePermanent: SalaryEntry[] = [
  { country: "FR", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 32000, salaryMax: 40000, currency: "EUR", certificationBonusPct: 5 },
  { country: "FR", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 45000, salaryMax: 62000, currency: "EUR", certificationBonusPct: 8 },
  { country: "FR", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 60000, salaryMax: 80000, currency: "EUR", certificationBonusPct: 10 },
  { country: "FR", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 48000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 10 },
  { country: "FR", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 62000, salaryMax: 85000, currency: "EUR", certificationBonusPct: 12 },
  { country: "FR", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 68000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 12 },
  { country: "FR", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 65000, salaryMax: 85000, currency: "EUR", certificationBonusPct: 8 },
];

// PORTUGAL
const portugalPermanent: SalaryEntry[] = [
  { country: "PT", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 18000, salaryMax: 24000, currency: "EUR", certificationBonusPct: 5 },
  { country: "PT", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 30000, salaryMax: 45000, currency: "EUR", certificationBonusPct: 8 },
  { country: "PT", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 42000, salaryMax: 58000, currency: "EUR", certificationBonusPct: 10 },
  { country: "PT", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 32000, salaryMax: 48000, currency: "EUR", certificationBonusPct: 10 },
  { country: "PT", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 45000, salaryMax: 62000, currency: "EUR", certificationBonusPct: 12 },
  { country: "PT", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 48000, salaryMax: 65000, currency: "EUR", certificationBonusPct: 12 },
];

// BELGIUM
const belgiumPermanent: SalaryEntry[] = [
  { country: "BE", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 35000, salaryMax: 45000, currency: "EUR", certificationBonusPct: 5 },
  { country: "BE", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 50000, salaryMax: 68000, currency: "EUR", certificationBonusPct: 8 },
  { country: "BE", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 65000, salaryMax: 85000, currency: "EUR", certificationBonusPct: 10 },
  { country: "BE", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 52000, salaryMax: 70000, currency: "EUR", certificationBonusPct: 10 },
  { country: "BE", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 68000, salaryMax: 90000, currency: "EUR", certificationBonusPct: 12 },
  { country: "BE", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 72000, salaryMax: 95000, currency: "EUR", certificationBonusPct: 12 },
];

// ITALY
const italyPermanent: SalaryEntry[] = [
  { country: "IT", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 25000, salaryMax: 32000, currency: "EUR", certificationBonusPct: 5 },
  { country: "IT", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 38000, salaryMax: 52000, currency: "EUR", certificationBonusPct: 8 },
  { country: "IT", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 50000, salaryMax: 68000, currency: "EUR", certificationBonusPct: 10 },
  { country: "IT", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 40000, salaryMax: 55000, currency: "EUR", certificationBonusPct: 10 },
  { country: "IT", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 52000, salaryMax: 72000, currency: "EUR", certificationBonusPct: 12 },
  { country: "IT", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 58000, salaryMax: 78000, currency: "EUR", certificationBonusPct: 12 },
  { country: "IT", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 55000, salaryMax: 75000, currency: "EUR", certificationBonusPct: 8 },
];

// MEXICO
const mexicoPermanent: SalaryEntry[] = [
  { country: "MX", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 180000, salaryMax: 300000, currency: "MXN", certificationBonusPct: 8 },
  { country: "MX", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 420000, salaryMax: 660000, currency: "MXN", certificationBonusPct: 10 },
  { country: "MX", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 660000, salaryMax: 960000, currency: "MXN", certificationBonusPct: 12 },
  { country: "MX", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 450000, salaryMax: 720000, currency: "MXN", certificationBonusPct: 10 },
  { country: "MX", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 720000, salaryMax: 1080000, currency: "MXN", certificationBonusPct: 12 },
  { country: "MX", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 780000, salaryMax: 1200000, currency: "MXN", certificationBonusPct: 12 },
  { country: "MX", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 720000, salaryMax: 1020000, currency: "MXN", certificationBonusPct: 8 },
];

// COLOMBIA
const colombiaPermanent: SalaryEntry[] = [
  { country: "CO", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 24000000, salaryMax: 42000000, currency: "COP", certificationBonusPct: 8 },
  { country: "CO", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 54000000, salaryMax: 84000000, currency: "COP", certificationBonusPct: 10 },
  { country: "CO", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 84000000, salaryMax: 132000000, currency: "COP", certificationBonusPct: 12 },
  { country: "CO", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 60000000, salaryMax: 96000000, currency: "COP", certificationBonusPct: 10 },
  { country: "CO", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 96000000, salaryMax: 144000000, currency: "COP", certificationBonusPct: 12 },
  { country: "CO", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 108000000, salaryMax: 168000000, currency: "COP", certificationBonusPct: 12 },
];

// CHILE
const chilePermanent: SalaryEntry[] = [
  { country: "CL", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 9600000, salaryMax: 15600000, currency: "CLP", certificationBonusPct: 8 },
  { country: "CL", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 19200000, salaryMax: 31200000, currency: "CLP", certificationBonusPct: 10 },
  { country: "CL", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 31200000, salaryMax: 48000000, currency: "CLP", certificationBonusPct: 12 },
  { country: "CL", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 21600000, salaryMax: 33600000, currency: "CLP", certificationBonusPct: 10 },
  { country: "CL", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 33600000, salaryMax: 52800000, currency: "CLP", certificationBonusPct: 12 },
  { country: "CL", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 36000000, salaryMax: 57600000, currency: "CLP", certificationBonusPct: 12 },
];

// ARGENTINA (USD-indexed)
const argentinaPermanent: SalaryEntry[] = [
  { country: "AR", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 12000, salaryMax: 18000, currency: "USD", certificationBonusPct: 8 },
  { country: "AR", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 24000, salaryMax: 42000, currency: "USD", certificationBonusPct: 10 },
  { country: "AR", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 42000, salaryMax: 60000, currency: "USD", certificationBonusPct: 12 },
  { country: "AR", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 28000, salaryMax: 45000, currency: "USD", certificationBonusPct: 10 },
  { country: "AR", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 45000, salaryMax: 65000, currency: "USD", certificationBonusPct: 12 },
  { country: "AR", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 48000, salaryMax: 72000, currency: "USD", certificationBonusPct: 12 },
];

// BRAZIL
const brazilPermanent: SalaryEntry[] = [
  { country: "BR", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 48000, salaryMax: 72000, currency: "BRL", certificationBonusPct: 8 },
  { country: "BR", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 96000, salaryMax: 156000, currency: "BRL", certificationBonusPct: 10 },
  { country: "BR", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 156000, salaryMax: 240000, currency: "BRL", certificationBonusPct: 12 },
  { country: "BR", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 108000, salaryMax: 168000, currency: "BRL", certificationBonusPct: 10 },
  { country: "BR", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 168000, salaryMax: 264000, currency: "BRL", certificationBonusPct: 12 },
  { country: "BR", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 192000, salaryMax: 312000, currency: "BRL", certificationBonusPct: 12 },
];

// PERU
const peruPermanent: SalaryEntry[] = [
  { country: "PE", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 30000, salaryMax: 48000, currency: "PEN", certificationBonusPct: 8 },
  { country: "PE", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 60000, salaryMax: 96000, currency: "PEN", certificationBonusPct: 10 },
  { country: "PE", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 96000, salaryMax: 156000, currency: "PEN", certificationBonusPct: 12 },
  { country: "PE", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 66000, salaryMax: 108000, currency: "PEN", certificationBonusPct: 10 },
  { country: "PE", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 108000, salaryMax: 168000, currency: "PEN", certificationBonusPct: 12 },
];

// USA
const usaPermanent: SalaryEntry[] = [
  { country: "US", role: "consultant_fi_co", seniority: "junior", employmentType: "permanent", salaryMin: 65000, salaryMax: 85000, currency: "USD", certificationBonusPct: 8 },
  { country: "US", role: "consultant_fi_co", seniority: "mid", employmentType: "permanent", salaryMin: 95000, salaryMax: 130000, currency: "USD", certificationBonusPct: 10 },
  { country: "US", role: "consultant_fi_co", seniority: "senior", employmentType: "permanent", salaryMin: 130000, salaryMax: 175000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "consultant_fi_co", seniority: "architect", employmentType: "permanent", salaryMin: 160000, salaryMax: 220000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "abap_developer", seniority: "mid", employmentType: "permanent", salaryMin: 100000, salaryMax: 135000, currency: "USD", certificationBonusPct: 10 },
  { country: "US", role: "abap_developer", seniority: "senior", employmentType: "permanent", salaryMin: 135000, salaryMax: 185000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "abap_developer", seniority: "architect", employmentType: "permanent", salaryMin: 170000, salaryMax: 240000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "s4hana_cloud", seniority: "mid", employmentType: "permanent", salaryMin: 110000, salaryMax: 145000, currency: "USD", certificationBonusPct: 10 },
  { country: "US", role: "s4hana_cloud", seniority: "senior", employmentType: "permanent", salaryMin: 145000, salaryMax: 200000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "s4hana_cloud", seniority: "architect", employmentType: "permanent", salaryMin: 180000, salaryMax: 260000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "project_manager", seniority: "senior", employmentType: "permanent", salaryMin: 130000, salaryMax: 180000, currency: "USD", certificationBonusPct: 8 },
  { country: "US", role: "solution_architect", seniority: "senior", employmentType: "permanent", salaryMin: 155000, salaryMax: 220000, currency: "USD", certificationBonusPct: 10 },
  { country: "US", role: "consultant_sd", seniority: "mid", employmentType: "permanent", salaryMin: 90000, salaryMax: 125000, currency: "USD", certificationBonusPct: 10 },
  { country: "US", role: "consultant_sd", seniority: "senior", employmentType: "permanent", salaryMin: 125000, salaryMax: 170000, currency: "USD", certificationBonusPct: 12 },
  { country: "US", role: "security_grc", seniority: "senior", employmentType: "permanent", salaryMin: 120000, salaryMax: 165000, currency: "USD", certificationBonusPct: 10 },
];

// Combine all data
export const allSalaryData: SalaryEntry[] = [
  ...spainPermanent,
  ...spainFreelance,
  ...germanyPermanent,
  ...switzerlandPermanent,
  ...francePermanent,
  ...portugalPermanent,
  ...belgiumPermanent,
  ...italyPermanent,
  ...mexicoPermanent,
  ...colombiaPermanent,
  ...chilePermanent,
  ...argentinaPermanent,
  ...brazilPermanent,
  ...peruPermanent,
  ...usaPermanent,
];

// Filter helpers
export function filterSalaries(params: {
  country?: string;
  role?: string;
  seniority?: Seniority;
  employmentType?: EmploymentType;
}): SalaryEntry[] {
  return allSalaryData.filter((entry) => {
    if (params.country && entry.country !== params.country) return false;
    if (params.role && entry.role !== params.role) return false;
    if (params.seniority && entry.seniority !== params.seniority) return false;
    if (params.employmentType && entry.employmentType !== params.employmentType)
      return false;
    return true;
  });
}

export function getAvgSalary(entries: SalaryEntry[]): number {
  if (entries.length === 0) return 0;
  const sum = entries.reduce(
    (acc, e) => acc + (e.salaryMin + e.salaryMax) / 2,
    0
  );
  return Math.round(sum / entries.length);
}

export function getUniqueRoles(): string[] {
  return [...new Set(allSalaryData.map((e) => e.role))];
}

export function getCountriesWithData(): string[] {
  return [...new Set(allSalaryData.map((e) => e.country))];
}
