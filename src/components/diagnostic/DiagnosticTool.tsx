"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, LogIn } from "lucide-react";
import { countries } from "@/lib/data/countries";
import { roleLabels } from "@/lib/data/sapProfiles";
import { buildDiagnosticResult } from "@/lib/diagnostic";
import type { DiagnosticResult, HoppersCourse } from "@/lib/diagnostic";
import { nextEdition } from "@/lib/data/courses";
import { downloadDiagnosticPDF } from "@/lib/pdf";
import { getSession, registerUser, saveDiagnosticResult } from "@/lib/auth";
import { useDiagnosticNav } from "@/app/diagnostico/DiagnosticNavContext";
import Link from "next/link";

type Phase = "chat" | "email_verify" | "gdpr_consent" | "processing" | "result";

type ChatStep =
  | "experience"
  | "modules"
  | "certifications"
  | "cert_input"
  | "current_role"
  | "target_role"
  | "linkedin"
  | "linkedin_input"
  | "name"
  | "email"
  | "country";

interface ChatMessage {
  from: "bot" | "user";
  content: string;
}

const SAP_MODULES = [
  "FI/CO",
  "SD",
  "MM",
  "PP",
  "ABAP",
  "Basis",
  "S/4HANA Cloud",
  "S/4HANA Migration",
  "EWM/TM",
  "SuccessFactors",
  "BTP",
  "PI/PO/CPI",
  "Security/GRC",
  "SAC",
  "Otro",
];

const STEP_BOT_MESSAGES: Record<ChatStep, string> = {
  experience:
    "¡Hola! Soy tu asistente de diagnóstico SAP. Voy a hacerte algunas preguntas para conocer tu perfil. ¿Cuántos años llevas trabajando con SAP?",
  modules: "¿Con qué módulos SAP has trabajado? Selecciona todos los que apliquen.",
  certifications: "¿Tienes certificaciones SAP?",
  cert_input: "¿Cuáles son tus certificaciones? Escríbelas a continuación.",
  current_role: "¿Cuál es tu rol actual en el ecosistema SAP?",
  target_role: "¿Y cuál es el rol al que aspiras llegar?",
  linkedin: "¿Te gustaría vincular tu perfil de LinkedIn?",
  linkedin_input: "Escribe el enlace de tu perfil de LinkedIn.",
  name: "Para crear tu cuenta, ¿cuál es tu nombre completo?",
  email: "¿Cuál es tu email profesional?",
  country: "¿En qué país te encuentras?",
};

