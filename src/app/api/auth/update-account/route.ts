import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ error: "Token inválido." }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.id);
    if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });

    const body = await request.json();
    const { action } = body;

    if (action === "name") {
      const name = body.name?.trim();
      const { currentPassword } = body;
      if (!name) return Response.json({ error: "El nombre no puede estar vacío." }, { status: 400 });
      if (!currentPassword) return Response.json({ error: "Debes confirmar tu contraseña." }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return Response.json({ error: "La contraseña es incorrecta." }, { status: 400 });
      user.name = name;
      await user.save();
      return Response.json({ success: true, name });
    }

    if (action === "password") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword)
        return Response.json({ error: "Datos incompletos." }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid)
        return Response.json({ error: "La contraseña actual es incorrecta." }, { status: 400 });
      if (newPassword.length < 6)
        return Response.json({ error: "La nueva contraseña debe tener al menos 6 caracteres." }, { status: 400 });
      if (newPassword === currentPassword)
        return Response.json({ error: "La nueva contraseña debe ser diferente a la actual." }, { status: 400 });
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return Response.json({ success: true });
    }

    return Response.json({ error: "Acción no reconocida." }, { status: 400 });
  } catch (err) {
    console.error("[update-account]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
