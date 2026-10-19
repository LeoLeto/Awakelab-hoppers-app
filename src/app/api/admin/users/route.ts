import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

// Nivel de acceso de quien hace la petición:
// - superadmin: email igual a SUPERADMIN_EMAIL. Puede ver, dar/quitar admin y eliminar.
// - admin: isAdmin en BD. Solo puede ver el listado (GET).
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

export async function GET() {
  const level = await getAdminLevel();
  if (!level) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  await connectDB();
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  const users = await User.find({ email: { $ne: superadminEmail } })
    .select("name email country emailVerified diagnosticDone empScore createdAt isAdmin advisoryRequested advisoryDate currentRole topProfile")
    .sort({ createdAt: -1 })
    .lean();
  return Response.json({ users });
}

// Dar o quitar permiso de admin a un usuario. Solo superadmin.
export async function PATCH(request: NextRequest) {
  if ((await getAdminLevel()) !== "superadmin") {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { id, isAdmin } = await request.json();
  if (!id) return Response.json({ error: "ID requerido." }, { status: 400 });
  await connectDB();
  await User.findByIdAndUpdate(id, { isAdmin: !!isAdmin });
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