export function DiagnosticTool() {
  const { setShowNav } = useDiagnosticNav();

  const [phase, setPhase] = useState<Phase>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatStep, setChatStep] = useState<ChatStep>("experience");
  const [textInput, setTextInput] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const [yearsExperience, setYearsExperience] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [certifications, setCertifications] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    }
    setMessages([{ from: "bot", content: STEP_BOT_MESSAGES.experience }]);
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
    setMessages((prev) => [
      ...prev,
      { from: "user", content: selectedModules.join(", ") },
    ]);
    setSelectedModules([]);
    advanceToStep("certifications");
  }

  function handleCertificationsYes() {
    setMessages((prev) => [...prev, { from: "user", content: "Sí" }]);
    advanceToStep("cert_input");
  }

  function handleCertificationsNo() {
    setCertifications("");
    setMessages((prev) => [...prev, { from: "user", content: "No" }]);
    advanceToStep("current_role");
  }

  function handleCertInputSubmit() {
    if (!textInput.trim()) return;
    setCertifications(textInput.trim());
    setMessages((prev) => [...prev, { from: "user", content: textInput.trim() }]);
    setTextInput("");
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
    advanceToStep("linkedin");
  }

  function handleLinkedinYes() {
    setMessages((prev) => [...prev, { from: "user", content: "Sí" }]);
    advanceToStep("linkedin_input");
  }

  function handleLinkedinNo() {
    setLinkedin("");
    setMessages((prev) => [...prev, { from: "user", content: "No" }]);
    advanceToStep("name");
  }

  function handleLinkedinInputSubmit() {
    if (!textInput.trim()) return;
    setLinkedin(textInput.trim());
    setMessages((prev) => [...prev, { from: "user", content: textInput.trim() }]);
    setTextInput("");
    advanceToStep("name");
  }

  function handleNameSubmit() {
    if (!textInput.trim()) return;
    setName(textInput.trim());
    setMessages((prev) => [...prev, { from: "user", content: textInput.trim() }]);
    setTextInput("");
    advanceToStep("email");
  }

  function handleEmailSubmit() {
    if (!textInput.trim()) return;
    setEmail(textInput.trim());
    setMessages((prev) => [...prev, { from: "user", content: textInput.trim() }]);
    setTextInput("");
    advanceToStep("country");
  }

  function handleCountrySelect(countryName: string) {
    setCountry(countryName);
    setMessages((prev) => [...prev, { from: "user", content: countryName }]);
    setTimeout(() => {
      setPhase("email_verify");
    }, 800);
  }

  async function onEmailVerifyContinue() {
    setPhase("processing");
    const text =
      modules.join(" ") + " " + certifications + " " + currentRole + " " + targetRole;
    const diagResult = buildDiagnosticResult(text, yearsExperience);

    const registerResult = await registerUser({
      name,
      email,
      country,
      currentRole,
      yearsExperience,
      sapModules: modules,
      certifications,
      linkedinUrl: linkedin,
      targetRole,
    });

    if (!registerResult.success) {
      localStorage.setItem(
        "hoppers_session",
        JSON.stringify({
          name,
          email,
          country,
          loggedAt: new Date().toISOString(),
        })
      );
    }

    localStorage.setItem("hoppers_diag_result", JSON.stringify(diagResult));

    await saveDiagnosticResult({
      empScore: diagResult.empScore,
      topProfile: diagResult.topSlug,
      skills: diagResult.skills,
      fullResult: diagResult,
    });

    setResult(diagResult);
    setPhase("result");
    setShowNav(true);
  }

  function handleReset() {
    localStorage.removeItem("hoppers_diag_result");
    setPhase("chat");
    setMessages([{ from: "bot", content: STEP_BOT_MESSAGES.experience }]);
    setChatStep("experience");
    setTextInput("");
    setSelectedModules([]);
    setYearsExperience("");
    setModules([]);
    setCertifications("");
    setCurrentRole("");
    setTargetRole("");
    setLinkedin("");
    setName("");
    setEmail("");
    setCountry("");
    setResult(null);
    setEmailVerifyLoading(false);
    setShowNav(false);
  }

  function handleDownloadPDF() {
    if (!result) return;
    const session = getSession();
    downloadDiagnosticPDF(
      result,
      session?.name ?? name,
      session?.email ?? email,
      session?.country ?? country
    );
  }

  function handleEmailSend() {
    if (!result) return;
    const body = encodeURIComponent(
      `Hola equipo Hoppers Academy,\n\nAcabo de completar mi diagnóstico profesional SAP y me gustaría recibir más información.\n\nPerfil detectado: ${result.matches[0]?.name}\nÍndice de empleabilidad: ${result.empScore}%\nHabilidades: ${result.skills.join(", ")}\n\nQuedo a vuestra disposición.\n\nSaludos`
    );
    window.location.href = `mailto:info@hoppers.academy?subject=Diagnóstico SAP - Solicito información&body=${body}`;
  }

  if (phase === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-16 h-16 border-4 border-hopper-red border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-lg font-bold text-hopper-black">Analizando tu perfil SAP...</p>
          <p className="text-sm text-gray-500 mt-1">
            Cruzando con 14.000+ ofertas de empleo en tiempo real
          </p>
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

  if (phase === "email_verify") {
    return (
      <EmailVerifyScreen
        email={email}
        loading={emailVerifyLoading}
        onContinue={() => setPhase("gdpr_consent")}
      />
    );
  }

  if (phase === "gdpr_consent") {
    return (
      <GdprConsentScreen
        onContinue={() => {
          setEmailVerifyLoading(true);
          onEmailVerifyContinue();
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="flex justify-end">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-hopper-red transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Ya tengo cuenta. Entrar
        </Link>
      </div>
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-hopper-black text-white px-4 py-3 text-sm font-semibold flex items-center gap-2">
          <div className="w-6 h-6 bg-hopper-red rounded-full flex items-center justify-center text-white text-xs font-bold">
            H
          </div>
          Diagnóstico SAP Guiado
        </div>

        <div className="p-4 min-h-[320px] max-h-[440px] overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {msg.from === "bot" && (
                <div className="w-7 h-7 bg-hopper-red rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  H
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-xs lg:max-w-sm ${
                  msg.from === "user"
                    ? "bg-hopper-black text-white"
                    : "bg-white border text-hopper-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t bg-white p-4">
          {chatStep === "experience" && (
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Sin experiencia", value: "0" },
                { label: "1-3 años", value: "1-3" },
                { label: "3-5 años", value: "3-5" },
                { label: "5-7 años", value: "5-7" },
                { label: "7+ años", value: "7+" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleExperienceSelect(opt.value, opt.label)}
                  className="px-4 py-2 rounded-full border border-hopper-black text-sm font-medium hover:bg-hopper-black hover:text-white transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {chatStep === "modules" && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {SAP_MODULES.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => toggleModule(mod)}
                    className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                      selectedModules.includes(mod)
                        ? "bg-hopper-red text-white border-hopper-red"
                        : "border-gray-300 text-gray-700 hover:border-hopper-red hover:text-hopper-red"
                    }`}
                  >
                    {selectedModules.includes(mod) && (
                      <Check className="inline w-3 h-3 mr-1" />
                    )}
                    {mod}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleModulesConfirm}
                disabled={selectedModules.length === 0}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
              >
                Confirmar selección ({selectedModules.length})
              </Button>
            </div>
          )}

          {chatStep === "certifications" && (
            <div className="flex gap-3">
              <button
                onClick={handleCertificationsYes}
                className="flex-1 py-3 rounded-lg border-2 border-green-500 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors"
              >
                ✓ Sí
              </button>
              <button
                onClick={handleCertificationsNo}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                ✗ No
              </button>
            </div>
          )}

          {chatStep === "cert_input" && (
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCertInputSubmit()}
                placeholder="Ej: SAP S/4HANA Finance, SAP SD..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-hopper-red"
              />
              <Button
                onClick={handleCertInputSubmit}
                disabled={!textInput.trim()}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
              >
                Enviar
              </Button>
            </div>
          )}

          {chatStep === "current_role" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(roleLabels).map(([slug, label]) => (
                <button
                  key={slug}
                  onClick={() => handleCurrentRoleSelect(slug, label)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5 transition-colors text-left"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => handleCurrentRoleSelect("sin_rol", "Sin rol definido")}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors text-left"
              >
                Sin rol definido
              </button>
            </div>
          )}

          {chatStep === "target_role" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(roleLabels).map(([slug, label]) => (
                <button
                  key={slug}
                  onClick={() => handleTargetRoleSelect(slug, label)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5 transition-colors text-left"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => handleTargetRoleSelect("sin_rol", "Sin rol definido")}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors text-left"
              >
                Sin rol definido
              </button>
            </div>
          )}

          {chatStep === "linkedin" && (
            <div className="flex gap-3">
              <button
                onClick={handleLinkedinYes}
                className="flex-1 py-3 rounded-lg border-2 border-blue-500 text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                ✓ Sí
              </button>
              <button
                onClick={handleLinkedinNo}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                ✗ No
              </button>
            </div>
          )}

          {chatStep === "linkedin_input" && (
            <div className="flex gap-2">
              <input
                type="url"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLinkedinInputSubmit()}
                placeholder="https://linkedin.com/in/tu-perfil"
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-hopper-red"
              />
              <Button
                onClick={handleLinkedinInputSubmit}
                disabled={!textInput.trim()}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
              >
                Enviar
              </Button>
            </div>
          )}

          {chatStep === "name" && (
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="Tu nombre completo"
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-hopper-red"
              />
              <Button
                onClick={handleNameSubmit}
                disabled={!textInput.trim()}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
              >
                Enviar
              </Button>
            </div>
          )}

          {chatStep === "email" && (
            <div className="flex gap-2">
              <input
                type="email"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                placeholder="tu@email.com"
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-hopper-red"
              />
              <Button
                onClick={handleEmailSubmit}
                disabled={!textInput.trim()}
                className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
              >
                Enviar
              </Button>
            </div>
          )}

          {chatStep === "country" && (
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:border-hopper-red hover:text-hopper-red hover:bg-hopper-red/5 transition-colors"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmailVerifyScreen({
  email,
  loading,
  onContinue,
}: {
  email: string;
  loading: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-5">
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
        Revisa tu bandeja de entrada (y la carpeta de spam). Una vez verificado, podrás acceder a tu
        diagnóstico personalizado.
      </p>
      <Button
        onClick={onContinue}
        disabled={loading}
        className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8"
      >
        {loading ? "Procesando..." : "Continuar →"}
      </Button>
    </div>
  );
}

function GdprConsentScreen({ onContinue }: { onContinue: () => void }) {
  const [tratamiento, setTratamiento] = useState(false);
  const [comunicaciones, setComunicaciones] = useState(false);
  const [comparticion, setComparticion] = useState(false);

  const canContinue = tratamiento && comparticion;

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-hopper-black">Consentimiento RGPD</h2>
        <p className="text-sm text-gray-500">
          Para generar tu informe de empleabilidad SAP personalizado, necesitamos tu consentimiento
          para procesar los datos que nos has proporcionado.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex gap-3 items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={tratamiento}
            onChange={(e) => setTratamiento(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-hopper-black">
              * Tratamiento de datos <span className="text-hopper-red">(requerido)</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acepto que Hoppers Academy procese los datos proporcionados para generar mi informe
              personalizado de empleabilidad SAP, de acuerdo con su política de privacidad.
            </p>
          </div>
        </label>

        <label className="flex gap-3 items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={comunicaciones}
            onChange={(e) => setComunicaciones(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-hopper-black">
              Comunicaciones <span className="text-gray-400 font-normal">(opcional)</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acepto recibir comunicaciones comerciales sobre formaciones, webinars y oportunidades
              laborales SAP de Hoppers Academy.
            </p>
          </div>
        </label>

        <label className="flex gap-3 items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={comparticion}
            onChange={(e) => setComparticion(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-hopper-red shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-hopper-black">
              * Compartición de datos <span className="text-hopper-red">(requerido)</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Acepto que mis datos puedan ser compartidos con empresas partners de Hoppers Academy
              que puedan estar interesadas en mi perfil profesional SAP.
            </p>
          </div>
        </label>
      </div>

      <p className="text-xs text-gray-400">
        * Los campos marcados con asterisco son obligatorios para generar el informe.
      </p>

      <Button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
      >
        Generar mi informe →
      </Button>
    </div>
  );
}

function DiagnosticResults({
  result,
  onReset,
  onDownload,
  onEmail,
}: {
  result: DiagnosticResult;
  onReset: () => void;
  onDownload: () => void;
  onEmail: () => void;
}) {
  const scoreColor =
    result.empScore >= 80
      ? "#10B981"
      : result.empScore >= 60
      ? "#F59E0B"
      : result.empScore >= 40
      ? "#F97316"
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
            <p className="text-5xl font-black mt-1" style={{ color: scoreColor }}>
              {result.empScore}%
            </p>
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
              <span
                key={s}
                className="bg-hopper-red/20 text-hopper-red border border-hopper-red/30 text-xs px-2 py-0.5 rounded"
              >
                {s}
              </span>
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
                  <div
                    className="h-2 bg-hopper-red rounded-full transition-all"
                    style={{ width: `${m.matchPct}%` }}
                  />
                </div>
                <div className="flex gap-3 mt-1">
                  {m.salaryES && <span className="text-xs text-gray-500">ES: {m.salaryES}</span>}
                  {m.salaryDE && <span className="text-xs text-gray-500">DE: {m.salaryDE}</span>}
                </div>
              </div>
              <Badge
                variant={m.demandLevel === "critical" ? "destructive" : "outline"}
                className="text-xs shrink-0"
              >
                {m.demandLevel === "critical"
                  ? "Crítica"
                  : m.demandLevel === "high"
                  ? "Alta"
                  : "Media"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.salaryExpectations
          .filter((s) => s.salary !== "N/D")
          .map((s) => (
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
          <p className="text-xs text-gray-400 mb-4">
            Los marcados en verde tienen fecha confirmada · Los más relevantes para tu perfil aparecen
            primero
          </p>
          <div className="space-y-3">
            {result.recommendedCourses.map((course) => {
              const next = nextEdition(course);
              const isProfileMatch = course.profiles.some((p) =>
                result.matches
                  .slice(0, 3)
                  .map((m) => m.slug)
                  .includes(p)
              );
              return (
                <div
                  key={course.id}
                  className={`border rounded-lg p-3 flex flex-col gap-1 ${
                    isProfileMatch ? "border-hopper-red/30 bg-hopper-red/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-hopper-black leading-tight">
                        {course.name}
                      </span>
                      {isProfileMatch && (
                        <span className="text-xs text-hopper-red font-medium">Recomendado</span>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-bold bg-hopper-black text-white rounded px-1.5 py-0.5">
                      {course.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{course.description}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {course.durationHours ? (
                      <span className="text-xs text-gray-400">{course.durationHours}h</span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Duración por confirmar</span>
                    )}
                    {next ? (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          next.type === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : next.type === "webinar"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {next.type === "confirmed"
                          ? "Próx. edición:"
                          : next.type === "webinar"
                          ? "Webinar previsto:"
                          : "Edición privada:"}{" "}
                        {next.period}
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
                <span className="bg-hopper-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
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
        <Button onClick={onDownload} className="bg-hopper-red hover:bg-hopper-red/90 text-white">
          Descargar informe PDF
        </Button>
        <Button variant="outline" onClick={onEmail}>
          Solicitar asesoría gratuita
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Nuevo diagnóstico
        </Button>
      </div>
    </div>
  );
}
