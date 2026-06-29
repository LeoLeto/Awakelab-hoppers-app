"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, getSession, ADMIN_EMAIL } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s) { window.location.href = s.email === ADMIN_EMAIL ? "/admin" : "/dashboard"; }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginUser(email, name);
    if (result.success) {
      if (result.diagnosticResult) {
        localStorage.setItem("hoppers_diag_result", JSON.stringify(result.diagnosticResult));
      }
      window.location.href = email.toLowerCase() === ADMIN_EMAIL ? "/admin" : "/dashboard";
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
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
            <Link
              href="/diagnostico"
              className="text-hopper-red hover:text-hopper-red-dark font-medium"
            >
              Registrate gratis
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
