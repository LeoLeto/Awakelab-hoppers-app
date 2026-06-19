import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return Response.json({ error: "Email y nombre son obligatorios." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ error: "No existe una cuenta con ese email." }, { status: 401 });
    }

    const nameMatches = user.name.trim().toLowerCase() === name.trim().toLowerCase();
    if (!nameMatches) {
      return Response.json({ error: "El nombre no coincide con el registrado." }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, country: user.country });
    const cookieStore = await cookies();
    cookieStore.set("hoppers_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({
      user: { name: user.name, email: user.email, country: user.country },
      diagnosticResult: user.diagnosticResult ?? null,
    });
  } catch (err) {
    console.error("[login]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
