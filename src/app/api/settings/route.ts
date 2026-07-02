import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { verifyToken } from "@/lib/jwt";
import { encrypt } from "@/lib/crypto";

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
  const s = await Settings.findOne().lean() as Record<string, unknown> | null;
  return Response.json({
    smtpFrom:   (s?.smtpFrom as string) ?? "",
    smtpHost:   (s?.smtpHost as string) ?? "",
    smtpPort:   (s?.smtpPort as number) ?? 587,
    smtpUser:   (s?.smtpUser as string) ?? "",
    smtpPassSet: !!s?.smtpPass,
    smtpSecure: (s?.smtpSecure as boolean) ?? false,
  });
}

export async function POST(request: NextRequest) {
  if (!(await checkSuperAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  const { smtpFrom, smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure } = await request.json();
  await connectDB();
  const update: Record<string, unknown> = {
    smtpFrom: smtpFrom ?? "",
    smtpHost: smtpHost ?? "",
    smtpPort: Number(smtpPort) || 587,
    smtpUser: smtpUser ?? "",
    smtpSecure: !!smtpSecure,
  };
  if (smtpPass) update.smtpPass = encrypt(smtpPass);
  await Settings.findOneAndUpdate({}, update, { upsert: true, new: true });
  return Response.json({ success: true });
}
