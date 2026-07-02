"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function OlvidarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Error al enviar el email.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Error de conexion. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-hopper-beige/60">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src="/landingpage/logo-hoppers-negro.svg" alt="Hoppers" className="h-10 w-auto" />
        </div>
        <CardTitle className="text-2xl font-bold text-hopper-black">
          Restablecer contraseña
        </CardTitle>
        <p className="text-sm text-hopper-black/50 mt-1">
          Te enviaremos un enlace para crear una nueva contraseña
        </p>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto text-2xl">
              📧
            </div>
            <p className="font-semibold text-hopper-black">Revisa tu email</p>
            <p className="text-sm text-gray-500">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña en unos minutos.
            </p>
            <Link href="/login" className="block text-sm text-hopper-red hover:underline">
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de tu cuenta</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </Button>
            <div className="text-center">
              <Link href="/login" className="text-sm text-hopper-black/50 hover:text-hopper-black">
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
