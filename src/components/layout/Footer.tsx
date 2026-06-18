"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const footerSections = [
  {
    title: "Explora",
    links: [
      { href: "/salarios", label: "Salarios SAP" },
      { href: "/mercado", label: "Mercado Laboral" },
      { href: "/perfiles", label: "Perfiles SAP" },
    ],
  },
  {
    title: "Hoppers",
    links: [
      { href: "/sobre-hoppers", label: "Sobre Nosotros" },
      { href: "https://hoppers.academy", label: "Hoppers Academy", external: true },
      { href: "/registro", label: "Unirse a la Comunidad" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidad", label: "Politica de Privacidad" },
      { href: "/terminos", label: "Terminos de Uso" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export default function Footer() {
  const router = useRouter();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCopyrightClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 2000);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      router.push("/admin");
    }
  }

  return (
    <footer className="bg-hopper-black text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/landingpage/logo-hoppers1.svg" alt="Hoppers" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Better. Smarter. Hoppers.
            </p>
            <p className="text-xs text-white/30 mt-4 leading-relaxed">
              Partner oficial de SAP para Europa y Latinoamerica. Formacion de
              alto nivel para profesionales ambiciosos.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/50 hover:text-hopper-red transition-colors inline-flex items-center gap-1"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-hopper-red transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-xs text-white/30 cursor-default select-none"
            onClick={handleCopyrightClick}
          >
            &copy; {new Date().getFullYear()} Hoppers Academy. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/30">
            Inspirados por Grace Hopper, la madre de la computacion.
          </p>
        </div>
      </div>
    </footer>
  );
}
