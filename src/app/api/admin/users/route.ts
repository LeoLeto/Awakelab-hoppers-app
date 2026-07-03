import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

async function checkSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  if (!payload) return false;
  return payload.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
}

export async function GET() {
  if (!(await checkSuperAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  await connectDB();
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  const users = await User.find({ email: { $ne: superadminEmail } })
    .select("name email country emailVerified diagnosticDone empScore createdAt")
    .sort({ createdAt: -1 })
    .lean();
  return Response.json({ users });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkSuperAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { id } = await request.json();
  if (!id) return Response.json({ error: "ID requerido." }, { status: 400 });
  await connectDB();
  await User.findByIdAndDelete(id);
  return Response.json({ success: true });
}
