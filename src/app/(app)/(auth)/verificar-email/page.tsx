"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

function VerifyContent() {
  const params = useSearchParams();
  const status = params.get("status");
  const email = params.get("email") || "";
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResent(true);
    } finally {
      setResending(false);
    }
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-hopper-black">¡Email verificado!</h1>
        <p className="text-gray-500 text-sm">Tu cuenta ha quedado confirmada. Ya puedes acceder a tu perfil y resultados.</p>
        <Link href="/dashboard">
          <Button className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8">
            Ir a mi dashboard →
          </Button>
        </Link>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-hopper-black">Enlace expirado</h1>
        <p className="text-gray-500 text-sm">El enlace de verificación ha expirado (válido 24 horas). Vuelve al login y solicita un nuevo enlace.</p>
        <Link href="/login">
          <Button className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8">
            Volver al login
          </Button>
        </Link>
      </div>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-hopper-black">Enlace no válido</h1>
        <p className="text-gray-500 text-sm">Este enlace de verificación no es válido o ya fue usado.</p>
        <Link href="/login">
          <Button className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8">
            Volver al login
          </Button>
        </Link>
      </div>
    );
  }

  // Default: "check your inbox" screen (no status param)
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-hopper-red/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-hopper-red" />
        </div>
      </div>
      <h1 className="text-2xl font-black text-hopper-black">Revisa tu email</h1>
      <p className="text-gray-500 text-sm">
        Te hemos enviado un enlace de verificación a <strong>{email || "tu correo"}</strong>.<br />
        Revisa también la carpeta de spam.
      </p>
      {email && (
        <div>
          {resent ? (
            <p className="text-sm text-green-600 font-semibold">¡Reenviado! Revisa tu bandeja.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-hopper-red underline hover:no-underline disabled:opacity-50"
            >
              {resending ? "Enviando..." : "¿No lo recibiste? Reenviar email"}
            </button>
          )}
        </div>
      )}
      <Link href="/login" className="block text-xs text-gray-400 hover:text-hopper-black transition-colors">
        Volver al login
      </Link>
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
