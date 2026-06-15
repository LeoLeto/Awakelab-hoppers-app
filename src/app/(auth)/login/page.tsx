"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase auth will be connected in Phase 2
    alert("Funcionalidad de login disponible proximamente. Registrate para ser notificado.");
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
          <Button
            type="submit"
            className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white"
          >
            Iniciar sesion
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
