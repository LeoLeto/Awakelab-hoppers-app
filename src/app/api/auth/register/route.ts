import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, email, country, currentRole, yearsExperience,
      sapModules, certifications, linkedinUrl, targetRole,
      linkedin, salary,
    } = body;

    if (!name || !email) {
      return Response.json({ error: "Nombre y email son obligatorios." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      const token = signToken({ id: existing._id.toString(), email: existing.email, name: existing.name, country: existing.country });
      const cookieStore = await cookies();
      cookieStore.set("hoppers_token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return Response.json({
        user: { name: existing.name, email: existing.email, country: existing.country },
      });
    }

    const hashed = await bcrypt.hash(email + "hoppers", 10);
    const user = await User.create({
      name, email: email.toLowerCase(), password: hashed,
      country: country || "", currentRole: currentRole || "",
      yearsExperience: yearsExperience || "", sapModules: sapModules || [],
      certifications: certifications || "", linkedinUrl: linkedinUrl || "",
      targetRole: targetRole || "", linkedin: linkedin || "",
      salary: salary || "",
    });

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name, country: user.country });
    const cookieStore = await cookies();
    cookieStore.set("hoppers_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ user: { name: user.name, email: user.email, country: user.country } }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
