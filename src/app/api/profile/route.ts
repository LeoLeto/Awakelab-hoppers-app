import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyToken } from "@/lib/jwt";
import type { HoppersProfileData } from "@/lib/profile";

const PROFILE_FIELDS = [
  "name", "country", "phone", "city", "bio", "education",
  "languages", "availability", "jobPreferences", "portfolio",
  "photo", "salary", "linkedin", "sapModules", "certifications",
  "currentRole", "targetRole", "yearsExperience",
];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ error: "Token inválido." }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.id).select(PROFILE_FIELDS.join(" ")).lean();
    if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });

    return Response.json({ profile: user });
  } catch (err) {
    console.error("[profile/GET]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("hoppers_token")?.value;
    if (!token) return Response.json({ error: "No autenticado." }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return Response.json({ error: "Token inválido." }, { status: 401 });

    const body: Partial<HoppersProfileData> = await request.json();

    // Only allow updating safe profile fields (never email/password)
    const update: Record<string, unknown> = {};
    const allowed = [
      "name", "country", "phone", "city", "bio", "education",
      "languages", "availability", "jobPreferences", "portfolio",
      "photo", "salary", "linkedin", "sapModules", "certifications",
      "currentRole", "targetRole", "yearsExperience",
    ];
    for (const key of allowed) {
      if (key in body) update[key] = body[key as keyof HoppersProfileData];
    }

    await connectDB();
    await User.findByIdAndUpdate(payload.id, update);

    return Response.json({ success: true });
  } catch (err) {
    console.error("[profile/POST]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
