import type { Role } from "@/lib/roles";

// Filtro de "alumnos" para el panel Alumnos, sus cifras y la exportación a Excel.
// Solo cuentan las cuentas con rol "student" (ver src/lib/roles.ts). Se excluyen:
// - el superadmin (por email, SUPERADMIN_EMAIL),
// - cualquier cuenta con isAdmin (por seguridad, aunque el rol no estuviera actualizado),
// - los roles staff, admin y test.
// role: null incluye usuarios antiguos que aún no tienen el campo (cuentan como alumno).
export function studentsFilter() {
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  return {
    email: { $ne: superadminEmail },
    isAdmin: { $ne: true },
    role: { $in: ["student" as Role, null] },
  };
}
