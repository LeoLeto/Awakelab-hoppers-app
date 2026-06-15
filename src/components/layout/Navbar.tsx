"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { getSession, logoutUser } from "@/lib/auth";
import type { HoppersSession } from "@/lib/auth";

const navLinks = [
  { href: "/salarios", label: "Salarios SAP" },
  { href: "/mercado", label: "Mercado Laboral" },
  { href: "/perfiles", label: "Perfiles SAP" },
  { href: "/diagnostico", label: "Diagnostico" },
  { href: "/sobre-hoppers", label: "Sobre Hoppers" },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<HoppersSession | null>(null);

  useEffect(() => {
    setSession(getSession());
    const onStorage = () => setSession(getSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    logoutUser();
    setSession(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hopper-beige/30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8 rounded bg-hopper-red flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-hopper-black">
              HOPPERS
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-hopper-black/70 hover:text-hopper-red transition-colors rounded-md hover:bg-hopper-beige/20"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/mi-cuenta">
                <Button variant="ghost" size="sm" className="text-hopper-black/70 hover:text-hopper-black">
                  {session.name.split(" ")[0]}
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="text-hopper-black/70"
              >
                Cerrar sesion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-hopper-black/70 hover:text-hopper-black">
                  Iniciar Sesion
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="sm" className="bg-hopper-red hover:bg-hopper-red-dark text-white">
                  Unirse Gratis
                </Button>
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-hopper-black/70 hover:bg-hopper-beige/20 transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent className="w-[300px] bg-white">
            <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-base font-medium text-hopper-black hover:text-hopper-red transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-hopper-beige/30 pt-4 mt-2 flex flex-col gap-2">
                {session ? (
                  <>
                    <Link href="/mi-cuenta" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Mi cuenta ({session.name.split(" ")[0]})
                      </Button>
                    </Link>
                    <Button
                      className="w-full"
                      variant="ghost"
                      onClick={() => { handleLogout(); setOpen(false); }}
                    >
                      Cerrar sesion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar Sesion
                      </Button>
                    </Link>
                    <Link href="/registro" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white">
                        Unirse Gratis
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
