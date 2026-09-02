import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { Flag } from "@/components/common/Flag";
import { LANGUAGES, REGIONAL_MARKETS, type LanguageCode } from "@/lib/languages";
import type { TeacherApplicationData } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { submitTeacherApplication } from "@/lib/api";

const TOTAL_STEPS = 6;

export function TeacherRegistrationPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<TeacherApplicationData>({
    role: "teacher",
    firstName: profile?.full_name?.split(" ")[0] || "",
    lastName: profile?.full_name?.split(" ").slice(1).join(" ") || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    profilePhoto: profile?.avatar_url || "",
    country: "ao",
    province: profile?.province || "Luanda",
    city: profile?.city || "Luanda",
    languages: ["english"],
    nativeLanguages: ["portuguese"],
    languageProficiencies: { english: "C2 - Fluente" },
    teachingExperience: "3",
    education: "Ensino Superior",
    fieldOfStudy: "Línguas / Letras",
    certificates: "Certificação de Ensino",
    professionalExperience: "Aulas particulares e em centros de línguas.",
    specializations: ["Conversação", "Inglês para Negócios"],
    lessonTypes: ["both"],
    modalities: ["online", "presencial"],
    hourlyRateOnline: 8000,
    hourlyRateInPerson: 12000,
    availability: ["morning", "evening"],
    weeklyHours: 15,
    motivation: "",
    additionalInformation: "",
    documentationAvailable: true,
    cvFileName: "",
    certificateFileName: "",
    verificationStatus: "submitted",
  });

  const progress = `${(step / TOTAL_STEPS) * 100}%`;

  const activeMarket = REGIONAL_MARKETS.find((m) => m.code === form.country) || REGIONAL_MARKETS[0];

  function update(updates: Partial<TeacherApplicationData>) {
    setForm((current) => ({
      ...current,
      ...updates,
    }));
  }

  function toggleLanguage(code: LanguageCode) {
    const exists = form.languages.includes(code);
    const nextLangs = exists
      ? form.languages.filter((l) => l !== code)
      : [...form.languages, code];
    update({ languages: nextLangs });
  }

  const canContinue = useMemo(() => {
    if (step === 1) return form.firstName.trim().length > 0 && form.email.trim().length > 0;
    if (step === 2) return form.languages.length > 0;
    if (step === 3) return form.teachingExperience.length > 0;
    if (step === 4) return form.modalities.length > 0;
    if (step === 5) return form.availability.length > 0;
    return true;
  }, [step, form]);

  async function handleNextOrSubmit() {
    if (!canContinue) return;

    if (step < TOTAL_STEPS) {
      setError(null);
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (user) {
        const result = await submitTeacherApplication(user.id, form);

        if (!result.success) {
          throw new Error(result.error || "Não foi possível submeter a candidatura.");
        }

        setSubmitted(true);
      } else {
        sessionStorage.setItem("myteacher_teacher_app", JSON.stringify(form));
        navigate({ to: "/auth/register" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível submeter a candidatura.";
      console.error("Error submitting teacher application:", err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    if (step === 1) {
      navigate({ to: "/" });
      return;
    }
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[75vh] w-full max-w-2xl items-center px-4 py-16">
        <div className="w-full rounded-[2.5rem] border border-[var(--border)] bg-white p-8 text-center shadow-md sm:p-12">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
            <ShieldCheck className="size-10" />
          </div>

          <span className="rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800">
            Estado: Candidatura Submetida (Em Revisão)
          </span>

          <h1 className="mt-4 font-display text-3xl font-extrabold text-[var(--foreground)] md:text-4xl">
            Candidatura Recebida com Sucesso!
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-sm text-[var(--muted)]">
            Obrigado por se candidatar a professor no MyTeacher. A nossa equipa de coordenação pedagógica irá analisar o seu perfil e documentação. O distintivo <strong>Verificado</strong> será atribuído após a validação administrativa.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard/professor" })}
              className="rounded-full bg-[var(--primary)] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
            >
              Aceder ao Painel do Professor
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="rounded-full border border-[var(--border)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--background)]">
      {/* Progress */}
      <div className="h-1.5 w-full bg-[var(--secondary)]">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-500"
          style={{ width: progress }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </button>

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Passo {step} de {TOTAL_STEPS}
          </span>
        </div>

        {/* MAIN APPLICATION STEPS */}
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* STEP 1: PERSONAL & LOCATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Candidatura de Professor
                </span>
                <h1 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Informações Pessoais & Localização
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Estes dados identificam o seu perfil profissional na plataforma.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Primeiro Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                      placeholder="Ex.: Carlos"
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Apelido *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => update({ lastName: e.target.value })}
                      placeholder="Ex.: Silva"
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      placeholder="seu.email@exemplo.ao"
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      placeholder="+244 9..."
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      País
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => update({ country: e.target.value })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none"
                    >
                      {REGIONAL_MARKETS.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Província / Estado
                    </label>
                    <select
                      value={form.province}
                      onChange={(e) => update({ province: e.target.value })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none"
                    >
                      {activeMarket.provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Cidade / Município
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => update({ city: e.target.value })}
                      placeholder="Ex.: Talatona, Maianga..."
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LANGUAGES TAUGHT */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Línguas & Fluência
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Que línguas ensina?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Selecione as línguas que está capacitado a lecionar no MyTeacher.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LANGUAGES.map((lang) => {
                  const isSelected = form.languages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <Flag code={lang.code} size="lg" />
                      <div className="flex-1 min-w-0">
                        <span className="block font-display font-bold text-[var(--foreground)]">{lang.name}</span>
                        <span className="block text-xs text-[var(--muted)]">{lang.nativeName}</span>
                      </div>
                      <div
                        className={`grid size-6 place-items-center rounded-full border text-xs ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)]"
                        }`}
                      >
                        {isSelected && <Check className="size-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE & QUALIFICATIONS */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Background Docente
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Experiência & Formação Académica
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Ajude os alunos a conhecerem a sua trajetória profissional.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Anos de Experiência no Ensino
                    </label>
                    <select
                      value={form.teachingExperience}
                      onChange={(e) => update({ teachingExperience: e.target.value })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none"
                    >
                      <option value="1">Menos de 1 ano</option>
                      <option value="2">1 a 2 anos</option>
                      <option value="3">3 a 5 anos</option>
                      <option value="5">5 a 10 anos</option>
                      <option value="10">Mais de 10 anos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Grau Académico
                    </label>
                    <input
                      type="text"
                      value={form.education}
                      onChange={(e) => update({ education: e.target.value })}
                      placeholder="Ex.: Licenciatura em Letras / Tradução"
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Certificações de Idiomas (Opcional mas recomendado)
                  </label>
                  <input
                    type="text"
                    value={form.certificates}
                    onChange={(e) => update({ certificates: e.target.value })}
                    placeholder="Ex.: CELTA, TESOL, DALF C2, DELE, HSK 6..."
                    className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Resumo do Percurso Profissional & Metodologia
                  </label>
                  <textarea
                    rows={3}
                    value={form.professionalExperience}
                    onChange={(e) => update({ professionalExperience: e.target.value })}
                    placeholder="Partilhe como costuma conduzir as suas aulas e qual o seu foco..."
                    className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MODALITY, LESSON TYPES & PRICING */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Preferências & Preços
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Modalidade & Valores de Aula
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Defina onde ensina e o seu preço por hora em Kwanzas (AOA).
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                    Modalidades em que leciona:
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-[var(--secondary)]">
                      <input
                        type="checkbox"
                        checked={form.modalities.includes("online")}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...form.modalities, "online" as const]
                            : form.modalities.filter((m) => m !== "online");
                          update({ modalities: next });
                        }}
                        className="size-4 rounded text-[var(--primary)]"
                      />
                      <div>
                        <span className="font-bold text-sm block">Aulas Online</span>
                        <span className="text-xs text-[var(--muted)]">Videochamada interativa</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-[var(--secondary)]">
                      <input
                        type="checkbox"
                        checked={form.modalities.includes("presencial")}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...form.modalities, "presencial" as const]
                            : form.modalities.filter((m) => m !== "presencial");
                          update({ modalities: next });
                        }}
                        className="size-4 rounded text-[var(--primary)]"
                      />
                      <div>
                        <span className="font-bold text-sm block">Aulas Presenciais</span>
                        <span className="text-xs text-[var(--muted)]">Na cidade de residência / ao domicílio</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--border)]">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Preço / Hora Online (Kz)
                    </label>
                    <input
                      type="number"
                      value={form.hourlyRateOnline || 7500}
                      onChange={(e) => update({ hourlyRateOnline: Number(e.target.value) })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Preço / Hora Presencial (Kz)
                    </label>
                    <input
                      type="number"
                      value={form.hourlyRateInPerson || 10000}
                      onChange={(e) => update({ hourlyRateInPerson: Number(e.target.value) })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AVAILABILITY */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Agenda
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Disponibilidade para Lecionar
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Indique os períodos da semana em que tem disponibilidade.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "morning", label: "Manhãs", desc: "08:00 às 12:00" },
                  { id: "afternoon", label: "Tardes", desc: "12:00 às 18:00" },
                  { id: "evening", label: "Noites / Pós-laboral", desc: "18:00 às 21:30" },
                ].map((slot) => {
                  const isSelected = form.availability.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? form.availability.filter((a) => a !== slot.id)
                          : [...form.availability, slot.id];
                        update({ availability: next });
                      }}
                      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{slot.label}</span>
                        {isSelected && <CheckCircle2 className="size-4 text-[var(--primary)]" />}
                      </div>
                      <span className="text-xs text-[var(--muted)] mt-2">{slot.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: VERIFICATION & MOTIVATION */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Selo de Verificação
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Revisão & Submissão
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Documentação para análise da equipa MyTeacher.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong className="block font-bold mb-1">Princípio de Confiança MyTeacher:</strong>
                  Os documentos de identificação e certificados submetidos permanecem 100% confidenciais e nunca são exibidos publicamente no seu perfil. O selo <strong>Verificado</strong> será ativado após conferência administrativa.
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Motivação para ensinar no MyTeacher
                  </label>
                  <textarea
                    rows={3}
                    value={form.motivation}
                    onChange={(e) => update({ motivation: e.target.value })}
                    placeholder="Conte-nos por que gostaria de lecionar através da plataforma MyTeacher..."
                    className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={form.documentationAvailable}
                    onChange={(e) => update({ documentationAvailable: e.target.checked })}
                    className="mt-0.5 size-4 rounded text-[var(--primary)]"
                  />
                  <span className="text-xs text-[var(--muted)] leading-relaxed">
                    Declaro que as informações prestadas são verdadeiras e estou disponível para submeter comprovativos de identidade e habilitações quando solicitado.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* CONTROLS */}
          <div className="mt-10 flex justify-between items-center border-t border-[var(--border)] pt-6">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]"
            >
              <ArrowLeft className="size-4" />
              Anterior
            </button>

            <button
              type="button"
              disabled={!canContinue || submitting}
              onClick={handleNextOrSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  A submeter candidatura...
                </>
              ) : (
                <>
                  {step === TOTAL_STEPS ? "Submeter Candidatura" : "Próximo"}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}