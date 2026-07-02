import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendVerificationEmail, logSmtpError } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

    await connectDB();

    const genericOk = Response.json({ message: "Si existe una cuenta pendiente de verificación, recibirás un email." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.emailVerified) return genericOk;

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken).catch((err) =>
      logSmtpError("reenvío de email de verificación", err, user.email)
    );

    return Response.json({ message: "Si existe una cuenta pendiente de verificación, recibirás un email." });
  } catch (err) {
    console.error("[resend-verification]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
