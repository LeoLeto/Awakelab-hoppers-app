import { cookies } from "next/headers";
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

    const { empScore, topProfile, skills, fullResult, consents } = await request.json();
    // Consentimientos RGPD marcados en el modal del diagnóstico. Solo se guardan si llegan
    // completos (las 3 casillas como boolean); consentDate sirve como prueba de cuándo se dieron.
    // Si el alumno repite el diagnóstico, se sobrescriben con su última elección.
    const hasConsents = consents && typeof consents.treatment === "boolean" && typeof consents.communications === "boolean" && typeof consents.sharing === "boolean";

    await connectDB();
    await User.findByIdAndUpdate(payload.id, {
      diagnosticDone: true,
      diagnosticDate: new Date(),
      empScore,
      topProfile,
      skills,
      ...(fullResult ? { diagnosticResult: fullResult } : {}),
      ...(hasConsents ? {
        consentTreatment: consents.treatment,
        consentCommunications: consents.communications,
        consentSharing: consents.sharing,
        consentDate: new Date(),
      } : {}),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[diagnostic/save]", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
