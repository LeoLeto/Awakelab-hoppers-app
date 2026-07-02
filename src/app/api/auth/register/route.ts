import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken, verifyToken } from "@/lib/jwt";
import { sendVerificationEmail, logSmtpError } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, email, country, currentRole, yearsExperience,
      sapModules, certifications, linkedinUrl, targetRole,
      linkedin, salary, password,
    } = body;

    if (!name || !email) {
      return Response.json({ error: "Nombre y email son obligatorios." }, { status: 400 });
    }

    await connectDB();

    const cookieStore = await cookies();
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      // Check if already authenticated via cookie (re-running diagnostic)
      const existingToken = cookieStore.get("hoppers_token")?.value;
      if (existingToken) {
        const payload = verifyToken(existingToken);
        if (payload && payload.email === existing.email) {
          return Response.json({ user: { name: existing.name, email: existing.email, country: existing.country } });
        }
      }

      // Require password to authenticate existing user
      if (!password) {
        return Response.json({ error: "Ya existe una cuenta con ese email. Inicia sesion.", alreadyExists: true }, { status: 409 });
      }
      const matches = await bcrypt.compare(password, existing.password);
      if (!matches) {
        return Response.json({ error: "Contraseña incorrecta.", alreadyExists: true }, { status: 401 });
      }

      const token = signToken({ id: existing._id.toString(), email: existing.email, name: existing.name, country: existing.country });
      cookieStore.set("hoppers_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7, secure: process.env.NODE_ENV === "production" });
      return Response.json({ user: { name: existing.name, email: existing.email, country: existing.country }, needsVerification: false, emailVerified: existing.emailVerified ?? false, isSuperAdmin: existing.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase() });
    }

    if (!password) {
      return Response.json({ error: "La contraseña es obligatoria." }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name, email: email.toLowerCase(), password: hashed,
      country: country || "", currentRole: currentRole || "",
      yearsExperience: yearsExperience || "", sapModules: sapModules || [],
      certifications: certifications || "", linkedinUrl: linkedinUrl || "",
      targetRole: targetRole || "", linkedin: linkedin || "",
      salary: salary || "",
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    sendVerificationEmail(user.email, user.name, verificationToken).catch((err) =>
      logSmtpError("email de verificación en registro", err, user.email)
    );

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, country: user.country });
    cookieStore.set("hoppers_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7, secure: process.env.NODE_ENV === "production" });

    return Response.json({ user: { name: user.name, email: user.email, country: user.country }, needsVerification: true, emailVerified: false, isSuperAdmin: user.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase() }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
