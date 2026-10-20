"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle, Loader2, Eye, EyeOff, Users, Trash2, Search, X } from "lucide-react";
import { ROLES, ROLE_LABELS, type Role } from "@/lib/roles";

// Color del selector según el rol, para distinguir de un vistazo quién cuenta como alumno.
const ROLE_STYLES: Record<Role, string> = {
  student: "bg-white text-gray-700 border-gray-200",
  staff: "bg-sky-50 text-sky-800 border-sky-200",
  admin: "bg-hopper-black text-white border-hopper-black",
  test: "bg-amber-50 text-amber-800 border-amber-300",
};

interface SmtpSettings {
  smtpFrom: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassSet: boolean;
  smtpSecure: boolean;
  adminEmails: string[];
}

interface UserRow {
  _id: string;
  name: string;
  email: string;
  country: string;
  emailVerified: boolean;
  diagnosticDone: boolean;
  empScore?: number;
  createdAt: string;
  isAdmin?: boolean;
  role?: Role;
}

export default function ConfiguracionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "ok" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [smtpFrom, setSmtpFrom] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpPassSet, setSmtpPassSet] = useState(false);
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [adminEmailInput, setAdminEmailInput] = useState("");
  const [adminEmailsSaving, setAdminEmailsSaving] = useState(false);
  const [adminEmailsStatus, setAdminEmailsStatus] = useState<"idle" | "ok" | "error">("idle");

  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserRow | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session?.isSuperAdmin) {
      router.replace("/dashboard");
      return;
    }
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: SmtpSettings) => {
        setSmtpFrom(data.smtpFrom || "");
        setSmtpHost(data.smtpHost || "");
        setSmtpPort(String(data.smtpPort || 587));
        setSmtpUser(data.smtpUser || "");
        setSmtpPassSet(data.smtpPassSet || false);
        setSmtpSecure(data.smtpSecure || false);
        setAdminEmails(data.adminEmails || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // all=1: todas las cuentas (también admins y pruebas) para poder gestionarlas
    fetch("/api/admin/users?all=1")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [router]);

  async function handleSaveAdminEmails() {
    setAdminEmailsSaving(true);
    setAdminEmailsStatus("idle");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smtpFrom, smtpHost, smtpPort: Number(smtpPort), smtpUser, smtpSecure, adminEmails }),
      });
      setAdminEmailsStatus(res.ok ? "ok" : "error");
      setTimeout(() => setAdminEmailsStatus("idle"), 3000);
    } catch {
      setAdminEmailsStatus("error");
    } finally {
      setAdminEmailsSaving(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smtpFrom, smtpHost, smtpPort: Number(smtpPort), smtpUser, smtpPass: smtpPass || undefined, smtpSecure, adminEmails }),
      });
      if (res.ok) {
        setSaveStatus("ok");
        if (smtpPass) setSmtpPassSet(true);
        setSmtpPass("");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleTestSmtp() {
    setTesting(true);
    setTestStatus("idle");
    setTestMessage("");
    try {
      const res = await fetch("/api/settings/test-smtp", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setTestStatus("ok");
        setTestMessage("Conexión establecida correctamente.");
      } else {
        setTestStatus("error");
        setTestMessage(json.error || "Error al conectar.");
      }
    } catch {
      setTestStatus("error");
      setTestMessage("Error de red al verificar la conexión.");
    } finally {
      setTesting(false);
      setTimeout(() => { setTestStatus("idle"); setTestMessage(""); }, 8000);
    }
  }

  // Cambia el rol de un usuario (ver src/lib/roles.ts). Solo "Alumno" cuenta en el panel
  // Alumnos, sus cifras y el Excel; "Admin" además da acceso a ese panel.
  // Si el servidor rechaza el cambio, se vuelve al rol anterior.
  async function handleRoleChange(user: UserRow, role: Role) {
    const previous = user.role;
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role, isAdmin: role === "admin" } : u));
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user._id, role }),
    }).catch(() => null);
    if (!res?.ok) {
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: previous, isAdmin: previous === "admin" } : u));
    }
  }

  async function handleDelete(user: UserRow) {
    setDeletingId(user._id);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id }),
      });
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-hopper-red" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-hopper-black">Configuraciones del sitio</h1>
        <p className="text-sm text-gray-500 mt-1">Acceso restringido a superadministrador.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-hopper-black px-6 py-4 flex items-center gap-3">
          <Mail className="w-5 h-5 text-hopper-red shrink-0" />
          <div>
            <h2 className="text-base font-bold text-white">Configuración de correo SMTP</h2>
            <p className="text-xs text-white/50 mt-0.5">Gestiona el servidor SMTP para los correos automáticos.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-hopper-black">Remitente</label>
            <input
              type="text"
              value={smtpFrom}
              onChange={(e) => setSmtpFrom(e.target.value)}
              placeholder="Hoppers Academy <noreply@hoppers.academy>"
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
            />
            <p className="text-xs text-gray-400">Nombre y email que verá el destinatario. Ej: Hoppers Academy &lt;noreply@hoppers.academy&gt;</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-hopper-black">Servidor SMTP</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.office365.com"
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-hopper-black">Puerto</label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587"
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-hopper-black">Usuario SMTP</label>
            <input
              type="text"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              placeholder="pedidos@awakelab.world"
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-hopper-black">Contraseña SMTP</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder={smtpPassSet ? "Contraseña guardada (escribe para cambiarla)" : "Introduce la contraseña SMTP"}
                className="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {smtpPassSet && !smtpPass && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Contraseña configurada
              </p>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={smtpSecure}
              onChange={(e) => setSmtpSecure(e.target.checked)}
              className="w-4 h-4 accent-hopper-red"
            />
            <span className="text-sm font-medium text-hopper-black">Usar SSL/TLS</span>
            <span className="text-xs text-gray-400">(activa solo si el puerto es 465)</span>
          </label>

          {testStatus !== "idle" && (
            <div className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm ${testStatus === "ok" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
              {testStatus === "ok"
                ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{testMessage}</span>
            </div>
          )}

          {saveStatus === "ok" && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Configuración guardada correctamente.
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <XCircle className="w-4 h-4 shrink-0" />
              Error al guardar. Inténtalo de nuevo.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              disabled={saving}
              className="bg-hopper-black hover:bg-hopper-black/90 text-white disabled:opacity-60"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar configuración"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={testing}
              onClick={handleTestSmtp}
            >
              {testing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</> : "Verificar conexión"}
            </Button>
          </div>
        </form>
      </Card>

      {/* ── Correos administradores ─────────────────────── */}
      <Card className="overflow-hidden">
        <div className="bg-hopper-black px-6 py-4 flex items-center gap-3">
          <Mail className="w-5 h-5 text-hopper-red shrink-0" />
          <div>
            <h2 className="text-base font-bold text-white">Correos Administradores</h2>
            <p className="text-xs text-white/50 mt-0.5">Correos de administradores que reciben copia de todos los emails del sistema.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2 min-h-[36px]">
            {adminEmails.map((em) => (
              <span key={em} className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-sm text-hopper-black px-3 py-1 rounded-full">
                {em}
                <button
                  type="button"
                  onClick={() => setAdminEmails((prev) => prev.filter((e) => e !== em))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {adminEmails.length === 0 && (
              <p className="text-sm text-gray-400">No hay correos añadidos.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={adminEmailInput}
              onChange={(e) => setAdminEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = adminEmailInput.trim().toLowerCase();
                  if (val && val.includes("@") && !adminEmails.includes(val)) {
                    setAdminEmails((prev) => [...prev, val]);
                    setAdminEmailInput("");
                  }
                }
              }}
              placeholder="admin@ejemplo.com"
              className="flex-1 border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const val = adminEmailInput.trim().toLowerCase();
                if (val && val.includes("@") && !adminEmails.includes(val)) {
                  setAdminEmails((prev) => [...prev, val]);
                  setAdminEmailInput("");
                }
              }}
            >
              + Añadir
            </Button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-400">Pulsa Enter o el botón para añadir un correo.</p>
            <div className="flex items-center gap-3">
              {adminEmailsStatus === "ok" && <span className="text-xs text-green-600 font-medium">Guardado</span>}
              {adminEmailsStatus === "error" && <span className="text-xs text-red-500 font-medium">Error al guardar</span>}
              <Button
                type="button"
                onClick={handleSaveAdminEmails}
                disabled={adminEmailsSaving}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white"
              >
                {adminEmailsSaving ? "Guardando..." : "Guardar correos"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Gestión de usuarios ─────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="bg-hopper-black px-6 py-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-hopper-red shrink-0" />
          <div>
            <h2 className="text-base font-bold text-white">Gestión de usuarios</h2>
            <p className="text-xs text-white/50 mt-0.5">{users.length} cuenta{users.length !== 1 ? "s" : ""} registrada{users.length !== 1 ? "s" : ""}. Solo el rol «Alumno» cuenta en el panel Alumnos y el Excel; «Admin» además puede verlos.</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red"
            />
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-hopper-red" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {userSearch ? "No se encontraron resultados." : "No hay usuarios registrados."}
            </p>
          ) : (
            <div>
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[28%]" />
                  <col className="w-[36%]" />
                  <col className="w-[26%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead>
                  <tr className="border-b text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="pb-2 pr-4 font-medium">Nombre</th>
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Rol</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-medium text-hopper-black truncate">{u.name}</td>
                      <td className="py-3 pr-4 text-gray-500 truncate">{u.email}</td>
                      <td className="py-3 pr-4">
                        <select
                          value={u.role ?? (u.isAdmin ? "admin" : "student")}
                          onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                          aria-label={`Rol de ${u.name}`}
                          className={`w-full text-xs font-medium px-2 py-1.5 rounded-lg border outline-none cursor-pointer focus:ring-2 focus:ring-hopper-red/30 ${ROLE_STYLES[u.role ?? (u.isAdmin ? "admin" : "student")]}`}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setConfirmDelete(u)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          title="Eliminar cuenta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-black text-hopper-black">¿Eliminar cuenta?</h3>
            <p className="text-sm text-gray-500">
              Vas a eliminar la cuenta de <strong>{confirmDelete.name}</strong> ({confirmDelete.email}). Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete._id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingId === confirmDelete._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
