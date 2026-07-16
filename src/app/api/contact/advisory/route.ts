import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { decrypt, isEncrypted } from "@/lib/crypto";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("hoppers_token")?.value;
  if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return Response.json({ error: "Sesión inválida." }, { status: 401 });

  const { subject, body } = await request.json();
  if (!subject || !body) return Response.json({ error: "Asunto y mensaje son obligatorios." }, { status: 400 });

  try {
    await connectDB();
    const s = await Settings.findOne().lean() as Record<string, unknown> | null;
    if (!s?.smtpHost || !s?.smtpUser || !s?.smtpPass) {
      return Response.json({ error: "SMTP no configurado." }, { status: 503 });
    }
    const pass = isEncrypted(s.smtpPass as string) ? decrypt(s.smtpPass as string) : s.smtpPass as string;
    const transporter = nodemailer.createTransport({
      host: s.smtpHost as string,
      port: (s.smtpPort as number) || 587,
      secure: (s.smtpSecure as boolean) ?? false,
      auth: { user: s.smtpUser as string, pass },
      tls: { minVersion: "TLSv1.2" },
    });

    const from = (s.smtpFrom as string) || `"Hoppers Academy" <${s.smtpUser}>`;
    const userName = payload.name || payload.email;

    await transporter.sendMail({
      from,
      to: "comunidad@hoppers.academy",
      replyTo: `"${userName}" <${payload.email}>`,
      subject,
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#000A1A;padding:28px 40px;">
          <img src="https://hoppers.awakelab.world/landingpage/logo-hoppers1.svg" alt="Hoppers" height="32" style="display:block;" />
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#0a0a0a;">Nueva solicitud de asesoría</h2>
          <p style="margin:0 0 24px;font-size:13px;color:#888;">De: <strong>${userName}</strong> &lt;${payload.email}&gt;</p>
          <div style="background:#f8f8f8;border-radius:8px;padding:20px;font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;">${body}</div>
          <p style="margin:20px 0 0;font-size:13px;color:#888;">Responde a este email para contactar directamente con <strong>${userName}</strong>.</p>
        </td></tr>
        <tr><td style="border-top:1px solid #f0f0f0;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#ccc;">&copy; ${new Date().getFullYear()} Hoppers Academy · hoppers.awakelab.world</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[advisory]", err);
    return Response.json({ error: "Error al enviar el email." }, { status: 500 });
  }
}
