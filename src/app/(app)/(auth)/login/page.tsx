"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, getSession } from "@/lib/auth";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (s) { window.location.replace("/dashboard"); }
    else { setChecking(false); }
  }, []);

  if (checking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginUser(identifier, password);
    if (result.success) {
      window.location.href = "/dashboard";
    } else {
      setLoading(false);
      setError(result.error || "Error al iniciar sesion.");
    }
  };

  return (
    <Card className="w-full max-w-md border-hopper-beige/60">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/landingpage/logo-hoppers-negro.svg" alt="Hoppers" className="h-10 w-auto" />
        </div>
        <CardTitle className="text-2xl font-bold text-hopper-black">
          Iniciar sesion
        </CardTitle>
        <p className="text-sm text-hopper-black/50 mt-1">
          Accede a tu perfil y diagnostico personalizado
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email o nombre completo</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="tu@email.com o Tu Nombre"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/olvidar-contrasena" className="text-xs text-hopper-red hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="space-y-1">
              <p className="text-sm text-red-600">{error}</p>
              {error.includes("contrasena") || error.includes("contraseña") ? null : (
                <p className="text-xs text-gray-400">
                  ¿Primera vez con contraseña?{" "}
                  <Link href="/olvidar-contrasena" className="text-hopper-red hover:underline">
                    Crea tu contraseña aqui
                  </Link>
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white disabled:opacity-60"
          >
            {loading ? "Iniciando..." : "Iniciar sesion"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-hopper-black/50">
            No tienes cuenta?{" "}
            <Link href="/diagnostico" className="text-hopper-red hover:text-hopper-red-dark font-medium">
              Registrate gratis
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
