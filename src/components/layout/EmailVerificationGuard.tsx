"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, markSessionEmailVerified } from "@/lib/auth";

const PROTECTED_PATHS = ["/dashboard", "/perfil", "/mi-cuenta", "/panel-admin", "/configuracion", "/diagnostico"];

export default function EmailVerificationGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      const session = getSession();
      if (!session) return;
      if (session.isSuperAdmin) return;
      if (session.emailVerified !== false) return;

      const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
      if (!isProtected) return;

      // localStorage says unverified — confirm against DB before blocking
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.user?.emailVerified === true) {
          markSessionEmailVerified();
          return;
        }
      } catch {
        // If DB unreachable, don't redirect (fail open)
        return;
      }

      router.replace(`/verificar-email?email=${encodeURIComponent(session.email)}`);
    }

    check();

    function handleStorage() { check(); }
    function handleFocus() { check(); }
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("hoppers:email-verified", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("hoppers:email-verified", handleStorage);
    };
  }, [pathname, router]);

  return null;
}
