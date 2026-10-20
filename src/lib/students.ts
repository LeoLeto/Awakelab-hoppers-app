// Filtro de "alumnos" para el panel Alumnos, sus cifras y la exportación a Excel.
// Excluye a quien no es un inscrito real:
// - el superadmin (por email, SUPERADMIN_EMAIL),
// - el personal con acceso de admin (isAdmin),
// - las cuentas marcadas como prueba en Configuración (isTestAccount).
// Se usa $ne: true (y no false) para incluir usuarios antiguos que no tienen el campo.
export function studentsFilter() {
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  return {
    email: { $ne: superadminEmail },
    isAdmin: { $ne: true },
    isTestAccount: { $ne: true },
  };
}
