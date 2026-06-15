"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = loginUser(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/mi-cuenta");
    } else {
      setError(result.error || "Error al iniciar sesion.");
    }
  };

  return (
    <Card className="w-full max-w-md border-hopper-beige/60">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="h-10 w-10 rounded bg-hopper-red flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
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
            <Label htmlFor="password">Contrasena</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              href="/registro"
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
