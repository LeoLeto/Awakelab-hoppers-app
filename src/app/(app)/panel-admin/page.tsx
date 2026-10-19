"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Search, Mail, X, Download } from "lucide-react";
import { getProfileBySlug, getRoleLabel } from "@/lib/data/sapProfiles";

interface StudentRow {
  _id: string;
  name: string;
  email: string;
  country: string;
  emailVerified: boolean;
  diagnosticDone: boolean;
  empScore?: number;
  createdAt: string;
  isAdmin?: boolean;
  advisoryRequested?: boolean;
  advisoryDate?: string;
  currentRole?: string;
  topProfile?: string;
}

interface StudentDetail {
  name: string;
  email: string;
  country: string;
  emailVerified: boolean;
  createdAt: string;
  currentRole?: string;
  targetRole?: string;
  yearsExperience?: string;
  sapModules?: string[];
  certifications?: string;
  targetCertifications?: string;
  salary?: string;
  linkedin?: string;
  diagnosticDone: boolean;
  diagnosticDate?: string;
  empScore?: number;
  topProfile?: string;
  skills?: string[];
  advisoryRequested?: boolean;
  advisoryDate?: string;
}

function DetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(d => setDetail(d.user ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex items-center justify-center p-4 bg-black/85" onClick={onClose} style={{zIndex:9999, position:"fixed", top:0, left:0, right:0, bottom:0, width:"100vw", height:"100vh", backdropFilter:"blur(2px)"}}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-black text-hopper-black">Detalles del alumno</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-hopper-red" />
          </div>
        ) : !detail ? (
          <p className="text-center text-gray-400 py-16">No se encontraron datos.</p>
        ) : (
          <div className="p-6 space-y-6">

            {/* Personal */}
            <Section title="Datos personales">
              <Row label="Nombre" value={detail.name} />
              <Row label="Email" value={detail.email} />
              <Row label="País" value={detail.country || "—"} />
              <Row label="Registro" value={new Date(detail.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })} />
              <Row label="Email verificado" value={detail.emailVerified ? "Sí" : "No"} highlight={!detail.emailVerified ? "warn" : "ok"} />
            </Section>

            {/* Diagnóstico — formulario */}
            <Section title="Formulario de diagnóstico">
              <Row label="Años de experiencia SAP" value={detail.yearsExperience || "—"} />
              <Row label="Rol actual" value={getRoleLabel(detail.currentRole) || "—"} />
              <Row label="Rol objetivo" value={getRoleLabel(detail.targetRole) || "—"} />
              <Row label="Salario actual" value={detail.salary || "—"} />
              <Row label="LinkedIn" value={detail.linkedin || "—"} />
              <Row label="Módulos SAP" value={detail.sapModules?.length ? detail.sapModules.join(", ") : "—"} />
              <Row label="Certificaciones obtenidas" value={detail.certifications || "—"} />
              <Row label="Certificaciones deseadas" value={detail.targetCertifications || "—"} />
            </Section>

            {/* Resultados */}
            <Section title="Resultado del diagnóstico">
              {detail.diagnosticDone ? (
                <>
                  <Row label="Fecha diagnóstico" value={detail.diagnosticDate ? new Date(detail.diagnosticDate).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
                  <Row label="Puntuación empleabilidad" value={detail.empScore !== undefined ? `${detail.empScore}%` : "—"} />
                  <Row label="Perfil top" value={detail.topProfile ? getProfileBySlug(detail.topProfile)?.name ?? detail.topProfile : "—"} />
                  <Row label="Skills identificadas" value={detail.skills?.length ? detail.skills.join(", ") : "—"} />
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Diagnóstico no completado.</p>
              )}
            </Section>

            {/* Asesoría */}
            <Section title="Asesoría">
              <Row
                label="Estado"
                value={detail.advisoryRequested ? "Solicitada" : "No solicitada"}
                highlight={detail.advisoryRequested ? "ok" : undefined}
              />
              {detail.advisoryRequested && detail.advisoryDate && (
                <Row label="Fecha solicitud" value={new Date(detail.advisoryDate).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })} />
              )}
            </Section>

          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{title}</h3>
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: "ok" | "warn" }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <span className="text-xs text-gray-500 shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm font-medium text-right break-all ${highlight === "ok" ? "text-green-700" : highlight === "warn" ? "text-amber-600" : "text-hopper-black"}`}>
        {value}
      </span>
    </div>
  );
}

export default function PanelAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterAdvisory, setFilterAdvisory] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }

    fetch("/api/admin/check")
      .then(r => r.json())
      .then(data => {
        if (!data.isAdmin) { router.replace("/dashboard"); return; }
        return fetch("/api/admin/users");
      })
      .then(r => r?.json())
      .then(data => { if (data?.users) setStudents(data.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = students.filter(u => {
    if (filterAdvisory && !u.advisoryRequested) return false;
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const totalDiagnostic = students.filter(u => u.diagnosticDone).length;
  const totalAdvisory = students.filter(u => u.advisoryRequested).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-hopper-red" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {detailId && <DetailModal id={detailId} onClose={() => setDetailId(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-hopper-black">Alumnos</h1>
          <p className="text-sm text-gray-500 mt-1">Seguimiento y detalle de todos los alumnos registrados.</p>
        </div>
        {/* Enlace directo (no fetch): el navegador envía la cookie de sesión y descarga el .xlsx.
            El permiso de admin se comprueba en /api/admin/export. */}
        <a
          href="/api/admin/export"
          download
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hopper-black text-white text-sm font-medium hover:bg-hopper-black/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar a Excel
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Alumnos totales", value: students.length },
          { label: "Email verificado", value: students.filter(u => u.emailVerified).length },
          { label: "Diagnóstico completado", value: totalDiagnostic },
          { label: "Asesoría solicitada", value: totalAdvisory },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="text-3xl font-black text-hopper-black">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30"
            />
          </div>
          <button
            onClick={() => setFilterAdvisory(v => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${filterAdvisory ? "bg-hopper-red text-white border-hopper-red" : "bg-white text-gray-600 border-gray-200 hover:border-hopper-red/40"}`}
          >
            <Mail className="w-4 h-4" />
            {filterAdvisory ? "Mostrando: asesoría solicitada" : "Filtrar: asesoría solicitada"}
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Alumno</th>
                <th className="px-4 py-3 font-medium">País</th>
                <th className="px-4 py-3 font-medium">Rol actual</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Diagnóstico</th>
                <th className="px-4 py-3 font-medium">Asesoría</th>
                <th className="px-4 py-3 font-medium">Registro</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                    {filterAdvisory ? "Ningún alumno ha solicitado asesoría." : "No se encontraron alumnos."}
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-hopper-black">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.country || "—"}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{getRoleLabel(u.currentRole) || "—"}</td>
                  <td className="px-4 py-3">
                    {u.emailVerified
                      ? <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs"><CheckCircle className="w-3 h-3" />Verificado</span>
                      : <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs"><XCircle className="w-3 h-3" />Pendiente</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {u.diagnosticDone
                      ? <span className="text-xs font-semibold text-hopper-black">{u.empScore ?? "—"}%</span>
                      : <span className="text-xs text-gray-400">Pendiente</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {u.advisoryRequested
                      ? <span className="inline-flex items-center gap-1 text-hopper-red bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs font-medium"><Mail className="w-3 h-3" />Solicitada</span>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetailId(u._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-hopper-red hover:text-white text-gray-600 transition-colors whitespace-nowrap"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
