import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ error: "No existe una cuenta con ese email." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, country: user.country });
    const cookieStore = await cookies();
    cookieStore.set("hoppers_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ user: { name: user.name, email: user.email, country: user.country } });
  } catch (err) {
    console.error("[login]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
