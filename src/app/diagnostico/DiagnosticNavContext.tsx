"use client";

import { createContext, useContext, useState } from "react";

interface DiagnosticNavCtx {
  showNav: boolean;
  setShowNav: (v: boolean) => void;
}

const DiagnosticNavContext = createContext<DiagnosticNavCtx>({
  showNav: false,
  setShowNav: () => {},
});

export function DiagnosticNavProvider({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(false);
  return (
    <DiagnosticNavContext.Provider value={{ showNav, setShowNav }}>
      {children}
    </DiagnosticNavContext.Provider>
  );
}

export function useDiagnosticNav() {
  return useContext(DiagnosticNavContext);
}
