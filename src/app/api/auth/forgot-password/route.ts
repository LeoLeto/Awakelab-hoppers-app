import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendPasswordResetEmail, logSmtpError } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to avoid user enumeration
    if (!user) return Response.json({ message: "Si existe una cuenta con ese email, recibirás un enlace." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken).catch((err) =>
      logSmtpError("email de recuperación de contraseña", err, user.email)
    );

    return Response.json({ message: "Si existe una cuenta con ese email, recibirás un enlace." });
  } catch (err) {
    console.error("[forgot-password]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
