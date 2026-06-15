import { allSalaryData } from "@/lib/data/salaryData";
import { sapProfiles } from "@/lib/data/sapProfiles";
import { formatSalaryRange, formatNumber } from "@/lib/utils/formatters";
import type { DiagnosticResult } from "@/lib/diagnostic";

const seniorityLabels: Record<string, string> = {
  junior: "Junior (0-3 anos)",
  mid: "Intermedio (3-5 anos)",
  senior: "Senior (5-7+ anos)",
  architect: "Arquitecto / Lead (8+ anos)",
};

const courses = [
  "Curso intensivo (40h)",
  "Taller practico (24h)",
  "Certificacion oficial (80h)",
  "Workshop avanzado (16h)",
  "Masterclass (8h)",
];

async function getJsPDF() {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  return { jsPDF, autoTable };
}

const RED: [number, number, number] = [255, 24, 0];
const BLACK: [number, number, number] = [0, 10, 26];
const WHITE: [number, number, number] = [255, 255, 255];
const BEIGE: [number, number, number] = [221, 201, 179];
const GREY: [number, number, number] = [150, 150, 150];

function addHeader(doc: InstanceType<typeof import("jspdf")["default"]>, subtitle: string) {
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, 210, 45, "F");
  doc.setFillColor(...RED);
  doc.rect(15, 12, 8, 8, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("H", 17.8, 18.5);
  doc.setFontSize(18);
  doc.text("HOPPERS", 27, 19);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(subtitle, 15, 30);
  doc.setFontSize(8);
  doc.text("www.hoppers.academy | Partner oficial SAP para Europa y LATAM", 15, 36);
}

function addPageFooters(doc: InstanceType<typeof import("jspdf")["default"]>) {
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text(
      `Hoppers Academy | www.hoppers.academy | Datos Abril 2026`,
      15,
      290
    );
    doc.text(`Pagina ${i}/${pageCount}`, 185, 290);
  }
}

