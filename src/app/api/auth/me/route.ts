import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ error: "Token invalido." }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.id).select("-password");
    if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });

    return Response.json({ user });
  } catch (err) {
    console.error("[me]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
