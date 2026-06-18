"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/data/countries";
import { roleLabels } from "@/lib/data/sapProfiles";
import { registerUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

const sapModules = [
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
  "Otro",
];

const steps = [
  { label: "Datos personales", number: 1 },
  { label: "Experiencia SAP", number: 2 },
  { label: "Certificaciones", number: 3 },
  { label: "Tu perfil SAP", number: 4 },
];

const sapSegments = [
  {
    id: "aspirante",
    label: "Aspirante",
    description: "Perfil inicial en el ecosistema SAP, con poca o ninguna experiencia previa.",
    bullets: [
      "Recién licenciados o con menos de un año de experiencia.",
      "Personas sin experiencia en SAP.",
    ],
  },
  {
    id: "usuario_sap",
    label: "Usuario SAP",
    description: "Profesional con conocimiento o uso previo de SAP que busca especializarse o crecer.",
    bullets: [
      "Usuarios con experiencia previa de uso de SAP, misma solución u otras.",
      "Personas con conocimiento del área funcional.",
    ],
  },
  {
    id: "consultor",
    label: "Consultor",
    description: "Profesional con experiencia sólida en implantación o consultoría SAP.",
    bullets: [
      "Consultores con experiencia previa en el área desarrollada en el programa u otras.",
    ],
  },
];

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    currentRole: "",
    yearsExperience: "",
    sapModules: [] as string[],
    certifications: "",
    linkedinUrl: "",
    targetRole: "",
    currentSegment: "",
    aspirationalSegment: "",
  });

  const updateField = (field: string, value: string | string[] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value ?? "" }));
  };

  function inferSegment(yearsExperience: string): string {
    if (yearsExperience === "0" || yearsExperience === "1-3") return "aspirante";
    if (yearsExperience === "3-5") return "usuario_sap";
    return "consultor";
  }

  function goToStep4() {
    setFormData((prev) => ({
      ...prev,
      currentSegment: prev.currentSegment || inferSegment(prev.yearsExperience),
    }));
    setStep(4);
  }

  const toggleModule = (mod: string) => {
    const current = formData.sapModules;
    if (current.includes(mod)) {
      updateField(
        "sapModules",
        current.filter((m) => m !== mod)
      );
    } else {
      updateField("sapModules", [...current, mod]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser({
      name: formData.fullName,
      email: formData.email,
      country: formData.country,
      currentRole: formData.currentRole,
      yearsExperience: formData.yearsExperience,
      sapModules: formData.sapModules,
      certifications: formData.certifications,
      linkedinUrl: formData.linkedinUrl,
      targetRole: formData.targetRole,
    });
    if (result.success) {
      router.push("/diagnostico");
    }
  };

  return (
    <Card className="w-full max-w-xl border-hopper-beige/60">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <div className="h-10 w-10 rounded bg-hopper-red flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-hopper-black">
          Unete a Hoppers
        </CardTitle>
        <p className="text-sm text-hopper-black/50 mt-1">
          Crea tu perfil y accede a tu diagnostico personalizado
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s.number
                    ? "bg-hopper-red text-white"
                    : "bg-hopper-beige/30 text-hopper-black/30"
                }`}
              >
                {step > s.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  s.number
                )}
              </div>
              {s.number < steps.length && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s.number ? "bg-hopper-red" : "bg-hopper-beige/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-hopper-black/40 mt-2">
          Paso {step} de 4: {steps[step - 1].label}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  placeholder="Tu nombre"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email profesional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pais</Label>
                <Select
                  value={formData.country}
                  onValueChange={(v) => updateField("country", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu pais" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-hopper-red hover:bg-hopper-red-dark text-white"
                disabled={!formData.fullName || !formData.email}
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentRole">Rol actual</Label>
                <Input
                  id="currentRole"
                  placeholder="ej. Consultor FI/CO, Desarrollador ABAP..."
                  value={formData.currentRole}
                  onChange={(e) => updateField("currentRole", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Anos de experiencia en SAP</Label>
                <Select
                  value={formData.yearsExperience}
                  onValueChange={(v) => updateField("yearsExperience", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin experiencia</SelectItem>
                    <SelectItem value="1-3">1-3 anos</SelectItem>
                    <SelectItem value="3-5">3-5 anos</SelectItem>
                    <SelectItem value="5-7">5-7 anos</SelectItem>
                    <SelectItem value="7+">7+ anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Modulos SAP que conoces</Label>
                <div className="flex flex-wrap gap-2">
                  {sapModules.map((mod) => (
                    <Badge
                      key={mod}
                      variant="outline"
                      className={`cursor-pointer transition-colors text-xs ${
                        formData.sapModules.includes(mod)
                          ? "bg-hopper-red text-white border-hopper-red"
                          : "bg-hopper-beige/20 text-hopper-black/60 border-hopper-beige/40 hover:border-hopper-murray"
                      }`}
                      onClick={() => toggleModule(mod)}
                    >
                      {mod}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atras
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-hopper-red hover:bg-hopper-red-dark text-white"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certs">
                  Certificaciones SAP (separadas por coma)
                </Label>
                <Input
                  id="certs"
                  placeholder="ej. S/4HANA Finance, ABAP Associate..."
                  value={formData.certifications}
                  onChange={(e) =>
                    updateField("certifications", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">Perfil de LinkedIn (opcional)</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/tu-perfil"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateField("linkedinUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Rol objetivo</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(v) => updateField("targetRole", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="A que perfil quieres llegar?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([slug, label]) => (
                      <SelectItem key={slug} value={slug}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atras
                </Button>
                <Button
                  type="button"
                  onClick={goToStep4}
                  className="flex-1 bg-hopper-red hover:bg-hopper-red-dark text-white"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 — Pre-segmentación de perfil SAP */}
          {step === 4 && (
            <div className="space-y-6">

              {/* Intro */}
              <div className="rounded-xl bg-hopper-beige/20 border border-hopper-beige/40 p-4">
                <p className="text-sm font-semibold text-hopper-black mb-1">Tu perfil</p>
                <p className="text-xs text-hopper-black/60 leading-relaxed">
                  En base a tus respuestas del formulario, te hemos asignado a la categoría que más
                  se ajusta a tus necesidades. Si sientes que encajas mejor en otro perfil, puedes
                  ajustar la selección.
                </p>
              </div>

              {/* Perfil actual */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-hopper-black/40 uppercase tracking-widest">
                  Perfil actual
                </p>
                {sapSegments.map((seg) => {
                  const isSelected = formData.currentSegment === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => updateField("currentSegment", seg.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-hopper-red bg-hopper-red/5"
                          : "border-hopper-beige/40 bg-white hover:border-hopper-murray"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span className="font-bold text-hopper-black text-sm">{seg.label}</span>
                        {isSelected && (
                          <span className="text-xs font-semibold bg-hopper-red text-white px-2.5 py-1 rounded-full flex-shrink-0">
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-hopper-black/60 mb-2">{seg.description}</p>
                      <ul className="space-y-1">
                        {seg.bullets.map((b, i) => (
                          <li key={i} className="text-xs text-hopper-black/50 flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-hopper-black/30 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {/* Perfil aspiracional */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-hopper-black/40 uppercase tracking-widest">
                  Perfil aspiracional
                </p>
                {sapSegments.map((seg) => {
                  const isSelected = formData.aspirationalSegment === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => updateField("aspirationalSegment", seg.id)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-hopper-black bg-hopper-black/5"
                          : "border-hopper-beige/40 bg-white hover:border-hopper-murray"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <span className="font-bold text-hopper-black text-sm">{seg.label}</span>
                        {isSelected && (
                          <span className="text-xs font-semibold bg-hopper-black text-white px-2.5 py-1 rounded-full flex-shrink-0">
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-hopper-black/60 mb-2">{seg.description}</p>
                      <ul className="space-y-1">
                        {seg.bullets.map((b, i) => (
                          <li key={i} className="text-xs text-hopper-black/50 flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-hopper-black/30 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atras
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-hopper-red hover:bg-hopper-red-dark text-white"
                  disabled={!formData.currentSegment || !formData.aspirationalSegment}
                >
                  Crear mi perfil
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-hopper-black/50">
            Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-hopper-red hover:text-hopper-red-dark font-medium"
            >
              Iniciar sesion
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
