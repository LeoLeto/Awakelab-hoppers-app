"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Key, Mail, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, updateSessionName } from "@/lib/auth";
import type { HoppersSession } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";

function StatusMsg({ type, text }: { type: "ok" | "err"; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg ${
      type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
    }`}>
      {type === "ok"
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      {text}
    </div>
  );
}

export default function MiCuentaPage() {
  const router = useRouter();
  const [session, setSession] = useState<HoppersSession | null>(null);

  const [name, setName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailPw, setEmailPw] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    setSession(s);
    setName(s.name);
  }, [router]);

  async function patch(body: object) {
    return fetch("/api/auth/update-account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json());
  }

  async function handleName() {
    setNameSaving(true);
    setNameMsg(null);
    const json = await patch({ action: "name", name });
    setNameSaving(false);
    if (json.success) {
      updateSessionName(json.name);
      setSession((s) => s ? { ...s, name: json.name } : s);
      setNameMsg({ type: "ok", text: "Nombre actualizado correctamente." });
    } else {
      setNameMsg({ type: "err", text: json.error || "Error al actualizar." });
    }
  }

  async function handlePassword() {
    if (newPw !== confirmPw) {
      setPwMsg({ type: "err", text: "Las contraseñas no coinciden." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const json = await patch({ action: "password", currentPassword: currentPw, newPassword: newPw });
    setPwSaving(false);
    if (json.success) {
      setPwMsg({ type: "ok", text: "Contraseña actualizada correctamente." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      setPwMsg({ type: "err", text: json.error || "Error al actualizar." });
    }
  }

  async function handleEmail() {
    setEmailSaving(true);
    setEmailMsg(null);
    const json = await patch({ action: "email", currentPassword: emailPw, newEmail });
    setEmailSaving(false);
    if (json.success) {
      const s = getSession();
      if (s) {
        const updated = { ...s, email: json.newEmail, emailVerified: false };
        localStorage.setItem("hoppers_session", JSON.stringify(updated));
        setSession(updated);
      }
      setEmailMsg({ type: "ok", text: `Email actualizado. Hemos enviado verificación a ${json.newEmail}.` });
      setNewEmail(""); setEmailPw("");
    } else {
      setEmailMsg({ type: "err", text: json.error || "Error al actualizar." });
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("hoppers_session");
    router.push("/");
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-hopper-black">Seguridad y cuenta</h1>
        <p className="text-sm text-gray-400 mt-1">Gestiona tus datos de acceso</p>
      </div>

      {/* Info de cuenta actual */}
      <Card className="p-5 bg-hopper-black text-white flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-hopper-red flex items-center justify-center text-white font-black text-lg shrink-0">
          {session.name[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold">{session.name}</p>
          <p className="text-sm text-white/60">{session.email}</p>
          {session.emailVerified === false && (
            <p className="text-xs text-amber-400 mt-0.5">Email pendiente de verificación</p>
          )}
        </div>
      </Card>

      {/* Cambiar nombre */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-hopper-red" />
          <h2 className="font-bold text-hopper-black">Nombre</h2>
        </div>
        <div className="space-y-3 max-w-sm">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          {nameMsg && <StatusMsg {...nameMsg} />}
          <Button
            onClick={handleName}
            disabled={nameSaving || !name.trim() || name.trim() === session.name}
            className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
          >
            {nameSaving ? "Guardando..." : "Guardar nombre"}
          </Button>
        </div>
      </Card>

      {/* Cambiar contraseña */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-hopper-red" />
          <h2 className="font-bold text-hopper-black">Contraseña</h2>
        </div>
        <div className="space-y-3 max-w-sm">
          <div>
            <Label htmlFor="current-pw">Contraseña actual</Label>
            <PasswordInput
              id="current-pw"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label htmlFor="new-pw">Nueva contraseña</Label>
            <PasswordInput
              id="new-pw"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <Label htmlFor="confirm-pw">Confirmar nueva contraseña</Label>
            <PasswordInput
              id="confirm-pw"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>
          {pwMsg && <StatusMsg {...pwMsg} />}
          <Button
            onClick={handlePassword}
            disabled={pwSaving || !currentPw || !newPw || !confirmPw}
            className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
          >
            {pwSaving ? "Actualizando..." : "Cambiar contraseña"}
          </Button>
        </div>
      </Card>

      {/* Cambiar email */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-hopper-red" />
          <h2 className="font-bold text-hopper-black">Dirección de email</h2>
        </div>
        <p className="text-sm text-gray-500">
          Email actual:{" "}
          <span className="font-medium text-hopper-black">{session.email}</span>
        </p>
        <div className="space-y-3 max-w-sm">
          <div>
            <Label htmlFor="new-email">Nuevo email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuevo@ejemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="email-pw">Confirma tu contraseña</Label>
            <PasswordInput
              id="email-pw"
              value={emailPw}
              onChange={(e) => setEmailPw(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <p className="text-xs text-gray-400">
            Recibirás un email de verificación en la nueva dirección.
          </p>
          {emailMsg && <StatusMsg {...emailMsg} />}
          <Button
            onClick={handleEmail}
            disabled={emailSaving || !newEmail || !emailPw}
            className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
          >
            {emailSaving ? "Actualizando..." : "Cambiar email"}
          </Button>
        </div>
      </Card>

      {/* Sesión */}
      <Card className="p-5 border-red-100">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-red-500" />
          <h2 className="font-bold text-hopper-black">Sesión</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Cierra la sesión en este dispositivo.
        </p>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Card>
    </main>
  );
}
