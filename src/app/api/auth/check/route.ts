import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const name = request.nextUrl.searchParams.get("name");

  if (!email && !name) {
    return Response.json({ error: "Parámetro requerido." }, { status: 400 });
  }

  try {
    await connectDB();

    const checkVerified = request.nextUrl.searchParams.get("checkVerified");
    if (email && checkVerified) {
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select("emailVerified").lean();
      return Response.json({ verified: (user as { emailVerified?: boolean } | null)?.emailVerified === true });
    }

    if (email) {
      const exists = await User.exists({ email: email.toLowerCase().trim() });
      return Response.json({ exists: !!exists });
    }

    if (name) {
      const escapedName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const exists = await User.exists({ name: { $regex: new RegExp(`^${escapedName}$`, "i") } });
      return Response.json({ exists: !!exists });
    }
  } catch {
    return Response.json({ exists: false });
  }
}
