import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return Response.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
    }

    await connectDB();

    const isEmail = identifier.includes("@");
    const escapedIdentifier = identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase() })
      : await User.findOne({ name: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } });

    if (!user) {
      return Response.json({ error: "No existe una cuenta con esas credenciales." }, { status: 401 });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, country: user.country });
    const cookieStore = await cookies();
    cookieStore.set("hoppers_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return Response.json({
      user: { name: user.name, email: user.email, country: user.country },
      isSuperAdmin: user.email.toLowerCase() === (process.env.SUPERADMIN_EMAIL || "").toLowerCase(),
      emailVerified: user.emailVerified ?? false,
    });
  } catch (err) {
    console.error("[login]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
