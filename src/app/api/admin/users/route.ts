import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import { studentsFilter } from "@/lib/students";
import { isRole } from "@/lib/roles";

// Nivel de acceso de quien hace la petición:
// - superadmin: email igual a SUPERADMIN_EMAIL. Puede ver, asignar roles y eliminar.
// - admin: rol "admin" (isAdmin en BD). Solo puede ver el listado (GET).
// Un admin no puede nombrar a otros admins: quien da acceso a datos personales
// debe ser una única persona responsable.
async function getAdminLevel(): Promise<"superadmin" | "admin" | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  if (payload.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase()) return "superadmin";
  await connectDB();
  const user = await User.findById(payload.id).select("isAdmin").lean() as { isAdmin?: boolean } | null;
  return user?.isAdmin ? "admin" : null;
}

// Listado de usuarios.
// - Por defecto (panel Alumnos): solo cuentas con rol "student".
// - ?all=1 (Configuración, solo superadmin): todas las cuentas salvo el superadmin,
//   para poder asignar roles.
export async function GET(request: NextRequest) {
  const level = await getAdminLevel();
  if (!level) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const all = request.nextUrl.searchParams.get("all") === "1";
  if (all && level !== "superadmin") {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  await connectDB();
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  const users = await User.find(all ? { email: { $ne: superadminEmail } } : studentsFilter())
    .select("name email country emailVerified diagnosticDone empScore createdAt isAdmin role advisoryRequested advisoryDate currentRole topProfile")
    .sort({ createdAt: -1 })
    .lean();
  return Response.json({ users });
}

// Cambiar el rol de un usuario (student, staff, admin, test). Solo superadmin.
// isAdmin se actualiza a la vez para que login, menú y endpoints de admin lo respeten.
export async function PATCH(request: NextRequest) {
  if ((await getAdminLevel()) !== "superadmin") {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { id, role } = await request.json();
  if (!id) return Response.json({ error: "ID requerido." }, { status: 400 });
  if (!isRole(role)) return Response.json({ error: "Rol no válido." }, { status: 400 });
  await connectDB();
  await User.findByIdAndUpdate(id, { role, isAdmin: role === "admin" });
  return Response.json({ success: true });
}

// Eliminar un usuario (p. ej. derecho de supresión RGPD). Solo superadmin.
export async function DELETE(request: NextRequest) {
  if ((await getAdminLevel()) !== "superadmin") {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { id } = await request.json();
  if (!id) return Response.json({ error: "ID requerido." }, { status: 400 });
  await connectDB();
  await User.findByIdAndDelete(id);
  return Response.json({ success: true });
}