export async function downloadDiagnosticPDF(
  result: DiagnosticResult,
  userName?: string,
  userEmail?: string,
  userCountry?: string
) {
  const { jsPDF, autoTable } = await getJsPDF();
  const doc = new jsPDF("p", "mm", "a4");
  const M = 15;
  const CW = 210 - 2 * M;
  let y = M;

  addHeader(doc, `Diagnostico Profesional SAP | ${new Date().toLocaleDateString("es-ES")}`);
  y = 55;

  doc.setTextColor(...BLACK);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Informe de Diagnostico Profesional", M, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  if (userName) { doc.text(`Candidato: ${userName}`, M, y); y += 5; }
  if (userEmail) { doc.text(`Email: ${userEmail}`, M, y); y += 5; }
  if (userCountry) { doc.text(`Pais: ${userCountry}`, M, y); y += 5; }
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}`, M, y);
  y += 10;

  doc.setFillColor(...RED);
  doc.roundedRect(M, y, CW, 22, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.empScore}%`, M + 8, y + 15);
  doc.setFontSize(11);
  doc.text("Indice de Empleabilidad SAP", M + 35, y + 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(result.empDesc, M + 35, y + 17);
  y += 30;

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Habilidades Detectadas", M, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const skillText = result.skills.length > 0 ? result.skills.join(" | ") : "No se detectaron habilidades especificas";
  const skillLines = doc.splitTextToSize(skillText, CW);
  doc.text(skillLines, M, y);
  y += skillLines.length * 4.5 + 6;

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Perfiles SAP Compatibles", M, y);
  y += 3;

  const tableData = result.matches.map((m, i) => [
    `#${i + 1}`,
    m.name,
    `${m.matchPct}%`,
    m.demandLevel === "critical" ? "Critica" : m.demandLevel === "high" ? "Alta" : "Media",
    m.salaryES || "N/D",
    m.salaryDE || "N/D",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["#", "Perfil", "Match", "Demanda", "Salario ES", "Salario DE"]],
    body: tableData,
    margin: { left: M, right: M },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: BLACK, textColor: WHITE, fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 243, 238] },
    columnStyles: { 0: { cellWidth: 8 }, 2: { cellWidth: 15, halign: "center" }, 3: { cellWidth: 18 } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  if (y > 240) { doc.addPage(); y = M; }

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Expectativa Salarial Estimada", M, y);
  y += 3;

  const salTableData = result.salaryExpectations
    .filter((s) => s.salary !== "N/D")
    .map((s) => [s.flag + " " + s.country, s.salary, s.label]);

  autoTable(doc, {
    startY: y,
    head: [["Pais", "Rango Salarial", "Nivel"]],
    body: salTableData,
    margin: { left: M, right: M },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: RED, textColor: WHITE, fontSize: 8 },
    alternateRowStyles: { fillColor: [255, 245, 243] },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  if (y > 240) { doc.addPage(); y = M; }

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Certificaciones Recomendadas", M, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  result.recommendedCerts.forEach((c) => {
    const lines = doc.splitTextToSize(`> ${c}`, CW);
    doc.text(lines, M, y);
    y += lines.length * 4.5 + 2;
  });
  y += 4;

  if (y > 250) { doc.addPage(); y = M; }

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Plan de Accion - Ruta Formativa Hoppers Academy", M, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const gapList = result.trainingGaps.length > 0 ? result.trainingGaps.slice(0, 6) : ["S/4HANA Cloud Fundamentals"];
  gapList.forEach((g, i) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLACK);
    doc.text(`${i + 1}. ${g}`, M, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`   ${courses[i % 5]} - Hoppers Academy`, M, y);
    y += 5.5;
  });
  y += 6;

  if (y > 260) { doc.addPage(); y = M; }

  doc.setFillColor(...BEIGE);
  doc.roundedRect(M, y, CW, 28, 3, 3, "F");
  doc.setTextColor(...BLACK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Siguiente paso: Habla con un asesor de Hoppers Academy", M + 6, y + 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Agenda una sesion gratuita en hoppers.academy para disenar tu plan formativo personalizado.", M + 6, y + 17);
  doc.text("Email: info@hoppers.academy | Web: www.hoppers.academy", M + 6, y + 23);

  addPageFooters(doc);

  const fileName = `Hoppers_Diagnostico_SAP_${(userName || "Usuario").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

export async function downloadMarketReportPDF() {
  const { jsPDF, autoTable } = await getJsPDF();
  const doc = new jsPDF("p", "mm", "a4");
  const M = 15;
  const CW = 210 - 2 * M;
  let y = M;

  addHeader(doc, "Informe de Mercado SAP - Abril 2026");
  y = 55;

  doc.setTextColor(...BLACK);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Panorama del Mercado Laboral SAP", M, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  const intro =
    "El ecosistema SAP atraviesa una transformacion sin precedentes impulsada por la migracion obligatoria a S/4HANA (fecha limite 2027/2030). Este informe presenta los perfiles mas demandados, rangos salariales por pais y nivel, y las tendencias clave del mercado laboral para profesionales SAP.";
  const introLines = doc.splitTextToSize(intro, CW);
  doc.text(introLines, M, y);
  y += introLines.length * 4.5 + 8;

  const totalP = sapProfiles.reduce((a, p) => a + p.avgJobPostings, 0);
  doc.setFillColor(245, 243, 238);
  doc.roundedRect(M, y, CW, 16, 3, 3, "F");
  doc.setTextColor(...RED);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`${formatNumber(totalP)}+ ofertas activas`, M + 6, y + 7);
  doc.text("15 perfiles analizados", M + 70, y + 7);
  doc.text("14 paises", M + 140, y + 7);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Datos estimados Q2 2026", M + 6, y + 12);
  y += 22;

  doc.setTextColor(...BLACK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ranking de Perfiles SAP por Demanda", M, y);
  y += 3;

  const profTableData = [...sapProfiles]
    .sort((a, b) => b.avgJobPostings - a.avgJobPostings)
    .map((p, i) => [
      `#${i + 1}`,
      p.name,
      p.module,
      p.demandLevel === "critical" ? "Critica" : p.demandLevel === "high" ? "Alta" : "Media",
      p.trendDirection === "up" ? "En alza" : p.trendDirection === "down" ? "En baja" : "Estable",
      `~${p.avgJobPostings}`,
    ]);

  autoTable(doc, {
    startY: y,
    head: [["#", "Perfil", "Modulo", "Demanda", "Tendencia", "Ofertas"]],
    body: profTableData,
    margin: { left: M, right: M },
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: BLACK, textColor: WHITE, fontSize: 7.5 },
    alternateRowStyles: { fillColor: [245, 243, 238] },
    columnStyles: { 0: { cellWidth: 8 }, 3: { cellWidth: 17 }, 4: { cellWidth: 17 }, 5: { cellWidth: 15 } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  const countryGroups = [
    { region: "Europa", codes: ["ES", "DE", "CH", "FR", "PT", "BE", "IT"] },
    { region: "Latinoamerica y USA", codes: ["MX", "CO", "CL", "AR", "BR", "PE", "US"] },
  ];

  const countryNames: Record<string, string> = {
    ES: "🇪🇸 España", DE: "🇩🇪 Alemania", CH: "🇨🇭 Suiza", FR: "🇫🇷 Francia",
    PT: "🇵🇹 Portugal", BE: "🇧🇪 Bélgica", IT: "🇮🇹 Italia",
    MX: "🇲🇽 Mexico", CO: "🇨🇴 Colombia", CL: "🇨🇱 Chile",
    AR: "🇦🇷 Argentina", BR: "🇧🇷 Brasil", PE: "🇵🇪 Peru", US: "🇺🇸 USA",
  };

  doc.addPage();
  y = M;
  doc.setTextColor(...BLACK);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Salarios SAP por Pais y Perfil", M, y);
  y += 6;

  for (const grp of countryGroups) {
    if (y > 240) { doc.addPage(); y = M; }
    doc.setTextColor(...BLACK);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(grp.region, M, y);
    y += 3;

    for (const code of grp.codes) {
      const cData = allSalaryData.filter((e) => e.country === code && e.employmentType === "permanent");
      if (cData.length === 0) continue;
      if (y > 250) { doc.addPage(); y = M; }
      const rows = cData.map((e) => [
        sapProfiles.find((p) => p.slug === e.role)?.name || e.role,
        seniorityLabels[e.seniority] || e.seniority,
        formatSalaryRange(e.salaryMin, e.salaryMax, e.currency),
        e.certificationBonusPct ? `+${e.certificationBonusPct}%` : "-",
      ]);
      autoTable(doc, {
        startY: y,
        head: [[`${countryNames[code] || code} (${cData[0].currency})`, "Nivel", "Rango Salarial", "Bonus Cert."]],
        body: rows,
        margin: { left: M, right: M },
        styles: { fontSize: 7, cellPadding: 1.8 },
        headStyles: { fillColor: RED, textColor: WHITE, fontSize: 7.5 },
        alternateRowStyles: { fillColor: [255, 245, 243] },
        columnStyles: { 2: { cellWidth: 45 }, 3: { cellWidth: 20, halign: "center" } },
      });
      y = (doc as any).lastAutoTable.finalY + 6;
    }
    y += 4;
  }

  addPageFooters(doc);
  doc.save("Hoppers_Informe_Mercado_SAP_Abril_2026.pdf");
}

export async function downloadProfileInfographicPDF(slug: string) {
  const profile = sapProfiles.find((p) => p.slug === slug);
  if (!profile) return;

  const { jsPDF } = await getJsPDF();
  const doc = new jsPDF("p", "mm", "a4");
  const M = 15;
  const CW = 210 - 2 * M;
  let y = M;

  doc.setFillColor(...BLACK);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFillColor(...RED);
  doc.rect(M, M, 7, 7, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("H", M + 2.2, M + 5.5);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("HOPPERS ACADEMY | Infografia de Perfil SAP", M + 10, M + 5);
  y = M + 15;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text(profile.name, M, y);
  y += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const descLines = doc.splitTextToSize(`${profile.module} | ${profile.description}`, CW);
  doc.text(descLines.slice(0, 2), M, y);
  y += descLines.slice(0, 2).length * 4 + 4;

  doc.setFillColor(...RED);
  doc.roundedRect(M, y, 35, 6, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  const demandLabel = profile.demandLevel === "critical" ? "Critica" : profile.demandLevel === "high" ? "Alta" : "Media";
  doc.text(`Demanda ${demandLabel}`, M + 3, y + 4.3);
  doc.setTextColor(200, 200, 200);
  doc.setFont("helvetica", "normal");
  doc.text(`${profile.trendDirection === "up" ? "En alza" : "Estable"} | ~${profile.avgJobPostings} ofertas`, M + 40, y + 4.3);
  y += 14;

  const stats = [
    { v: `${profile.avgJobPostings}+`, l: "Ofertas" },
    { v: `${profile.careerPath.length}`, l: "Niveles" },
    { v: `${profile.requiredSkills.length}`, l: "Skills" },
    { v: `${profile.certifications.length}`, l: "Certs" },
  ];
  const bw = (CW - 9) / 4;
  stats.forEach((s, i) => {
    const bx = M + i * (bw + 3);
    doc.setFillColor(20, 20, 40);
    doc.roundedRect(bx, y, bw, 18, 2, 2, "F");
    doc.setDrawColor(50, 50, 70);
    doc.roundedRect(bx, y, bw, 18, 2, 2, "S");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text(s.v, bx + bw / 2, y + 9, { align: "center" });
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(s.l, bx + bw / 2, y + 14.5, { align: "center" });
  });
  y += 26;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Salarios Senior por pais", M, y);
  y += 6;
  const salCountries = ["ES", "DE", "CH", "US", "MX", "BR"];
  const flagMap: Record<string, string> = { ES: "España", DE: "Alemania", CH: "Suiza", US: "USA", MX: "Mexico", BR: "Brasil" };
  salCountries.forEach((code) => {
    const s = allSalaryData.find(
      (e) => e.role === slug && e.country === code && e.seniority === "senior" && e.employmentType === "permanent"
    );
    if (!s) return;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text(flagMap[code] || code, M, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...WHITE);
    doc.text(formatSalaryRange(s.salaryMin, s.salaryMax, s.currency), M + 35, y);
    y += 5;
  });
  y += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Ruta profesional", M, y);
  y += 6;
  profile.careerPath.forEach((step, i) => {
    const px = M + i * 42;
    if (i === profile.careerPath.length - 1) { doc.setFillColor(...RED); } else { doc.setFillColor(40, 40, 60); }
    doc.roundedRect(px, y, 38, 7, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text(step, px + 19, y + 5, { align: "center" });
  });
  y += 14;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Skills requeridos", M, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  const skillLine = profile.requiredSkills.join(" | ");
  const slines = doc.splitTextToSize(skillLine, CW);
  doc.text(slines, M, y);
  y += slines.length * 4 + 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Certificaciones recomendadas", M, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  profile.certifications.forEach((c) => { doc.text(`> ${c}`, M, y); y += 5; });
  y += 8;

  doc.setDrawColor(50, 50, 70);
  doc.line(M, y, 210 - M, y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Hoppers Academy | www.hoppers.academy | Datos Abril 2026 | Better. Smarter. Hoppers.", M, y);

  doc.save(`Hoppers_Infografia_${profile.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}
