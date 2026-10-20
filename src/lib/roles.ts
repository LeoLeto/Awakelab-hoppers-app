// Roles de usuario. Los asigna el superadmin desde Configuración (selector "Rol").
// El superadmin no es un rol: es la cuenta cuyo email está en SUPERADMIN_EMAIL.
//
// Rol             Panel Alumnos y Excel   Cuenta como alumno (cifras y Excel)
// student         no                      sí
// staff           no                      no   (compañeros registrados sin acceso a datos)
// admin           sí                      no
// test            no                      no   (cuentas de prueba)
//
// Al guardar un rol también se actualiza isAdmin (isAdmin = role === "admin"), que es lo que
// siguen comprobando el login, el menú y los endpoints de admin.
export const ROLES = ["student", "staff", "admin", "test"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  student: "Alumno",
  staff: "Equipo interno",
  admin: "Admin",
  test: "Prueba",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
