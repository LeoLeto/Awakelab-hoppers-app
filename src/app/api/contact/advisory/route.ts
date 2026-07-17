import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import User from "@/lib/models/User";
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
    const adminEmails = Array.isArray(s.adminEmails) ? (s.adminEmails as string[]) : [];
    const superadminEmail = process.env.SUPERADMIN_EMAIL || "";
    const bccList = [...new Set([...adminEmails, ...(superadminEmail ? [superadminEmail] : [])])];
    const bcc = bccList.length ? bccList.join(",") : undefined;
    const userName = payload.name || payload.email;

    await User.findByIdAndUpdate(payload.id, { advisoryRequested: true, advisoryDate: new Date() });

    await transporter.sendMail({
      from,
      to: "comunidad@hoppers.academy",
      ...(bcc ? { bcc } : {}),
      replyTo: `"${userName}" <${payload.email}>`,
      subject,
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#000A1A;padding:24px 36px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">HOPPERS <span style="color:#c0392b;">ACADEMY</span></p>
          </td>
        </tr>
        <!-- Badge -->
        <tr>
          <td style="background:#c0392b;padding:10px 36px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:2px;">Nueva solicitud de asesor&#237;a</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#0a0a0a;">De: ${userName}</p>
            <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#888888;">${payload.email}</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="background:#f8f8f8;border-left:3px solid #c0392b;padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.7;">
                ${body.replace(/\n/g, "<br/>")}
              </td></tr>
            </table>
            <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#888888;">Responde a este email para contactar directamente con <strong>${userName}</strong>.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #eeeeee;padding:16px 36px;text-align:center;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#bbbbbb;">&copy; ${new Date().getFullYear()} Hoppers Academy &middot; hoppers.awakelab.world</p>
          </td>
        </tr>
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
