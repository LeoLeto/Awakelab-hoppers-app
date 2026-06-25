"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, ChevronRight, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import {
  EMPTY_PROFILE, getProfile, saveProfile, buildProfileFromDiagnostic,
  calculateCompletion, getMissingFields, COMPLETION_FIELDS,
  saveProfileToDB, loadProfileFromDB,
  type HoppersProfileData,
} from "@/lib/profile";
import { roleLabels, targetRoleLabels } from "@/lib/data/sapProfiles";
import { recommendCertifications, SAP_MODULE_GROUPS } from "@/lib/data/sapCertifications";
import { countries } from "@/lib/data/countries";
import type { Country } from "@/lib/data/countries";


const AVAILABILITY_OPTIONS = ["Inmediata", "En 1 mes", "En 3 meses", "Negociable"];
const JOB_PREF_OPTIONS = ["Remoto", "Híbrido", "Presencial"];
const LANGUAGE_OPTIONS = ["Español", "Inglés", "Francés", "Alemán", "Portugués", "Italiano", "Otro"];
const SALARY_OPTIONS = ["<25.000€", "25.000€ - 40.000€", "40.000€ - 55.000€", "55.000€ - 75.000€", ">75.000€"];
const EXPERIENCE_OPTIONS = [
  { label: "Sin experiencia", value: "0" },
  { label: "1-3 años", value: "1-3" },
  { label: "3-5 años", value: "3-5" },
  { label: "5-7 años", value: "5-7" },
  { label: "7+ años", value: "7+" },
];

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function parsePhone(phone: string): { prefix: string; number: string } {
  if (!phone) return { prefix: "+34", number: "" };
  const match = phone.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) return { prefix: match[1], number: match[2] };
  return { prefix: "+34", number: phone };
}

function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-hopper-black">Perfil completado</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SectionHeader({ title, completed, total }: { title: string; completed: number; total: number }) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
      <h3 className="text-base font-bold text-hopper-black">{title}</h3>
      <span className="text-xs text-gray-400">{completed}/{total} campos</span>
    </div>
  );
}

