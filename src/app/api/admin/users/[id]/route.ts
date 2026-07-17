import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

async function checkAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  if (!payload) return false;
  const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  if (payload.email.toLowerCase() === superadminEmail) return true;
  await connectDB();
  const user = await User.findById(payload.id).select("isAdmin").lean() as { isAdmin?: boolean } | null;
  return user?.isAdmin === true;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { id } = await params;
  await connectDB();
  const user = await User.findById(id)
    .select("name email country emailVerified createdAt currentRole targetRole yearsExperience sapModules certifications targetCertifications salary linkedin diagnosticDone diagnosticDate empScore topProfile skills advisoryRequested advisoryDate")
    .lean();
  if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });
  return Response.json({ user });
}
