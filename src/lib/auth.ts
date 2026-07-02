export interface HoppersSession {
  email: string;
  name: string;
  country: string;
  loggedAt: string;
  isSuperAdmin?: boolean;
  emailVerified?: boolean;
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
  linkedin?: string;
  salary?: string;
  password?: string;
}

const SESSION_KEY = "hoppers_session";
const DIAG_KEY = "hoppers_diag_result";

function diagBackupKey(email: string) {
  return `hoppers_diag_backup_${email.toLowerCase()}`;
}

// ─── Session cache (localStorage — UI only, not authoritative) ────────────────

export function getSession(): HoppersSession | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function initSession(session: HoppersSession): void {
  saveSession(session);
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
): Promise<{ success: boolean; error?: string; alreadyExists?: boolean; needsVerification?: boolean }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error, alreadyExists: json.alreadyExists };
    saveSession({
      email: json.user.email,
      name: json.user.name,
      country: json.user.country || "",
      loggedAt: new Date().toISOString(),
      isSuperAdmin: json.isSuperAdmin ?? false,
      emailVerified: json.emailVerified ?? false,
    });
    return { success: true, needsVerification: json.needsVerification ?? false };
  } catch {
    return { success: false, error: "Error de conexion." };
  }
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const json = await res.json();
    if (res.ok) {
      saveSession({
        email: json.user.email,
        name: json.user.name,
        country: json.user.country || "",
        loggedAt: new Date().toISOString(),
        isSuperAdmin: json.isSuperAdmin ?? false,
        emailVerified: json.emailVerified ?? true,
      });
      // Restore diagnostic backup to active key (client-side only, no sensitive data in API response)
      try {
        const backup = localStorage.getItem(diagBackupKey(json.user.email));
        if (backup) localStorage.setItem(DIAG_KEY, backup);
      } catch {}
      return { success: true };
    }
    if (json.needsVerification) {
      return { success: false, error: json.error, needsVerification: true, email: json.email };
    }
    return { success: false, error: json.error };
  } catch {
    return { success: false, error: "Error de conexion. Comprueba tu internet." };
  }
}


export function updateSessionName(name: string): void {
  const session = getSession();
  if (session) saveSession({ ...session, name: name.trim() });
}

export function markSessionEmailVerified(): void {
  const session = getSession();
  if (session) saveSession({ ...session, emailVerified: true });
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {}
  saveSession(null);
  localStorage.removeItem(DIAG_KEY);
  // No eliminamos el backup — persiste para restaurar al volver a iniciar sesión
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
  email?: string;
}): Promise<void> {
  // Guardar backup local keyed por email para funcionar sin MongoDB
  if (result.email && result.fullResult) {
    try {
      localStorage.setItem(diagBackupKey(result.email), JSON.stringify(result.fullResult));
    } catch {}
  }
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
