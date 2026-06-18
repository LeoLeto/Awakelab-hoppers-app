"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { DiagnosticNavProvider, useDiagnosticNav } from "./DiagnosticNavContext";

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { showNav } = useDiagnosticNav();
  return (
    <div className="min-h-full flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-1">{children}</main>
      {showNav && <Footer />}
    </div>
  );
}

export default function DiagnosticoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DiagnosticNavProvider>
      <ConditionalLayout>{children}</ConditionalLayout>
    </DiagnosticNavProvider>
  );
}
