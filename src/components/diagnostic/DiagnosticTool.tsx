"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, LogIn, ShieldCheck } from "lucide-react";
import { countries } from "@/lib/data/countries";
import { roleLabels, targetRoleLabels } from "@/lib/data/sapProfiles";
import { recommendCertifications, SAP_CERTIFICATIONS, SAP_MODULE_GROUPS } from "@/lib/data/sapCertifications";
import { buildDiagnosticResult } from "@/lib/diagnostic";
import type { DiagnosticResult } from "@/lib/diagnostic";
import { nextEdition } from "@/lib/data/courses";
import { downloadDiagnosticPDF } from "@/lib/pdf";
import { getSession, initSession, registerUser, saveDiagnosticResult, getDiagnosticResult } from "@/lib/auth";
import { getProfile, saveProfile, saveProfileToDB, buildProfileFromDiagnostic } from "@/lib/profile";
import { useDiagnosticNav } from "@/app/diagnostico/DiagnosticNavContext";
import Link from "next/link";

type Phase = "chat" | "privacy_notice" | "user_data" | "email_verify" | "processing" | "result";

type ChatStep =
  | "experience"
  | "modules"
  | "current_role"
  | "target_role"
  | "has_certs"
  | "want_certs";

interface ChatMessage {
  from: "bot" | "user";
  content: string;
}


const STEP_BOT_MESSAGES: Record<ChatStep, string> = {
  experience: "¡Hola! Soy tu asistente de diagnóstico SAP. Voy a hacerte algunas preguntas para conocer tu perfil. ¿Cuántos años llevas trabajando con SAP?",
  modules: "¿Con qué módulos SAP has trabajado? Selecciona todos los que apliquen.",
  current_role: "¿Cuál es tu rol actual en el ecosistema SAP?",
  target_role: "¿Y cuál es el rol al que aspiras llegar?",
  has_certs: "¿Cuáles de estas certificaciones SAP ya tienes? Selecciona las que ya hayas obtenido.",
  want_certs: "¿Cuáles de estas certificaciones te gustaría obtener? Selecciona las que quieras cursar.",
};

