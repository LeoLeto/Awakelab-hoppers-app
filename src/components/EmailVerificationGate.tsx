"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markSessionEmailVerified } from "@/lib/auth";

interface Props {
  email: string;
  children: React.ReactNode;
  verified?: boolean;
  isSuperAdmin?: boolean;
}

export default function EmailVerificationGate({ email, children, verified, isSuperAdmin }: Props) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resolvedVerified, setResolvedVerified] = useState(verified);

  // On mount, check the real DB status in case localStorage is stale
  useEffect(() => {
    if (verified !== false || isSuperAdmin) return;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.user?.emailVerified === true) {
          markSessionEmailVerified();
          setResolvedVerified(true);
        }
      })
      .catch(() => {});
  }, [verified, isSuperAdmin]);

  if (resolvedVerified !== false || isSuperAdmin) return <>{children}</>;

  async function handleResend() {
    setResending(true);
    setResent(false);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setResent(true);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-hopper-red/10 flex items-center justify-center">
        <Mail className="w-8 h-8 text-hopper-red" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="text-2xl font-black text-hopper-black">Verifica tu email</h2>
        <p className="text-sm text-gray-500">
          Para acceder a esta sección necesitas verificar tu cuenta. Te enviamos un enlace a <strong>{email}</strong>.
        </p>
      </div>
      <p className="text-xs text-gray-400 max-w-xs">
        Revisa tu bandeja de entrada y la carpeta de spam. Haz clic en el enlace y luego recarga esta página.
      </p>
      {resent && (
        <p className="text-sm text-green-600 font-medium">¡Email reenviado! Revisa tu bandeja.</p>
      )}
      <Button
        onClick={handleResend}
        disabled={resending}
        className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-60"
      >
        {resending ? "Enviando..." : "Reenviar email de verificación"}
      </Button>
    </div>
  );
}
