"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { initSession } from "@/lib/auth";

function NuevaContrasenaContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;
  const tooShort = password.length > 0 && password.length < 8;
  const canSubmit = password.length >= 8 && password === confirm && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Error al restablecer la contraseña.");
        setLoading(false);
        return;
      }
      // Backend set the JWT cookie, save session locally
      initSession({ email: json.user.email, name: json.user.name, country: "", loggedAt: new Date().toISOString() });
      router.push("/dashboard");
    } catch {
      setError("Error de conexion.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-red-600 font-semibold">Enlace no válido.</p>
        <a href="/olvidar-contrasena" className="text-sm text-hopper-red hover:underline">
          Solicitar nuevo enlace
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {tooShort && <p className="text-xs text-red-500">Mínimo 8 caracteres</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar contraseña</Label>
        <Input
          id="confirm"
          type="password"
          placeholder="Repite tu contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {mismatch && <p className="text-xs text-red-500">Las contraseñas no coinciden</p>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar contraseña"}
      </Button>
    </form>
  );
}

export default function NuevaContrasenaPage() {
  return (
    <Card className="w-full max-w-md border-hopper-beige/60">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/landingpage/logo-hoppers-negro.svg" alt="Hoppers" className="h-10 w-auto" />
        </div>
        <CardTitle className="text-2xl font-bold text-hopper-black">
          Nueva contraseña
        </CardTitle>
        <p className="text-sm text-hopper-black/50 mt-1">
          Crea una contraseña segura para tu cuenta
        </p>
      </CardHeader>
      <CardContent>
        <Suspense>
          <NuevaContrasenaContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
