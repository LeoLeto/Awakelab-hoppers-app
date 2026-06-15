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
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {}
  saveSession(null);
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
}): Promise<void> {
  try {
    await fetch("/api/diagnostic/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
  } catch {}
}
