export interface HoppersSession {
  email: string;
  name: string;
  country: string;
  loggedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  country: string;
  currentRole: string;
  yearsExperience: string;
  sapModules: string[];
  certifications: string;
  linkedinUrl: string;
  targetRole: string;
}

const SESSION_KEY = "hoppers_session";
export const ADMIN_PASSWORD = "h0pp3rs_2026_adm!n";

// ─── Session cache (localStorage — UI only, not authoritative) ────────────────

export function getSession(): HoppersSession | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session: HoppersSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function registerUser(
  data: RegisterData
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error };
    saveSession({
      email: json.user.email,
      name: json.user.name,
      country: json.user.country || "",
      loggedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Error de conexion." };
  }
}

export async function loginUser(
  email: string,
  name: string
): Promise<{ success: boolean; error?: string; diagnosticResult?: unknown }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const json = await res.json();
    if (res.ok) {
      saveSession({
        email: json.user.email,
        name: json.user.name,
        country: json.user.country || "",
        loggedAt: new Date().toISOString(),
      });
      return { success: true, diagnosticResult: json.diagnosticResult ?? null };
    }
    if (res.status >= 500) {
      return loginUserLocal(email, name);
    }
    return { success: false, error: json.error };
  } catch {
    return loginUserLocal(email, name);
  }
}

function loginUserLocal(email: string, name: string): { success: boolean; error?: string } {
  try {
    // Verificar contra sesión previa si existe
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: HoppersSession = JSON.parse(stored);
      if (session.email.toLowerCase() === email.toLowerCase()) {
        if (session.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
          return { success: false, error: "El nombre no coincide con el registrado." };
        }
        saveSession({ ...session, loggedAt: new Date().toISOString() });
        return { success: true };
      }
    }
    // Sin sesión previa y DB no disponible: crear sesión local con los datos proporcionados
    saveSession({
      email: email.toLowerCase(),
      name: name.trim(),
      country: "",
      loggedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Error al acceder al almacenamiento local." };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {}
  saveSession(null);
  localStorage.removeItem("hoppers_diag_result");
}

export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error };
    return { success: true };
  } catch {
    return { success: false, error: "Error de conexion." };
  }
}

export async function saveDiagnosticResult(result: {
  empScore: number;
  topProfile: string;
  skills: string[];
  fullResult?: unknown;
}): Promise<void> {
  try {
    await fetch("/api/diagnostic/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
  } catch {}
}

export async function getDiagnosticResult(): Promise<unknown | null> {
  try {
    const res = await fetch("/api/diagnostic/result");
    if (!res.ok) return null;
    const json = await res.json();
    return json.result ?? null;
  } catch {
    return null;
  }
}
