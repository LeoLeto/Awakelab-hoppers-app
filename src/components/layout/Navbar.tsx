"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, UserCircle, LogOut, User, ChevronDown, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { getSession, logoutUser } from "@/lib/auth";
import { getProfile, calculateCompletion, buildProfileFromDiagnostic } from "@/lib/profile";
import type { HoppersSession } from "@/lib/auth";

const navLinks = [
  { href: "/salarios", label: "Salarios SAP" },
  { href: "/mercado", label: "Mercado Laboral" },
  { href: "/perfiles", label: "Perfiles SAP" },
  { href: "/diagnostico", label: "Diagnostico" },
  { href: "/sobre-hoppers", label: "Sobre Hoppers" },
];

function ProfileAvatar({ name, photo, size = "md" }: { name: string; photo?: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${dim} rounded-full bg-hopper-red flex items-center justify-center text-white font-bold overflow-hidden shrink-0`}>
      {photo
        ? <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
        : name[0]?.toUpperCase()}
    </div>
  );
}

function ProfileDropdown({
  session, completion, photo, onLogout, onClose,
}: {
  session: HoppersSession;
  completion: number;
  photo: string;
  onLogout: () => void;
  onClose: () => void;
}) {
  const barColor = completion >= 80 ? "#10B981" : completion >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-50 space-y-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar name={session.name} photo={photo} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-hopper-black truncate">{session.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.email}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Perfil completado</span>
            <span className="font-bold" style={{ color: barColor }}>{completion}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${completion}%`, backgroundColor: barColor }} />
          </div>
        </div>
      </div>
      <div className="p-1">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-hopper-black hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-gray-400" />
          Dashboard
        </Link>
        <Link
          href="/perfil"
          onClick={onClose}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-hopper-black hover:bg-gray-50 rounded-lg transition-colors"
        >
          <User className="w-4 h-4 text-gray-400" />
          Mi perfil
        </Link>
        {session.isSuperAdmin && (
          <>
            <div className="my-1 border-t border-gray-50" />
            <Link
              href="/configuracion"
              onClick={onClose}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-hopper-black hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Configuraciones del sitio
            </Link>
          </>
        )}
        <button
          onClick={() => { onLogout(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, setSession] = useState<HoppersSession | null>(null);
  const [completion, setCompletion] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refresh() {
      const s = getSession();
      setSession(s);
      if (s) {
        const stored = getProfile(s.email);
        setProfilePhoto(stored.photo ?? "");
        let diagResult: Record<string, unknown> | null = null;
        try {
          const raw = localStorage.getItem("hoppers_diag_result");
          if (raw) diagResult = JSON.parse(raw);
        } catch {}
        const fromDiag = buildProfileFromDiagnostic(
          { name: s.name, email: s.email, country: s.country },
          diagResult,
        );
        const nonEmpty = (v: unknown) =>
          Array.isArray(v) ? (v as unknown[]).length > 0 : typeof v === "string" && (v as string).trim().length > 0;
        const merged = {
          ...Object.fromEntries(Object.entries(fromDiag).filter(([, v]) => nonEmpty(v))),
          ...Object.fromEntries(Object.entries(stored).filter(([, v]) => nonEmpty(v))),
        };
        setCompletion(calculateCompletion(merged as typeof stored));
      } else {
        setCompletion(0);
        setProfilePhoto("");
      }
    }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("hoppers:profile-saved", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("hoppers:profile-saved", refresh);
    };
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logoutUser();
    setSession(null);
    setCompletion(0);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(195,175,153,0.08)] bg-[#000A1A]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <img src="/landingpage/logo-hoppers1.svg" alt="Hoppers" className="h-8 w-auto" />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive
                    ? "text-white border border-white/30"
                    : "text-white/70 hover:text-hopper-red hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {completion < 100 && (
                <Link href="/perfil" className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all mr-1">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap">Completa tu perfil</span>
                      <span className="text-xs font-bold text-hopper-red">{completion}%</span>
                    </div>
                    <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-hopper-red transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <ProfileAvatar name={session.name} photo={profilePhoto} />
                  <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen && (
                  <ProfileDropdown
                    session={session}
                    completion={completion}
                    photo={profilePhoto}
                    onLogout={handleLogout}
                    onClose={() => setDropdownOpen(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors">
                  <UserCircle className="w-8 h-8" />
                </button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-hopper-red hover:bg-hopper-red-dark text-white">
                  Iniciar Sesion
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:bg-white/10 transition-colors">
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
                    <div className="flex items-center gap-3 px-3 py-2">
                      <ProfileAvatar name={session.name} photo={profilePhoto} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-hopper-black truncate">{session.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-hopper-red" style={{ width: `${completion}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{completion}%</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Link href="/perfil" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">Mi perfil</Button>
                    </Link>
                    {session.isSuperAdmin && (
                      <Link href="/configuracion" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full border-gray-200 text-hopper-black">
                          Configuraciones del sitio
                        </Button>
                      </Link>
                    )}
                    {completion < 100 && (
                      <Link href="/perfil" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
                          Completa tu perfil ({completion}%)
                        </Button>
                      </Link>
                    )}
                    <Button
                      className="w-full"
                      variant="ghost"
                      onClick={() => { handleLogout(); setOpen(false); }}
                    >
                      Cerrar sesion
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white">
                      Iniciar Sesion
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
