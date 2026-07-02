"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";

interface SmtpSettings {
  smtpFrom: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassSet: boolean;
  smtpSecure: boolean;
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
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smtpFrom, smtpHost, smtpPort: Number(smtpPort), smtpUser, smtpPass: smtpPass || undefined, smtpSecure }),
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
    </div>
  );
}
