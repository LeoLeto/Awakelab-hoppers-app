"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConsentModal } from "./ConsentModal";
import { buildDiagnosticResult } from "@/lib/diagnostic";
import type { DiagnosticResult, HoppersCourse } from "@/lib/diagnostic";
import { nextEdition } from "@/lib/data/courses";
import { downloadDiagnosticPDF } from "@/lib/pdf";
import { getSession, saveDiagnosticResult } from "@/lib/auth";

const GUIDED_QUESTIONS = [
  "Cuéntame sobre tu experiencia con SAP. ¿Con qué módulos has trabajado?",
  "¿Cuántos años llevas trabajando con SAP y cuál es tu nivel de experiencia?",
  "¿Tienes certificaciones SAP o estás pensando en obtenerlas?",
];

export function DiagnosticTool() {
  const [mode, setMode] = useState<"chat" | "free" | "cv">("chat");
  const [chatStep, setChatStep] = useState(0);
  const [chatAnswers, setChatAnswers] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [freeText, setFreeText] = useState("");
  const [cvText, setCvText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [pendingResult, setPendingResult] = useState<DiagnosticResult | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [yearsExp, setYearsExp] = useState("3-5");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStep, chatAnswers]);

  function handleChatSend() {
    if (!chatInput.trim()) return;
    const newAnswers = [...chatAnswers, chatInput.trim()];
    setChatAnswers(newAnswers);
    setChatInput("");
    if (chatStep < GUIDED_QUESTIONS.length - 1) {
      setChatStep((s) => s + 1);
    } else {
      runDiagnostic(newAnswers.join(" "));
    }
  }

  function runDiagnostic(text: string) {
    setProcessing(true);
    setTimeout(() => {
      const r = buildDiagnosticResult(text, yearsExp);
      setPendingResult(r);
      setProcessing(false);
      setConsentOpen(true);
    }, 1800);
  }

  function handleConsentAccept() {
    setConsentOpen(false);
    if (!pendingResult) return;
    const session = getSession();
    if (session) {
      saveDiagnosticResult({
        empScore: pendingResult.empScore,
        topProfile: pendingResult.topSlug,
        skills: pendingResult.skills,
      });
    }
    setResult(pendingResult);
    setPendingResult(null);
  }

  function handleConsentCancel() {
    setConsentOpen(false);
    setPendingResult(null);
    setProcessing(false);
  }

  function handleFreeSubmit() {
    const text = freeText.trim();
    if (!text) return;
    runDiagnostic(text);
  }

  function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || "";
      setCvText(text.slice(0, 4000));
    };
    reader.readAsText(file);
  }

  function toggleVoice() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
      return;
    }
    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      if (mode === "free") setFreeText((prev) => prev + " " + transcript);
      else setChatInput(transcript);
    };
    recognition.onerror = () => setVoiceActive(false);
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
    recognitionRef.current = recognition;
    setVoiceActive(true);
  }

  function handleDownloadPDF() {
    if (!result) return;
    const session = getSession();
    let userName = session?.name;
    let userEmail = session?.email;
    downloadDiagnosticPDF(result, userName, userEmail, session?.country);
  }

  function handleEmailSend() {
    if (!result) return;
    const body = encodeURIComponent(
      `Hola equipo Hoppers Academy,\n\nAcabo de completar mi diagnostico profesional SAP y me gustaria recibir mas informacion.\n\nPerfil detectado: ${result.matches[0]?.name}\nIndice de empleabilidad: ${result.empScore}%\nHabilidades: ${result.skills.join(", ")}\n\nQuedo a vuestra disposicion.\n\nSaludos`
    );
    window.location.href = `mailto:info@hoppers.academy?subject=Diagnostico SAP - Solicito informacion&body=${body}`;
  }

  function handleReset() {
    setResult(null);
    setPendingResult(null);
    setChatStep(0);
    setChatAnswers([]);
    setChatInput("");
    setFreeText("");
    setCvText("");
    setProcessing(false);
  }

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-16 h-16 border-4 border-hopper-red border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-lg font-bold text-hopper-black">Analizando tu perfil SAP...</p>
          <p className="text-sm text-gray-500 mt-1">Cruzando con 14.000+ ofertas de empleo en tiempo real</p>
        </div>
      </div>
    );
  }

  if (result) {
    return <DiagnosticResults result={result} onReset={handleReset} onDownload={handleDownloadPDF} onEmail={handleEmailSend} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ConsentModal open={consentOpen} onAccept={handleConsentAccept} onCancel={handleConsentCancel} />

      <div className="flex gap-2 mb-6">
        {(["chat", "free", "cv"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              mode === m ? "bg-hopper-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {m === "chat" ? "Guiado" : m === "free" ? "Texto libre" : "Subir CV"}
          </button>
        ))}
        <button
          onClick={toggleVoice}
          className={`ml-auto px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            voiceActive ? "bg-hopper-red text-white border-hopper-red animate-pulse" : "border-gray-300 text-gray-600"
          }`}
        >
          {voiceActive ? "Detener voz" : "Entrada de voz"}
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mr-2">Anos de experiencia con SAP:</label>
        <select
          value={yearsExp}
          onChange={(e) => setYearsExp(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="0">Sin experiencia</option>
          <option value="1-3">1-3 anos</option>
          <option value="3-5">3-5 anos</option>
          <option value="5-7">5-7 anos</option>
          <option value="7+">7+ anos</option>
        </select>
      </div>

      {mode === "chat" && (
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-hopper-black text-white px-4 py-3 text-sm font-semibold">Diagnostico guiado</div>
          <div className="p-4 min-h-[280px] space-y-3 bg-gray-50">
            {GUIDED_QUESTIONS.slice(0, chatStep + 1).map((q, i) => (
              <div key={i} className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-hopper-red rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">H</div>
                  <div className="bg-white border rounded-lg px-3 py-2 text-sm max-w-xs">{q}</div>
                </div>
                {chatAnswers[i] && (
                  <div className="flex justify-end">
                    <div className="bg-hopper-black text-white rounded-lg px-3 py-2 text-sm max-w-xs">{chatAnswers[i]}</div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              placeholder="Escribe tu respuesta..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-hopper-red"
            />
            <Button size="sm" onClick={handleChatSend} className="bg-hopper-red hover:bg-hopper-red/90 text-white">
              Enviar
            </Button>
          </div>
        </div>
      )}

      {mode === "free" && (
        <div className="space-y-4">
          <Textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Describe tu experiencia con SAP: modulos, proyectos, anos de experiencia, certificaciones, sector... Cuanto mas detallado, mejor sera el diagnostico."
            className="min-h-[240px] text-sm"
          />
          <Button
            onClick={handleFreeSubmit}
            disabled={freeText.trim().length < 30}
            className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-50"
          >
            Analizar mi perfil
          </Button>
        </div>
      )}

      {mode === "cv" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-3 text-sm">Sube tu CV en formato TXT o pega el texto</p>
            <label
              htmlFor="cv-upload"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Seleccionar archivo
            </label>
            <input type="file" accept=".txt,.text" onChange={handleCvUpload} className="hidden" id="cv-upload" />
          </div>
          {cvText && (
            <>
              <Textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="min-h-[160px] text-xs font-mono"
              />
              <Button
                onClick={() => runDiagnostic(cvText)}
                className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white"
              >
                Analizar CV
              </Button>
            </>
          )}
        </div>
      )}
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
  const scoreColor = result.empScore >= 80 ? "#10B981" : result.empScore >= 60 ? "#F59E0B" : result.empScore >= 40 ? "#F97316" : "#EF4444";

  const seniorityLabel: Record<string, string> = {
    junior: "Junior (0-3 anos)",
    mid: "Intermedio (3-5 anos)",
    senior: "Senior (5-7+ anos)",
    architect: "Arquitecto / Lead (8+ anos)",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-6 bg-hopper-black text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-gray-400">Indice de empleabilidad SAP</p>
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
              <span key={s} className="bg-hopper-red/20 text-hopper-red border border-hopper-red/30 text-xs px-2 py-0.5 rounded">
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
                {m.demandLevel === "critical" ? "Critica" : m.demandLevel === "high" ? "Alta" : "Media"}
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
                <div
                  key={course.id}
                  className={`border rounded-lg p-3 flex flex-col gap-1 ${isProfileMatch ? "border-hopper-red/30 bg-hopper-red/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-hopper-black leading-tight">{course.name}</span>
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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        next.type === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : next.type === "webinar"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {next.type === "confirmed" ? "Próx. edición:" : next.type === "webinar" ? "Webinar previsto:" : "Edición privada:"}{" "}
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
          <h3 className="font-bold text-hopper-black mb-3">Plan de formacion recomendado</h3>
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
          Solicitar asesoria gratuita
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Nuevo diagnostico
        </Button>
      </div>
    </div>
  );
}
