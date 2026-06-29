import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { ADMIN_PASSWORD } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "No autorizado." }, { status: 403 });
    }

    await connectDB();
    const users = await User.find({}).select("-password").lean();
    return Response.json({ users });
  } catch (err) {
    console.error("[admin/users]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { password, email } = await request.json();
    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "No autorizado." }, { status: 403 });
    }
    if (!email) {
      return Response.json({ error: "Email requerido." }, { status: 400 });
    }

    await connectDB();
    const deleted = await User.findOneAndDelete({ email: email.toLowerCase() });
    if (!deleted) {
      return Response.json({ error: "Usuario no encontrado." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[admin/users DELETE]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
