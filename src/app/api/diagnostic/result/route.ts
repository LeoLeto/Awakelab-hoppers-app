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
    const user = await User.findById(payload.id).select("diagnosticResult diagnosticDone");
    if (!user || !user.diagnosticDone || !user.diagnosticResult) {
      return Response.json({ result: null });
    }

    return Response.json({ result: user.diagnosticResult });
  } catch (err) {
    console.error("[diagnostic/result]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
