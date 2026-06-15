"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, getUsers, logoutUser, updatePassword } from "@/lib/auth";
import type { HoppersUser, HoppersSession } from "@/lib/auth";
import { sapProfiles } from "@/lib/data/sapProfiles";

export default function MiCuentaPage() {
  const router = useRouter();
  const [session, setSession] = useState<HoppersSession | null>(null);
  const [user, setUser] = useState<HoppersUser | null>(null);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    setSession(s);
    const users = getUsers();
    setUser(users.find((u) => u.email === s.email) || null);
  }, [router]);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  function handlePasswordChange() {
    if (!user) return;
    if (newPw !== confirmPw) { setPwMsg({ type: "err", text: "Las contraseñas no coinciden." }); return; }
    const res = updatePassword(user.email, newPw);
    if (res.success) {
      setPwMsg({ type: "ok", text: "Contraseña actualizada correctamente." });
      setNewPw(""); setConfirmPw("");
    } else {
      setPwMsg({ type: "err", text: res.error || "Error al actualizar." });
    }
  }

  if (!session || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>;
  }

  const topProfile = sapProfiles.find((p) => p.slug === user.topProfile);
  const diagDate = user.diagnosticDate ? new Date(user.diagnosticDate).toLocaleDateString("es-ES") : null;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-hopper-black">Bienvenido, {user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Cerrar sesion</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pais", value: user.country || "—" },
            { label: "Experiencia", value: user.yearsExperience || "—" },
            { label: "Rol actual", value: user.currentRole || "—" },
            { label: "Modulos SAP", value: user.sapModules?.join(", ") || "—" },
          ].map((item) => (
            <Card key={item.label} className="p-4">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-hopper-black truncate">{item.value}</p>
            </Card>
          ))}
        </div>

        {user.diagnosticDone ? (
          <Card className="p-5 border-l-4 border-hopper-red">
            <h3 className="font-bold text-hopper-black mb-3">Tu ultimo diagnostico SAP</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="text-center">
                <p className="text-3xl font-black text-hopper-red">{user.empScore ?? "—"}%</p>
                <p className="text-xs text-gray-400">Empleabilidad</p>
              </div>
              {topProfile && (
                <div>
                  <p className="text-sm font-semibold">{topProfile.name}</p>
                  <p className="text-xs text-gray-400">Perfil mas compatible</p>
                </div>
              )}
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {user.skills.map((s) => (
                    <span key={s} className="bg-hopper-red/10 text-hopper-red text-xs px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="ml-auto">
                {diagDate && <p className="text-xs text-gray-400">Realizado el {diagDate}</p>}
              </div>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                className="bg-hopper-red hover:bg-hopper-red/90 text-white"
                onClick={() => router.push("/diagnostico")}
              >
                Repetir diagnostico
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-5 text-center bg-hopper-black text-white">
            <p className="font-bold mb-2">Aun no has realizado tu diagnostico SAP</p>
            <p className="text-sm text-gray-400 mb-4">Descubre tu indice de empleabilidad y el perfil que mejor encaja contigo.</p>
            <Button
              className="bg-hopper-red hover:bg-hopper-red/90 text-white"
              onClick={() => router.push("/diagnostico")}
            >
              Hacer diagnostico ahora
            </Button>
          </Card>
        )}

        <Card className="p-5">
          <h3 className="font-bold text-hopper-black mb-4">Cambiar contraseña</h3>
          <div className="space-y-3 max-w-sm">
            <div>
              <Label htmlFor="new-pw">Nueva contraseña</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Minimo 6 caracteres"
              />
            </div>
            <div>
              <Label htmlFor="confirm-pw">Confirmar contraseña</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repite la contraseña"
              />
            </div>
            {pwMsg && (
              <p className={`text-sm ${pwMsg.type === "ok" ? "text-green-600" : "text-red-600"}`}>
                {pwMsg.text}
              </p>
            )}
            <Button
              onClick={handlePasswordChange}
              disabled={!newPw || !confirmPw}
              className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
            >
              Actualizar contraseña
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