export function DiagnosticTool() {
  const { setShowNav } = useDiagnosticNav();

  const [phase, setPhase] = useState<Phase>("privacy_notice");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatStep, setChatStep] = useState<ChatStep>("experience");
  const [textInput, setTextInput] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const [yearsExperience, setYearsExperience] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [certifications, setCertifications] = useState("");
  const [targetCertifications, setTargetCertifications] = useState("");
  const [hasCertIds, setHasCertIds] = useState<string[]>([]);
  const [wantCertIds, setWantCertIds] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [salary, setSalary] = useState("");

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [emailVerifyError, setEmailVerifyError] = useState(false);

  const pendingUserData = useRef<{ name: string; email: string; country: string; linkedin: string; salary: string; password?: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const session = getSession();
      if (session) {
        const stored = localStorage.getItem("hoppers_diag_result");
        if (stored) {
          try {
            setResult(JSON.parse(stored));
            setPhase("result");
            setShowNav(true);
            return;
          } catch {}
        }
        // Sin resultado local — intentar recuperar de MongoDB
        const remote = await getDiagnosticResult();
        if (remote) {
          localStorage.setItem("hoppers_diag_result", JSON.stringify(remote));
          setResult(remote as DiagnosticResult);
          setPhase("result");
          setShowNav(true);
          return;
        }
      }
      // No result — stays at privacy_notice (initial phase)
    }
    init();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function appendBotMessage(content: string) {
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", content }]);
    }, 400);
  }

  function advanceToStep(step: ChatStep) {
    setChatStep(step);
    appendBotMessage(STEP_BOT_MESSAGES[step]);
  }

  function handleExperienceSelect(value: string, label: string) {
    setYearsExperience(value);
    setMessages((prev) => [...prev, { from: "user", content: label }]);
    advanceToStep("modules");
  }

  function toggleModule(mod: string) {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  }

  function handleModulesConfirm() {
    if (selectedModules.length === 0) return;
    setModules(selectedModules);
    setMessages((prev) => [...prev, { from: "user", content: selectedModules.join(", ") }]);
    setSelectedModules([]);
    advanceToStep("current_role");
  }

  function handleCurrentRoleSelect(slug: string, label: string) {
    setCurrentRole(slug);
    setMessages((prev) => [...prev, { from: "user", content: label }]);
    advanceToStep("target_role");
  }

  function handleTargetRoleSelect(slug: string, label: string) {
    setTargetRole(slug);
    setMessages((prev) => [...prev, { from: "user", content: label }]);
    advanceToStep("has_certs");
  }

  function handleHasCertsConfirm() {
    const certNames = hasCertIds
      .map((id) => SAP_CERTIFICATIONS.find((c) => c.id === id)?.name ?? "")
      .filter(Boolean)
      .join(", ");
    setCertifications(certNames);
    const label =
      hasCertIds.length > 0
        ? `${hasCertIds.length} certificación${hasCertIds.length !== 1 ? "es" : ""}`
        : "Ninguna";
    setMessages((prev) => [...prev, { from: "user", content: label }]);
    advanceToStep("want_certs");
  }

  function handleWantCertsConfirm() {
    const certNames = wantCertIds
      .map((id) => SAP_CERTIFICATIONS.find((c) => c.id === id)?.name ?? "")
      .filter(Boolean)
      .join(", ");
    setTargetCertifications(certNames);
    const label =
      wantCertIds.length > 0
        ? `${wantCertIds.length} certificación${wantCertIds.length !== 1 ? "es" : ""}`
        : "Ninguna";
    setMessages((prev) => [...prev, { from: "user", content: label }]);
    setHasCertIds([]);
    setWantCertIds([]);
    setTimeout(() => setPhase("user_data"), 400);
  }

  async function onUserDataContinue(userData: { name: string; email: string; country: string; linkedin: string; salary: string; password?: string }) {
    if (registerLoading) return;
    pendingUserData.current = userData;
    setName(userData.name);
    setEmail(userData.email);
    setCountry(userData.country);
    setLinkedin(userData.linkedin);
    setSalary(userData.salary);
    setRegisterError("");

    // If already authenticated with this email, skip registration
    const session = getSession();
    if (session && session.email.toLowerCase() === userData.email.toLowerCase()) {
      await runProcessing(userData.name, userData.email, userData.country, userData.linkedin, userData.salary);
      return;
    }

    setRegisterLoading(true);
    const regResult = await registerUser({
      name: userData.name,
      email: userData.email,
      country: userData.country,
      currentRole,
      yearsExperience,
      sapModules: modules,
      certifications,
      linkedinUrl: userData.linkedin,
      targetRole,
      linkedin: userData.linkedin,
      salary: userData.salary,
      password: userData.password,
    });
    setRegisterLoading(false);

    if (regResult.success) {
      if (regResult.needsVerification) {
        setPhase("email_verify");
      } else {
        // Existing user re-authenticated — skip email verify
        await runProcessing(userData.name, userData.email, userData.country, userData.linkedin, userData.salary);
      }
    } else if (regResult.alreadyExists) {
      setRegisterError("__login_required__");
    } else {
      // Network / DB error — save session locally and continue
      initSession({ name: userData.name, email: userData.email, country: userData.country, loggedAt: new Date().toISOString() });
      await runProcessing(userData.name, userData.email, userData.country, userData.linkedin, userData.salary);
    }
  }

  async function onEmailVerifyContinue() {
    const ud = pendingUserData.current ?? { name, email, country, linkedin, salary };
    setEmailVerifyLoading(true);
    setEmailVerifyError(false);
    try {
      const res = await fetch(`/api/auth/check?email=${encodeURIComponent(ud.email)}&checkVerified=true`);
      const json = await res.json();
      if (!json.verified) {
        setEmailVerifyError(true);
        setEmailVerifyLoading(false);
        return;
      }
    } catch {
      setEmailVerifyError(true);
      setEmailVerifyLoading(false);
      return;
    }
    setEmailVerifyLoading(false);
    await runProcessing(ud.name, ud.email, ud.country, ud.linkedin, ud.salary);
  }

  async function runProcessing(userName: string, userEmail: string, userCountry: string, userLinkedin: string, userSalary: string) {
    setPhase("processing");

    const text = modules.join(" ") + " " + certifications + " " + currentRole + " " + targetRole;
    const diagResult = buildDiagnosticResult(text, yearsExperience);

    const diagResultWithMeta = {
      ...diagResult,
      modules,
      certifications,
      targetCertifications,
      currentRole,
      targetRole,
      yearsExperience,
      linkedin: userLinkedin,
      salary: userSalary,
    };
    localStorage.setItem("hoppers_diag_result", JSON.stringify(diagResultWithMeta));

    await saveDiagnosticResult({
      empScore: diagResult.empScore,
      topProfile: diagResult.topSlug,
      skills: diagResult.skills,
      fullResult: diagResultWithMeta,
      email: userEmail,
    });

    // Auto-sync profile with diagnostic data → localStorage + MongoDB
    const sessionNow = getSession();
    if (sessionNow) {
      const existingProfile = getProfile(sessionNow.email);
      const fromDiag = buildProfileFromDiagnostic(
        { name: userName, email: userEmail, country: userCountry },
        diagResultWithMeta as Record<string, unknown>,
      );
      const nonEmpty = (v: unknown) =>
        Array.isArray(v) ? (v as unknown[]).length > 0 : typeof v === "string" && (v as string).trim().length > 0;
      const merged = {
        ...existingProfile,
        ...Object.fromEntries(Object.entries(fromDiag).filter(([, v]) => nonEmpty(v))),
      } as import("@/lib/profile").HoppersProfileData;
      saveProfile(userEmail, merged);
      await saveProfileToDB(merged);
    }

    setResult(diagResult);
    setPhase("result");
    setShowNav(true);
  }

  function handleReset() {
    setPhase("privacy_notice");
    setMessages([]);
    setChatStep("experience");
    setTextInput("");
    setSelectedModules([]);
    setYearsExperience("");
    setModules([]);
    setCertifications("");
    setTargetCertifications("");
    setHasCertIds([]);
    setWantCertIds([]);
    setCurrentRole("");
    setTargetRole("");
    setLinkedin("");
    setSalary("");
    setName("");
    setEmail("");
    setCountry("");
    setResult(null);
    pendingUserData.current = null;
    setShowNav(false);
  }

  function handleDownloadPDF() {
    if (!result) return;
    const session = getSession();
    downloadDiagnosticPDF(result, session?.name ?? name, session?.email ?? email, session?.country ?? country);
  }

  function handleEmailSend() {
    if (!result) return;
    const body = encodeURIComponent(
      `Hola equipo Hoppers Academy,\n\nAcabo de completar mi diagnóstico profesional SAP y me gustaría recibir más información.\n\nPerfil detectado: ${result.matches[0]?.name}\nÍndice de empleabilidad: ${result.empScore}%\nHabilidades: ${result.skills.join(", ")}\n\nQuedo a vuestra disposición.\n\nSaludos`
    );
    window.location.href = `mailto:contacto@hoppers.academy?subject=Diagnóstico SAP - Solicito información&body=${body}`;
  }

  if (phase === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 border-4 border-hopper-red/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-hopper-red border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-hopper-black">Construyendo tu perfil...</p>
          <p className="text-sm text-gray-500">Analizando tu experiencia con 14.000+ ofertas de empleo</p>
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <DiagnosticResults
        result={result}
        onReset={handleReset}
        onDownload={handleDownloadPDF}
        onEmail={handleEmailSend}
      />
    );
  }

  if (phase === "privacy_notice") {
    return (
      <div className="overflow-y-auto" style={{ height: "calc(100dvh - 130px)" }}>
        <PrivacyNoticeScreen
          onContinue={() => {
            setMessages([{ from: "bot", content: STEP_BOT_MESSAGES.experience }]);
            setPhase("chat");
          }}
        />
      </div>
    );
  }

  if (phase === "user_data") {
    const session = getSession();
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 130px)" }}>
        {registerError && (
          <div className="max-w-md mx-auto mt-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 text-center space-y-2">
            <p className="font-semibold">Ya existe una cuenta con ese email.</p>
            <p className="text-amber-700">Para continuar con el diagnóstico tienes que iniciar sesión primero.</p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <a href="/login" className="font-semibold text-hopper-red hover:underline">Iniciar sesión →</a>
              <span className="text-amber-400">·</span>
              <a href="/olvidar-contrasena" className="text-amber-700 hover:underline">¿Olvidaste la contraseña?</a>
            </div>
          </div>
        )}
        {registerLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-hopper-red/20 border-t-hopper-red rounded-full animate-spin" />
          </div>
        ) : (
          <UserDataScreen
            defaultName={session?.name ?? ""}
            defaultEmail={session?.email ?? ""}
            defaultCountry={session?.country ?? ""}
            hasSession={!!session}
            onContinue={onUserDataContinue}
          />
        )}
      </div>
    );
  }

  if (phase === "email_verify") {
    return (
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 130px)" }}>
        <EmailVerifyScreen
          email={email}
          onContinue={onEmailVerifyContinue}
          onResend={async () => {
            await fetch("/api/auth/resend-verification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
          }}
          verifyLoading={emailVerifyLoading}
          verifyError={emailVerifyError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-2" style={{ height: "calc(100dvh - 130px)" }}>
      <div className="flex justify-end shrink-0">
        <Link
          href="/login?returnTo=/diagnostico"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-hopper-red transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Ya tengo cuenta. Entrar
        </Link>
      </div>
      <div className="border rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="bg-hopper-black text-white px-4 py-3 text-sm font-semibold flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 bg-hopper-red rounded-full flex items-center justify-center text-white text-xs font-bold">H</div>
          Diagnóstico SAP Guiado
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.from === "bot" && (
                <div className="w-7 h-7 bg-hopper-red rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">H</div>
              )}
              <div className={`rounded-lg px-3 py-2 text-sm max-w-xs lg:max-w-sm ${msg.from === "user" ? "bg-hopper-black text-white" : "bg-white border text-hopper-black"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t bg-white p-4 shrink-0">
          {chatStep === "experience" && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Sin experiencia", value: "0" },
                { label: "1-3 años", value: "1-3" },
                { label: "3-5 años", value: "3-5" },
                { label: "5-7 años", value: "5-7" },
                { label: "7+ años", value: "7+" },
              ].map((opt) => (
                <button key={opt.value} onClick={() => handleExperienceSelect(opt.value, opt.label)}
                  className="px-4 py-2 rounded-full border border-hopper-black text-sm font-medium hover:bg-hopper-black hover:text-white transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {chatStep === "modules" && (
            <div className="space-y-3">
              <div className="max-h-[180px] overflow-y-auto space-y-3 pr-1">
                {SAP_MODULE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-gray-400 mb-1.5">
                      {group.emoji} {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.modules.map((mod) => (
                        <button key={mod} onClick={() => toggleModule(mod)}
                          className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                            selectedModules.includes(mod)
                              ? "bg-hopper-red text-white border-hopper-red"
                              : "border-gray-300 text-gray-700 hover:border-hopper-red hover:text-hopper-red"
                          }`}>
                          {selectedModules.includes(mod) && <Check className="inline w-3 h-3 mr-1" />}
                          {mod}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleModulesConfirm} disabled={selectedModules.length === 0}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50">
                Confirmar selección ({selectedModules.length})
              </Button>
            </div>
          )}

          {(chatStep === "has_certs" || chatStep === "want_certs") && (() => {
            const allRecs = recommendCertifications(modules, currentRole, targetRole, yearsExperience, 14);
            const isHas = chatStep === "has_certs";
            const recs = isHas ? allRecs : allRecs.filter((c) => !hasCertIds.includes(c.id));
            const selected = isHas ? hasCertIds : wantCertIds;
            const setSelected = isHas ? setHasCertIds : setWantCertIds;
            const onConfirm = isHas ? handleHasCertsConfirm : handleWantCertsConfirm;

            if (!isHas && recs.length === 0) {
              return (
                <Button onClick={onConfirm} className="bg-hopper-red hover:bg-hopper-red/90 text-white">
                  Ninguna
                </Button>
              );
            }

            return (
              <div className="space-y-3">
                <div className="max-h-[160px] overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    {recs.map((cert) => {
                      const short = cert.name.replace(/^SAP Certified [^-]+ - /, "");
                      const sel = selected.includes(cert.id);
                      return (
                        <button
                          key={cert.id}
                          onClick={() =>
                            setSelected((prev) =>
                              prev.includes(cert.id) ? prev.filter((id) => id !== cert.id) : [...prev, cert.id]
                            )
                          }
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors text-left ${
                            sel
                              ? "bg-hopper-red text-white border-hopper-red"
                              : "border-gray-300 text-gray-700 hover:border-hopper-red hover:text-hopper-red"
                          }`}
                        >
                          {sel && <Check className="inline w-3 h-3 mr-1" />}
                          {short}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Button onClick={onConfirm} className="bg-hopper-red hover:bg-hopper-red/90 text-white">
                  {selected.length > 0 ? `Confirmar (${selected.length})` : "Ninguna"}
                </Button>
              </div>
            );
          })()}

          {chatStep === "current_role" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(roleLabels).map(([slug, label]) => (
                <button key={slug} onClick={() => handleCurrentRoleSelect(slug, label)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5 transition-colors text-left">
                  {label}
                </button>
              ))}
              <button onClick={() => handleCurrentRoleSelect("sin_rol", "Sin rol definido")}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors text-left">
                Sin rol definido
              </button>
            </div>
          )}

          {chatStep === "target_role" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(targetRoleLabels).map(([slug, label]) => (
                <button key={slug} onClick={() => handleTargetRoleSelect(slug, label)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5 transition-colors text-left">
                  {label}
                </button>
              ))}
              <button onClick={() => handleTargetRoleSelect("sin_rol", "Sin rol definido")}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors text-left">
                Sin rol definido
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function PrivacyNoticeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-between py-6 gap-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-hopper-black">Tus datos están seguros</h2>
        <p className="text-base text-gray-500">
          Antes de continuar, queremos que sepas cómo tratamos tu información.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {[
          {
            title: "Tratamiento anónimo",
            desc: "Tu información se procesa de forma anónima. No asociamos tus datos personales con tu perfil técnico.",
          },
          {
            title: "Datos confidenciales",
            desc: "Tu nombre, email y país se usan únicamente para enviarte tu informe personalizado.",
          },
          {
            title: "Datos sensibles protegidos",
            desc: "LinkedIn o salario se tratan con máxima confidencialidad y no se ceden a terceros sin consentimiento.",
          },
          {
            title: "No compartimos tu información",
            desc: "Nunca vendemos tus datos. Solo tú y Hoppers Academy tenéis acceso a tu diagnóstico.",
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-hopper-black">{item.title}</p>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onContinue} className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white py-3 text-base">
        Entendido, continuar →
      </Button>
    </div>
  );
}

const SALARY_OPTIONS = [
  "<25.000€",
  "25.000€ - 40.000€",
  "40.000€ - 55.000€",
  "55.000€ - 75.000€",
  ">75.000€",
];

function UserDataScreen({
  defaultName = "",
  defaultEmail = "",
  defaultCountry = "",
  hasSession = false,
  onContinue,
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultCountry?: string;
  hasSession?: boolean;
  onContinue: (data: { name: string; email: string; country: string; linkedin: string; salary: string; password?: string }) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [countrySearch, setCountrySearch] = useState(defaultCountry);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [linkedin, setLinkedin] = useState("");
  const [salary, setSalary] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showGdpr, setShowGdpr] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  const emailMatchesSession = hasSession && email.trim().toLowerCase() === defaultEmail.trim().toLowerCase();
  const needsPassword = !emailMatchesSession;
  const passwordMismatch = needsPassword && confirmPassword.length > 0 && password !== confirmPassword;
  const passwordTooShort = needsPassword && password.length > 0 && password.length < 8;
  const canProceed = name.trim() && email.trim() && selectedCountry && !emailExists && !nameExists &&
    (!needsPassword || (password.length >= 8 && password === confirmPassword));

  async function checkEmail(value: string) {
    if (!value.trim() || !value.includes("@")) { setEmailExists(false); return; }
    const res = await fetch(`/api/auth/check?email=${encodeURIComponent(value.trim())}`);
    const json = await res.json();
    setEmailExists(json.exists ?? false);
  }

  async function checkName(value: string) {
    if (!value.trim()) { setNameExists(false); return; }
    const res = await fetch(`/api/auth/check?name=${encodeURIComponent(value.trim())}`);
    const json = await res.json();
    setNameExists(json.exists ?? false);
  }

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto py-4 space-y-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-hopper-red/10 flex items-center justify-center text-2xl">
            🚀
          </div>
        </div>
        <h2 className="text-2xl font-black text-hopper-black">Casi listo</h2>
        <p className="text-sm text-gray-500">
          Te enviaremos el resultado del análisis a tu email personal.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-hopper-black">Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameExists(false); }}
            onBlur={(e) => { if (!hasSession) checkName(e.target.value); }}
            placeholder="Tu nombre completo"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red ${nameExists ? "border-amber-400" : ""}`}
          />
          {nameExists && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span>⚠</span> Ese nombre ya está registrado. ¿Eres tú?{" "}
              <a href="/login" className="font-semibold underline hover:no-underline">Inicia sesión</a>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-hopper-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailExists(false); }}
            onBlur={(e) => { if (!hasSession) checkEmail(e.target.value); }}
            placeholder="tu@email.com"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red ${emailExists ? "border-amber-400" : ""}`}
          />
          {emailExists && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span>⚠</span> Ese email ya tiene cuenta.{" "}
              <a href="/login" className="font-semibold underline hover:no-underline">Inicia sesión</a>
              {" "}o{" "}
              <a href="/olvidar-contrasena" className="underline hover:no-underline">restablece tu contraseña</a>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-hopper-black">País</label>
          <input type="text" value={countrySearch}
            onChange={(e) => { setCountrySearch(e.target.value); setSelectedCountry(""); }}
            placeholder="Busca tu país..."
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red" />
          {countrySearch && !selectedCountry && (
            <div className="border rounded-lg max-h-40 overflow-y-auto shadow-sm bg-white">
              {filteredCountries.slice(0, 10).map((c) => (
                <button key={c.code}
                  onClick={() => { setSelectedCountry(c.name); setCountrySearch(c.name); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-hopper-red/5 text-left">
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-hopper-black">
            LinkedIn <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/tu-perfil"
            className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red" />
        </div>

        {needsPassword && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-hopper-black">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red" />
              {passwordTooShort && <p className="text-xs text-red-500">Mínimo 8 caracteres</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-hopper-black">Confirmar contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-hopper-red/30 focus:border-hopper-red" />
              {passwordMismatch && <p className="text-xs text-red-500">Las contraseñas no coinciden</p>}
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-hopper-black">
            Salario actual bruto anual <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SALARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSalary(opt)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium text-center transition-colors ${
                  salary === opt
                    ? "bg-hopper-red text-white border-hopper-red"
                    : "border-gray-300 text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={() => setShowGdpr(true)} disabled={!canProceed}
        className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50">
        Ingresar →
      </Button>

      {showGdpr && (
        <GdprModal
          onAccept={() => {
            setShowGdpr(false);
            onContinue({ name: name.trim(), email: email.trim(), country: selectedCountry, linkedin: linkedin.trim(), salary, password: needsPassword ? password : undefined });
          }}
          onClose={() => setShowGdpr(false)}
        />
      )}
    </div>
  );
}

function GdprModal({ onAccept, onClose }: { onAccept: () => void; onClose: () => void }) {
  const [tratamiento, setTratamiento] = useState(false);
  const [comunicaciones, setComunicaciones] = useState(false);
  const [comparticion, setComparticion] = useState(false);

  const canAccept = tratamiento && comparticion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-hopper-black">Consentimiento RGPD</h3>
          <p className="text-sm text-gray-500">
            Para generar tu informe necesitamos tu consentimiento para procesar los datos proporcionados.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex gap-3 items-start cursor-pointer">
            <input type="checkbox" checked={tratamiento} onChange={(e) => setTratamiento(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0" />
            <div>
              <p className="text-sm font-semibold text-hopper-black">* Tratamiento de datos <span className="text-hopper-red">(requerido)</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Acepto que Hoppers Academy procese los datos proporcionados para generar mi informe personalizado de empleabilidad SAP, de acuerdo con su política de privacidad.</p>
            </div>
          </label>

          <label className="flex gap-3 items-start cursor-pointer">
            <input type="checkbox" checked={comunicaciones} onChange={(e) => setComunicaciones(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0" />
            <div>
              <p className="text-sm font-semibold text-hopper-black">Comunicaciones <span className="text-gray-400 font-normal">(opcional)</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Acepto recibir comunicaciones comerciales sobre formaciones, webinars y oportunidades laborales SAP de Hoppers Academy.</p>
            </div>
          </label>

          <label className="flex gap-3 items-start cursor-pointer">
            <input type="checkbox" checked={comparticion} onChange={(e) => setComparticion(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0" />
            <div>
              <p className="text-sm font-semibold text-hopper-black">* Compartición de datos <span className="text-hopper-red">(requerido)</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Acepto que mis datos puedan ser compartidos con empresas partners de Hoppers Academy que puedan estar interesadas en mi perfil profesional SAP.</p>
            </div>
          </label>
        </div>

        <p className="text-xs text-gray-400">* Los campos marcados son obligatorios.</p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1 text-gray-500">Cancelar</Button>
          <Button onClick={onAccept} disabled={!canAccept}
            className="flex-1 bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50">
            Aceptar y continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmailVerifyScreen({
  email,
  onContinue,
  onResend,
  verifyLoading,
  verifyError,
}: {
  email: string;
  onContinue: () => void;
  onResend: () => Promise<void>;
  verifyLoading?: boolean;
  verifyError?: boolean;
}) {
  const [resending, setResending] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  async function handleResend() {
    setResending(true);
    setResent(false);
    try {
      await onResend();
      setResent(true);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-6 text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-hopper-red/10 flex items-center justify-center">
          <Mail className="w-8 h-8 text-hopper-red" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-hopper-black">Verifica tu email</h2>
        <p className="text-sm text-gray-500">Te hemos enviado un email de verificación a:</p>
        <p className="font-bold text-hopper-black">{email}</p>
      </div>
      <p className="text-xs text-gray-400">
        Revisa tu bandeja de entrada (y la carpeta de spam). Haz clic en el enlace del email y luego vuelve aquí para continuar.
      </p>
      {verifyError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-left space-y-1">
          <p className="font-semibold">Todavía no hemos recibido la verificación.</p>
          <p className="text-amber-700">Haz clic en el enlace del email y vuelve a comprobar.</p>
        </div>
      )}
      {resent && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          Email reenviado. Revisa tu bandeja de entrada.
        </div>
      )}
      <Button
        onClick={onContinue}
        disabled={verifyLoading}
        className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8 disabled:opacity-60"
      >
        {verifyLoading ? "Comprobando..." : verifyError ? "Volver a comprobar →" : "Ya he verificado mi email →"}
      </Button>
      <button
        onClick={handleResend}
        disabled={resending}
        className="block w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
      >
        {resending ? "Enviando..." : "¿No lo recibiste? Reenviar email"}
      </button>
    </div>
  );
}

function DiagnosticResults({ result, onReset, onDownload, onEmail }: {
  result: DiagnosticResult;
  onReset: () => void;
  onDownload: () => void;
  onEmail: () => void;
}) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const scoreColor =
    result.empScore >= 80 ? "#10B981"
    : result.empScore >= 60 ? "#F59E0B"
    : result.empScore >= 40 ? "#F97316"
    : "#EF4444";

  const seniorityLabel: Record<string, string> = {
    junior: "Junior (0-3 años)",
    mid: "Intermedio (3-5 años)",
    senior: "Senior (5-7+ años)",
    architect: "Arquitecto / Lead (8+ años)",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <Card className="p-6 bg-hopper-black text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-gray-400">Índice de empleabilidad SAP</p>
            <p className="text-5xl font-black mt-1" style={{ color: scoreColor }}>{result.empScore}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Nivel detectado</p>
            <p className="text-sm font-semibold mt-1">{seniorityLabel[result.seniority]}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mt-2">{result.empDesc}</p>
        {result.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {result.skills.map((s) => (
              <span key={s} className="bg-hopper-red/20 text-hopper-red border border-hopper-red/30 text-xs px-2 py-0.5 rounded">{s}</span>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-hopper-black mb-4">Perfiles SAP compatibles</h3>
        <div className="space-y-3">
          {result.matches.map((m, i) => (
            <div key={m.slug} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-6">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{m.name}</span>
                  <span className="text-sm font-bold text-hopper-red">{m.matchPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-hopper-red rounded-full transition-all" style={{ width: `${m.matchPct}%` }} />
                </div>
                <div className="flex gap-3 mt-1">
                  {m.salaryES && <span className="text-xs text-gray-500">ES: {m.salaryES}</span>}
                  {m.salaryDE && <span className="text-xs text-gray-500">DE: {m.salaryDE}</span>}
                </div>
              </div>
              <Badge variant={m.demandLevel === "critical" ? "destructive" : "outline"} className="text-xs shrink-0">
                {m.demandLevel === "critical" ? "Crítica" : m.demandLevel === "high" ? "Alta" : "Media"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.salaryExpectations.filter((s) => s.salary !== "N/D").map((s) => (
          <Card key={s.country} className="p-4 text-center">
            <p className="text-2xl mb-1">{s.flag}</p>
            <p className="text-xs text-gray-500 mb-1">{s.country}</p>
            <p className="text-sm font-bold text-hopper-black">{s.salary}</p>
            <p className="text-xs text-gray-400">{result.seniority}</p>
          </Card>
        ))}
      </div>

      {result.recommendedCourses.length > 0 && (
        <Card className="p-5">
          <h3 className="font-bold text-hopper-black mb-1">Catálogo de cursos Hoppers Academy</h3>
          <p className="text-xs text-gray-400 mb-4">Los marcados en verde tienen fecha confirmada · Los más relevantes para tu perfil aparecen primero</p>
          <div className="space-y-3">
            {result.recommendedCourses.map((course) => {
              const next = nextEdition(course);
              const isProfileMatch = course.profiles.some((p) =>
                result.matches.slice(0, 3).map((m) => m.slug).includes(p)
              );
              return (
                <div key={course.id} className={`border rounded-lg p-3 flex flex-col gap-1 ${isProfileMatch ? "border-hopper-red/30 bg-hopper-red/5" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-hopper-black leading-tight">{course.name}</span>
                      {isProfileMatch && <span className="text-xs text-hopper-red font-medium">Recomendado</span>}
                    </div>
                    <span className="shrink-0 text-xs font-bold bg-hopper-black text-white rounded px-1.5 py-0.5">{course.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">{course.description}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {course.durationHours
                      ? <span className="text-xs text-gray-400">{course.durationHours}h</span>
                      : <span className="text-xs text-gray-400 italic">Duración por confirmar</span>}
                    {next ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        next.type === "confirmed" ? "bg-green-100 text-green-700"
                        : next.type === "webinar" ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        {next.type === "confirmed" ? "Próx. edición:" : next.type === "webinar" ? "Webinar previsto:" : "Edición privada:"}{" "}{next.period}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Fecha por confirmar</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {result.trainingGaps.length > 0 && (
        <Card className="p-5">
          <h3 className="font-bold text-hopper-black mb-3">Plan de formación recomendado</h3>
          <div className="space-y-3">
            {result.trainingGaps.slice(0, 5).map((g, i) => (
              <div key={g} className="flex gap-3 items-start">
                <span className="bg-hopper-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{g}</p>
                  <p className="text-xs text-gray-500">Disponible en Hoppers Academy</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={onDownload} className="bg-hopper-red hover:bg-hopper-red/90 text-white">Descargar informe PDF</Button>
        <Button variant="outline" onClick={onEmail}>Solicitar asesoría gratuita</Button>
        <Button variant="ghost" onClick={() => setConfirmingReset(true)}>Nuevo diagnóstico</Button>
      </div>

      {confirmingReset && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-900">¿Seguro que quieres hacer un nuevo diagnóstico?</p>
            <p className="text-xs text-amber-700">
              Tu informe actual se conservará y podrás recuperarlo iniciando sesión, pero se sustituirá por el nuevo cuando lo completes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onReset} className="bg-amber-600 hover:bg-amber-700 text-white">
              Sí, empezar de nuevo
            </Button>
            <Button size="sm" variant="outline" onClick={() => setConfirmingReset(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
