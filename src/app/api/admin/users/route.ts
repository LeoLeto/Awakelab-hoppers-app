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
