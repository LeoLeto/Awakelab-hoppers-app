import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";
import { decrypt, isEncrypted } from "@/lib/crypto";

type SmtpError = Error & { code?: string; responseCode?: number; response?: string; command?: string };

export function logSmtpError(context: string, err: unknown, to?: string): void {
  const e = err as SmtpError;
  const response: string = e.response ?? "";
  const code = e.code ?? "";
  const responseCode = e.responseCode ?? 0;

  console.error(`\n[SMTP] ❌ Fallo en: ${context}${to ? ` → ${to}` : ""}`);

  if (code === "EAUTH" || responseCode === 535) {
    if (response.includes("5.7.139")) {
      console.error("[SMTP] Causa: SMTP AUTH desactivado para este buzón en Microsoft 365");
      console.error("[SMTP] Solución: Activar 'SMTP autenticado' en admin.microsoft.com → Usuarios → Correo → Gestionar aplicaciones de correo");
    } else {
      console.error("[SMTP] Causa: Credenciales incorrectas (usuario o contraseña)");
      console.error("[SMTP] Solución: Verificar SMTP_USER y SMTP_PASS en .env.local o en el panel de Configuraciones");
    }
  } else if (code === "ECONNECTION" || code === "ECONNREFUSED") {
    console.error("[SMTP] Causa: No se puede conectar al servidor SMTP");
    console.error("[SMTP] Solución: Verificar SMTP_HOST y SMTP_PORT (host incorrecto, puerto bloqueado o sin internet)");
  } else if (code === "ETIMEDOUT" || code === "ESOCKET") {
    console.error("[SMTP] Causa: Timeout de conexión al servidor SMTP");
    console.error("[SMTP] Solución: El servidor no responde. Comprobar host/puerto y que no haya firewall bloqueando");
  } else if (responseCode === 550 || response.includes("5.1.")) {
    console.error("[SMTP] Causa: Dirección de destinatario rechazada por el servidor");
    console.error(`[SMTP] Destinatario problemático: ${to ?? "(desconocido)"}`);
  } else if (responseCode === 553 || response.includes("5.7.1")) {
    console.error("[SMTP] Causa: El servidor rechaza el remitente (from) — no coincide con el usuario autenticado");
    console.error("[SMTP] Solución: Asegurarse de que smtpFrom usa el mismo dominio que el usuario SMTP");
  } else if (code === "EENVELOPE") {
    console.error("[SMTP] Causa: Dirección de remitente o destinatario con formato inválido");
  } else {
    console.error(`[SMTP] Código: ${code || "(sin código)"} | HTTP: ${responseCode || "(sin código)"}`);
    console.error(`[SMTP] Respuesta del servidor: ${response || e.message}`);
  }
  console.error("[SMTP] Error completo:", e.message, "\n");
}

type DbSettings = {
  smtpFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
};

export async function getTransporterForTest(): Promise<{ transporter: ReturnType<typeof nodemailer.createTransport>; configured: boolean }> {
  try {
    await connectDB();
    const s = await Settings.findOne().lean() as DbSettings | null;
    if (s?.smtpHost && s?.smtpUser && s?.smtpPass) {
      const pass = isEncrypted(s.smtpPass) ? decrypt(s.smtpPass) : s.smtpPass;
      return {
        configured: true,
        transporter: nodemailer.createTransport({
          host: s.smtpHost,
          port: s.smtpPort || 587,
          secure: s.smtpSecure ?? false,
          auth: { user: s.smtpUser, pass },
          tls: { minVersion: "TLSv1.2" },
        }),
      };
    }
  } catch {}
  return { configured: false, transporter: nodemailer.createTransport({}) };
}

async function getTransporter(): Promise<{ transporter: ReturnType<typeof nodemailer.createTransport>; from: string }> {
  try {
    await connectDB();
    const s = await Settings.findOne().lean() as DbSettings | null;
    if (s?.smtpHost && s?.smtpUser && s?.smtpPass) {
      const pass = isEncrypted(s.smtpPass) ? decrypt(s.smtpPass) : s.smtpPass;
      return {
        transporter: nodemailer.createTransport({
          host: s.smtpHost,
          port: s.smtpPort || 587,
          secure: s.smtpSecure ?? false,
          auth: { user: s.smtpUser, pass },
          tls: { minVersion: "TLSv1.2" },
        }),
        from: s.smtpFrom || `"Hoppers Academy" <${s.smtpUser}>`,
      };
    }
  } catch {}
  return {
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { minVersion: "TLSv1.2" },
    }),
    from: `"Hoppers Academy" <${process.env.SMTP_USER}>`,
  };
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const { transporter, from } = await getTransporter();
  const url = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
  const firstName = name.split(" ")[0];

  await transporter.sendMail({
    from,
    to,
    subject: "Verifica tu email — Hoppers Academy",
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verifica tu email</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#000A1A;padding:32px 40px;text-align:center;">
              <img src="https://hoppers.academy/landingpage/logo-hoppers1.svg" alt="Hoppers" height="36" style="display:block;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 12px;font-size:24px;color:#0a0a0a;font-weight:700;">Hola, ${firstName} 👋</h1>
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
                Gracias por registrarte en <strong>Hoppers Academy</strong>. Solo necesitamos confirmar que este email te pertenece.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#444;line-height:1.6;">
                Haz clic en el botón de abajo para verificar tu cuenta. El enlace expira en <strong>24 horas</strong>.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="border-radius:8px;background:#c0392b;">
                    <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Verificar mi email →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#888;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="margin:0;font-size:12px;color:#aaa;word-break:break-all;">${url}</p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#bbb;">
                Si no te has registrado en Hoppers Academy, puedes ignorar este email.<br />
                &copy; ${new Date().getFullYear()} Hoppers Academy · Better. Smarter. Hoppers.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const { transporter, from } = await getTransporter();
  const url = `${process.env.APP_URL}/nueva-contrasena?token=${token}`;
  const firstName = name.split(" ")[0];

  await transporter.sendMail({
    from,
    to,
    subject: "Restablecer contraseña — Hoppers Academy",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Restablecer contraseña</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:#000A1A;padding:32px 40px;text-align:center;">
          <img src="https://hoppers.academy/landingpage/logo-hoppers1.svg" alt="Hoppers" height="36" style="display:block;margin:0 auto;" />
        </td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 12px;font-size:24px;color:#0a0a0a;font-weight:700;">Hola, ${firstName}</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva.
          </p>
          <p style="margin:0 0 32px;font-size:13px;color:#888;">El enlace expira en <strong>1 hora</strong>. Si no solicitaste esto, ignora este email.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
            <tr><td style="border-radius:8px;background:#c0392b;">
              <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                Restablecer contraseña →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#888;">Si el botón no funciona:</p>
          <p style="margin:0;font-size:12px;color:#aaa;word-break:break-all;">${url}</p>
        </td></tr>
        <tr><td style="border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#bbb;">
            &copy; ${new Date().getFullYear()} Hoppers Academy · Better. Smarter. Hoppers.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
