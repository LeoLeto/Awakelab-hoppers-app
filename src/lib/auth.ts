export interface HoppersUser {
  id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  currentRole: string;
  yearsExperience: string;
  sapModules: string[];
  certifications: string;
  linkedinUrl: string;
  targetRole: string;
  createdAt: string;
  updatedAt?: string;
  diagnosticDone: boolean;
  diagnosticDate?: string;
  empScore?: number;
  topProfile?: string;
  skills?: string[];
}

export interface HoppersSession {
  email: string;
  name: string;
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

const USERS_KEY = "hoppers_users";
const SESSION_KEY = "hoppers_session";
export const ADMIN_PASSWORD = "h0pp3rs_2026_adm!n";

function hashPassword(pw: string): string {
  let h = 0;
  for (let i = 0; i < pw.length; i++) {
    h = ((h << 5) - h) + pw.charCodeAt(i);
    h |= 0;
  }
  return "h_" + Math.abs(h).toString(36);
}

export function getUsers(): HoppersUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users: HoppersUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): HoppersSession | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(session: HoppersSession | null): void {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function registerUser(data: RegisterData): { success: boolean; error?: string } {
  const users = getUsers();
  const existing = users.find((u) => u.email === data.email);

  if (existing) {
    Object.assign(existing, { ...data, updatedAt: new Date().toISOString() });
    saveUsers(users);
  } else {
    const tempPw = hashPassword(data.email + "hoppers");
    users.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...data,
      password: tempPw,
      createdAt: new Date().toISOString(),
      diagnosticDone: false,
    });
    saveUsers(users);
  }

  saveSession({ email: data.email, name: data.name, loggedAt: new Date().toISOString() });
  return { success: true };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "No existe una cuenta con ese email." };
  if (user.password !== hashPassword(password)) return { success: false, error: "Contraseña incorrecta." };
  saveSession({ email: user.email, name: user.name, loggedAt: new Date().toISOString() });
  return { success: true };
}

export function logoutUser(): void {
  saveSession(null);
}

export function updatePassword(email: string, newPassword: string): { success: boolean; error?: string } {
  if (newPassword.length < 6) return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "Usuario no encontrado." };
  user.password = hashPassword(newPassword);
  saveUsers(users);
  return { success: true };
}

export function saveDiagnosticResult(
  email: string,
  result: { empScore: number; topProfile: string; skills: string[] }
): void {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (user) {
    user.diagnosticDone = true;
    user.diagnosticDate = new Date().toISOString();
    user.empScore = result.empScore;
    user.topProfile = result.topProfile;
    user.skills = result.skills;
    saveUsers(users);
  }
}