function ToggleChips({
  options, selected, onChange, single,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  single?: boolean;
}) {
  function toggle(opt: string) {
    if (single) {
      onChange(selected.includes(opt) ? [] : [opt]);
    } else {
      onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]);
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
            selected.includes(opt)
              ? "bg-hopper-red text-white border-hopper-red"
              : "border-gray-200 text-gray-600 hover:border-hopper-red hover:text-hopper-red"
          }`}
        >
          {selected.includes(opt) && <Check className="inline w-3 h-3 mr-1" />}
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<HoppersProfileData | null>(null);
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Country dropdown
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // City dropdown
  const [citySearch, setCitySearch] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Phone prefix dropdown
  const [phonePrefix, setPhonePrefix] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [prefixSearch, setPrefixSearch] = useState("");
  const [prefixOpen, setPrefixOpen] = useState(false);
  const prefixRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login?returnTo=/perfil"); return; }

    const nonEmpty = (v: unknown) =>
      Array.isArray(v) ? (v as unknown[]).length > 0 : typeof v === "string" && (v as string).trim().length > 0;

    async function loadProfile() {
      const stored = getProfile(session!.email);
      let diagResult: Record<string, unknown> | null = null;
      try {
        const raw = localStorage.getItem("hoppers_diag_result");
        if (raw) diagResult = JSON.parse(raw);
      } catch {}

      const fromDiag = buildProfileFromDiagnostic(session!, diagResult);

      // Try DB — takes priority over localStorage and diagnostic fallback
      const fromDB = await loadProfileFromDB();

      const merged: HoppersProfileData = {
        ...EMPTY_PROFILE,
        ...Object.fromEntries(Object.entries(fromDiag).filter(([, v]) => nonEmpty(v))),
        ...Object.fromEntries(Object.entries(stored).filter(([, v]) => nonEmpty(v))),
        ...(fromDB ? Object.fromEntries(Object.entries(fromDB).filter(([, v]) => nonEmpty(v))) : {}),
      };

      // Sync DB data back to localStorage so Navbar can read it
      saveProfile(session!.email, merged);
      setProfile(merged);
    }

    loadProfile();
  }, [router]);

  // Initialize UI state from profile (runs once after profile loads)
  useEffect(() => {
    if (profile && !initialized) {
      const countryObj = countries.find(c => normalizeStr(c.name) === normalizeStr(profile.country ?? ""));
      setCountrySearch(countryObj?.name ?? profile.country ?? "");
      setCitySearch(profile.city ?? "");
      const { prefix, number } = parsePhone(profile.phone ?? "");
      setPhonePrefix(prefix);
      setPhoneNumber(number);
      setInitialized(true);
    }
  }, [profile, initialized]);

  // Close all dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
      if (prefixRef.current && !prefixRef.current.contains(e.target as Node)) setPrefixOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function update(field: keyof HoppersProfileData, value: unknown) {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
    setSaved(false);
  }

  async function handleSave() {
    if (!profile) return;
    const session = getSession();
    if (!session) return;
    saveProfile(session.email, profile);          // localStorage (cache para Navbar)
    await saveProfileToDB(profile);               // MongoDB (fuente de verdad)
    window.dispatchEvent(new CustomEvent("hoppers:profile-saved"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La foto no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const photoData = canvas.toDataURL("image/jpeg", 0.7);
      const session = getSession();
      setProfile((prev) => {
        if (!prev) return prev;
        const next = { ...prev, photo: photoData };
        if (session) {
          saveProfile(session.email, next);
          saveProfileToDB({ photo: next.photo });
          setTimeout(() => window.dispatchEvent(new CustomEvent("hoppers:profile-saved")), 0);
        }
        return next;
      });
    };
    img.src = url;
  }

  function handleRemovePhoto() {
    const session = getSession();
    if (fileRef.current) fileRef.current.value = "";
    setProfile((prev) => {
      if (!prev) return prev;
      const next = { ...prev, photo: "" };
      if (session) {
        saveProfile(session.email, next);
        saveProfileToDB({ photo: "" });
        setTimeout(() => window.dispatchEvent(new CustomEvent("hoppers:profile-saved")), 0);
      }
      return next;
    });
  }

  function selectCountry(c: Country) {
    setCountrySearch(c.name);
    update("country", c.name);
    update("city", "");
    setCitySearch("");
    setCountryOpen(false);
  }

  function selectCity(city: string) {
    setCitySearch(city);
    update("city", city);
    setCityOpen(false);
  }

  function updatePhone(prefix: string, number: string) {
    update("phone", number.trim() ? `${prefix} ${number.trim()}` : "");
  }

  if (!profile) return null;

  const pct = calculateCompletion(profile);
  const missing = getMissingFields(profile);

  const selectedCountryObj = countries.find(c => normalizeStr(c.name) === normalizeStr(profile.country ?? "")) ?? null;
  const availableCities = selectedCountryObj?.cities ?? [];

  const filteredCountries = countries.filter(c =>
    normalizeStr(c.name).includes(normalizeStr(countrySearch))
  );
  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );
  const filteredPrefixCountries = countries.filter(c =>
    normalizeStr(c.name).includes(normalizeStr(prefixSearch)) ||
    c.dialCode.includes(prefixSearch)
  );

  const prefixFlag = countries.find(c => c.dialCode === phonePrefix)?.flag ?? "🌍";
  const prefixCountry = countries.find(c => c.dialCode === phonePrefix);
  const expectedDigits = prefixCountry?.phoneDigits ?? null;
  const actualDigits = phoneNumber.replace(/\D/g, "").length;
  const phoneError = phoneNumber.trim() && expectedDigits !== null && actualDigits !== expectedDigits
    ? `Debe tener exactamente ${expectedDigits} dígitos (${actualDigits}/${expectedDigits})`
    : "";

  const sectionCount = (section: string) => {
    const fields = COMPLETION_FIELDS.filter((f) => f.section === section);
    const done = fields.filter((f) => {
      const v = profile[f.key];
      if (Array.isArray(v)) return v.length > 0;
      return typeof v === "string" && v.trim().length > 0;
    }).length;
    return { completed: done, total: fields.length };
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-hopper-red flex items-center justify-center text-white text-3xl font-black overflow-hidden">
              {profile.photo
                ? <img src={profile.photo} alt="Foto" className="w-full h-full object-cover" />
                : (profile.name?.[0]?.toUpperCase() ?? "?")}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Cambiar foto"
            >
              <Camera className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {profile.photo && (
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                title="Eliminar foto"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-hopper-black truncate">{profile.name || "Tu nombre"}</h1>
            <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            {profile.city && profile.country && (
              <p className="text-xs text-gray-400">{profile.city}, {profile.country}</p>
            )}
          </div>
        </div>
        <ProgressBar pct={pct} />
        {missing.length > 0 && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-amber-800">Para llegar al 100% añade:</p>
            <div className="flex flex-wrap gap-1.5">
              {missing.slice(0, 6).map((f) => (
                <span key={f.key} className="inline-flex items-center gap-1 text-xs bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                  <ChevronRight className="w-3 h-3" /> {f.label} (+{f.points}%)
                </span>
              ))}
              {missing.length > 6 && (
                <span className="text-xs text-amber-600 px-2 py-0.5">+{missing.length - 6} más</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información básica */}
      <section className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <SectionHeader title="Información básica" {...sectionCount("básica")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre completo" required>
            <input value={profile.name} onChange={(e) => update("name", e.target.value)}
              className="field-input" placeholder="Tu nombre completo" />
          </Field>
          <Field label="Email" required>
            <input value={profile.email} readOnly
              className="field-input bg-gray-50 cursor-not-allowed text-gray-500" />
          </Field>

          {/* Phone: prefix selector + number */}
          <Field label="Teléfono" points={10} hint={expectedDigits ? `${expectedDigits} dígitos` : undefined}>
            <div className="flex gap-2">
              <div ref={prefixRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => { setPrefixOpen(v => !v); setPrefixSearch(""); }}
                  className="field-input flex items-center gap-1.5 w-[96px] cursor-pointer"
                >
                  <span className="text-base leading-none">{prefixFlag}</span>
                  <span className="text-sm text-gray-700 flex-1 text-left">{phonePrefix}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
                </button>
                {prefixOpen && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
                        <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <input
                          autoFocus
                          value={prefixSearch}
                          onChange={(e) => setPrefixSearch(e.target.value)}
                          placeholder="País o código..."
                          className="text-sm outline-none bg-transparent flex-1 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredPrefixCountries.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setPhonePrefix(c.dialCode);
                            updatePhone(c.dialCode, phoneNumber);
                            setPrefixOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-hopper-red/5 text-left ${
                            phonePrefix === c.dialCode ? "bg-hopper-red/5 text-hopper-red" : "text-gray-700"
                          }`}
                        >
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-gray-400 text-xs shrink-0">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <input
                value={phoneNumber}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d\s\-]/g, "");
                  setPhoneNumber(raw);
                  updatePhone(phonePrefix, raw);
                }}
                className={`field-input flex-1 ${phoneError ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]" : ""}`}
                placeholder={expectedDigits ? `${"0".repeat(expectedDigits)}` : "600 000 000"}
                type="tel"
                maxLength={expectedDigits ? expectedDigits + 4 : undefined}
              />
            </div>
            {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
          </Field>

          {/* Country searchable */}
          <Field label="País" required>
            <div ref={countryRef} className="relative">
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                  update("country", e.target.value);
                  setCountryOpen(true);
                  update("city", "");
                  setCitySearch("");
                }}
                onFocus={() => setCountryOpen(true)}
                className="field-input"
                placeholder="Busca tu país..."
              />
              {countryOpen && countrySearch && filteredCountries.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                  {filteredCountries.map(c => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => selectCountry(c)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-hopper-red/5 text-left"
                    >
                      <span className="text-base">{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* City searchable */}
          <Field label="Ciudad" points={5}>
            <div ref={cityRef} className="relative">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  update("city", e.target.value);
                  if (availableCities.length > 0) setCityOpen(true);
                }}
                onFocus={() => { if (availableCities.length > 0) setCityOpen(true); }}
                className="field-input"
                placeholder={availableCities.length > 0 ? "Busca tu ciudad..." : "Tu ciudad..."}
              />
              {cityOpen && availableCities.length > 0 && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-y-auto">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => selectCity(city)}
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-hopper-red/5 text-left text-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>
        </div>
      </section>

      {/* Perfil SAP */}
      <section className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <SectionHeader title="Perfil SAP" {...sectionCount("SAP")} />
        <Field label="Años de experiencia">
          <ToggleChips
            options={EXPERIENCE_OPTIONS.map((o) => o.label)}
            selected={EXPERIENCE_OPTIONS.filter((o) => o.value === profile.yearsExperience).map((o) => o.label)}
            onChange={(sel) => {
              const opt = EXPERIENCE_OPTIONS.find((o) => o.label === sel[0]);
              update("yearsExperience", opt?.value ?? "");
            }}
            single
          />
        </Field>
        <Field label="Módulos SAP" required>
          <div className="space-y-3">
            {SAP_MODULE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-gray-400 mb-1.5">
                  {group.emoji} {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.modules.map((mod) => {
                    const sel = profile.sapModules.includes(mod);
                    return (
                      <button
                        type="button"
                        key={mod}
                        onClick={() =>
                          update(
                            "sapModules",
                            sel
                              ? profile.sapModules.filter((m) => m !== mod)
                              : [...profile.sapModules, mod],
                          )
                        }
                        className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                          sel
                            ? "bg-hopper-red text-white border-hopper-red"
                            : "border-gray-300 text-gray-700 hover:border-hopper-red hover:text-hopper-red"
                        }`}
                      >
                        {sel && <Check className="inline w-3 h-3 mr-1" />}
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Rol actual" required>
            <select value={profile.currentRole} onChange={(e) => update("currentRole", e.target.value)} className="field-input">
              <option value="">Selecciona...</option>
              {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              <option value="sin_rol">Sin rol definido</option>
            </select>
          </Field>
          <Field label="Rol objetivo" required>
            <select value={profile.targetRole} onChange={(e) => update("targetRole", e.target.value)} className="field-input">
              <option value="">Selecciona...</option>
              {Object.entries(targetRoleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              <option value="sin_rol">Sin rol definido</option>
            </select>
          </Field>
        </div>
        {(() => {
          const recs = recommendCertifications(
            profile.sapModules, profile.currentRole, profile.targetRole, profile.yearsExperience, 16,
          );
          const haveNames = profile.certifications
            ? profile.certifications.split(", ").map((s) => s.trim()).filter(Boolean)
            : [];
          const wantNames = profile.targetCertifications
            ? profile.targetCertifications.split(", ").map((s) => s.trim()).filter(Boolean)
            : [];
          const wantRecs = recs.filter((c) => !haveNames.includes(c.name));

          function chipList(
            items: typeof recs,
            active: string[],
            field: "certifications" | "targetCertifications",
          ) {
            if (items.length === 0)
              return <p className="text-sm text-gray-400">Selecciona módulos y rol para ver certificaciones recomendadas.</p>;
            return (
              <div className="flex flex-wrap gap-2">
                {items.map((cert) => {
                  const short = cert.name.replace(/^SAP Certified [^-]+ - /, "");
                  const sel = active.includes(cert.name);
                  return (
                    <button
                      type="button"
                      key={cert.id}
                      onClick={() => {
                        const next = sel ? active.filter((n) => n !== cert.name) : [...active, cert.name];
                        update(field, next.join(", "));
                      }}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
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
            );
          }

          return (
            <>
              <Field label="Certificaciones que ya tengo">
                {chipList(recs, haveNames, "certifications")}
              </Field>
              <Field label="Certificaciones que quiero obtener">
                {chipList(wantRecs, wantNames, "targetCertifications")}
              </Field>
            </>
          );
        })()}
      </section>

      {/* Presencia online */}
      <section className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <SectionHeader title="Presencia online" {...sectionCount("online")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="LinkedIn" points={5}>
            <input value={profile.linkedin} onChange={(e) => update("linkedin", e.target.value)}
              className="field-input" placeholder="https://linkedin.com/in/tu-perfil" type="url" />
          </Field>
          <Field label="Portfolio / GitHub" points={5}>
            <input value={profile.portfolio} onChange={(e) => update("portfolio", e.target.value)}
              className="field-input" placeholder="https://github.com/tu-usuario" type="url" />
          </Field>
        </div>
      </section>

      {/* Preferencias laborales */}
      <section className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <SectionHeader title="Preferencias laborales" {...sectionCount("preferencias")} />
        <Field label="Salario actual bruto anual" points={5}>
          <ToggleChips options={SALARY_OPTIONS} selected={profile.salary ? [profile.salary] : []} onChange={(v) => update("salary", v[0] ?? "")} single />
        </Field>
        <Field label="Disponibilidad" points={5}>
          <ToggleChips options={AVAILABILITY_OPTIONS} selected={profile.availability ? [profile.availability] : []} onChange={(v) => update("availability", v[0] ?? "")} single />
        </Field>
        <Field label="Modalidad de trabajo" points={5}>
          <ToggleChips options={JOB_PREF_OPTIONS} selected={profile.jobPreferences} onChange={(v) => update("jobPreferences", v)} />
        </Field>
      </section>

      {/* Sobre mí */}
      <section className="bg-white rounded-2xl border p-6 space-y-5 shadow-sm">
        <SectionHeader title="Sobre mí" {...sectionCount("sobre_mi")} />
        <Field label="Resumen profesional" points={10}>
          <textarea value={profile.bio} onChange={(e) => update("bio", e.target.value)}
            rows={4} className="field-input resize-none"
            placeholder="Describe tu experiencia, especialidades y lo que buscas profesionalmente..." />
        </Field>
        <Field label="Idiomas" points={5}>
          <ToggleChips options={LANGUAGE_OPTIONS} selected={profile.languages} onChange={(v) => update("languages", v)} />
        </Field>
        <Field label="Educación" points={10}>
          <input value={profile.education} onChange={(e) => update("education", e.target.value)}
            className="field-input" placeholder="Grado en Informática, Universidad Complutense..." />
        </Field>
      </section>

      {/* Guardar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!!phoneError}
          className="bg-hopper-red hover:bg-hopper-red/90 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saved ? <><Check className="w-4 h-4 mr-1.5" /> Guardado</> : "Guardar cambios"}
        </Button>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: white;
        }
        .field-input:focus {
          border-color: #e8001d;
          box-shadow: 0 0 0 3px rgba(232,0,29,0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label, children, required, points, hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  points?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-hopper-black">
        {label}
        {required && <span className="text-hopper-red text-xs">*</span>}
        {points && !required && (
          <span className="text-xs text-gray-400 font-normal">+{points}%</span>
        )}
        {hint && (
          <span className="text-xs text-gray-400 font-normal ml-auto">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}
