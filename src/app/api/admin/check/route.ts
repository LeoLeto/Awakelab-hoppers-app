import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ isAdmin: false });
    const payload = verifyToken(token);
    if (!payload) return Response.json({ isAdmin: false });
    const superadminEmail = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
    if (payload.email.toLowerCase() === superadminEmail) return Response.json({ isAdmin: true, isSuperAdmin: true });
    await connectDB();
    const user = await User.findById(payload.id).select("isAdmin");
    return Response.json({ isAdmin: !!user?.isAdmin, isSuperAdmin: false });
  } catch {
    return Response.json({ isAdmin: false });
  }
}
