import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { getTransporterForTest } from "@/lib/email";

async function checkSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  if (!payload) return false;
  return payload.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
}

export async function POST() {
  if (!(await checkSuperAdmin())) {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }
  try {
    const { transporter, configured } = await getTransporterForTest();
    if (!configured) {
      return Response.json({ error: "Guarda la configuración SMTP antes de verificar la conexión." }, { status: 400 });
    }
    await transporter.verify();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}
