import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ error: "Token invalido." }, { status: 401 });

    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return Response.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
    }

    await connectDB();
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(payload.id, { password: hashed });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[password]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
