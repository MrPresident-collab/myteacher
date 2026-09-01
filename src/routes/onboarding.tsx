import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Languages,
  Users,
  LockKeyhole,
  CheckCircle2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Heart,
  HelpCircle,
  Loader2,
} from "lucide-react";

import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import type {
  GroupLearningPreference,
  LanguageLevel,
  LearningGoal,
  OnboardingData,
  StudySchedule,
} from "@/types";
import { useAuth } from "@/context/AuthContext";
import { saveLearnerOnboarding } from "@/lib/api";

const LEVEL_CONFIG: { id: LanguageLevel; label: string; description: string }[] = [
  { id: "beginner", label: "Iniciante (A1)", description: "Nunca estudei ou sei apenas algumas palavras básicas." },
  { id: "intermediate", label: "Intermédio (B1/B2)", description: "Compreendo e consigo manter conversas simples sobre o dia-a-dia." },
  { id: "advanced", label: "Avançado (C1)", description: "Comunico com confiança e fluidez na maioria das situações." },
  { id: "fluent", label: "Fluente (C2)", description: "Domínio quase nativo com vocabulário rico e precisão gramatical." },
  { id: "unknown", label: "Não tenho a certeza", description: "Prefiro fazer um teste de diagnóstico com o professor." },
];

const GOAL_CONFIG: { id: LearningGoal; label: string; description: string; icon: any }[] = [
  { id: "personal", label: "Desenvolvimento Pessoal", description: "Interesse cultural, viagens, hobbies e crescimento individual.", icon: Heart },
  { id: "school", label: "Estudos & Universidade", description: "Preparação para aulas, exames, intercâmbios ou bolsas.", icon: GraduationCap },
  { id: "work", label: "Trabalho & Negócios", description: "Reuniões, correspondência executiva, carreira internacional e clientes.", icon: Briefcase },
  { id: "other", label: "Outro Motivo", description: "Objetivos específicos ou situações particulares.", icon: HelpCircle },
];

const SCHEDULE_CONFIG: { id: StudySchedule; label: string; time: string }[] = [
  { id: "morning", label: "Manhã", time: "08:00 às 12:00" },
  { id: "afternoon", label: "Tarde", time: "12:00 às 18:00" },
  { id: "evening", label: "Noite / Pós-laboral", time: "18:00 às 21:30" },
  { id: "flexible", label: "Horário Flexível", time: "Adapto-me conforme a semana" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const search = useSearch({ strict: false }) as { intent?: string };

  const isDirectGroupIntent = search?.intent === "group";
  const TOTAL_STEPS = isDirectGroupIntent ? 5 : 6;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    role: "student",
    languages: [],
    levels: {},
    learningGoals: [],
    studySchedule: [],
    weeklyHours: 3,
    groupLearning: isDirectGroupIntent ? "interested" : undefined,
  });

  useEffect(() => {
    if (isDirectGroupIntent) {
      setData((prev) => ({ ...prev, groupLearning: "interested" }));
    }
  }, [isDirectGroupIntent]);

  const progress = `${(step / TOTAL_STEPS) * 100}%`;

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return data.languages.length > 0;
    if (step === 3) {
      if (data.languages.length === 0) return false;
      return data.languages.every((lang) => Boolean(data.levels[lang]));
    }
    if (step === 4) return data.learningGoals.length > 0;
    if (step === 5) return data.studySchedule.length > 0;
    if (step === 6) return Boolean(data.groupLearning);
    return true;
  }, [step, data]);

  function toggleLanguage(code: LanguageCode) {
    setData((prev) => {
      const exists = prev.languages.includes(code);
      if (exists) {
        const nextLangs = prev.languages.filter((l) => l !== code);
        const nextLevels = { ...prev.levels };
        delete nextLevels[code];
        return { ...prev, languages: nextLangs, levels: nextLevels };
      } else {
        return {
          ...prev,
          languages: [...prev.languages, code],
          levels: { ...prev.levels, [code]: prev.levels[code] || "beginner" },
        };
      }
    });
  }

  function setLanguageLevel(lang: LanguageCode, level: LanguageLevel) {
    setData((prev) => ({
      ...prev,
      levels: { ...prev.levels, [lang]: level },
    }));
  }

  function toggleGoal(goal: LearningGoal) {
    setData((prev) => {
      const exists = prev.learningGoals.includes(goal);
      return {
        ...prev,
        learningGoals: exists
          ? prev.learningGoals.filter((g) => g !== goal)
          : [...prev.learningGoals, goal],
      };
    });
  }

  function toggleSchedule(schedule: StudySchedule) {
    setData((prev) => {
      const exists = prev.studySchedule.includes(schedule);
      return {
        ...prev,
        studySchedule: exists
          ? prev.studySchedule.filter((s) => s !== schedule)
          : [...prev.studySchedule, schedule],
      };
    });
  }

  async function handleFinish() {
    if (!canContinue) return;

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);

    try {
      if (user) {
        await saveLearnerOnboarding(user.id, data);
        navigate({ to: "/dashboard/aluno" });
      } else {
        // Save temporary state and go to register
        sessionStorage.setItem("myteacher_onboarding", JSON.stringify(data));
        navigate({ to: "/auth/register" });
      }
    } catch (err) {
      console.error("Error saving onboarding:", err);
      navigate({ to: user ? "/dashboard/aluno" : "/auth/register" });
    } finally {
      setSaving(false);
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

        {/* STEP CONTENT */}
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8">
          {/* STEP 1: WELCOME & INTRO */}
          {step === 1 && (
            <div className="text-center">
              <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
                <Sparkles className="size-7" />
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Personalize a sua jornada no <span className="text-[var(--primary)]">MyTeacher</span>
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--muted)] max-w-xl mx-auto">
                Em poucos passos, diga-nos as línguas que quer aprender, o seu nível e a sua disponibilidade.
                Apresentaremos professores e turmas compatíveis consigo.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left max-w-xl mx-auto">
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-3">
                  <Languages className="size-5 text-[var(--primary)] shrink-0" />
                  <span className="text-sm font-semibold">Múltiplos idiomas simultâneos</span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-3">
                  <Users className="size-5 text-[var(--primary)] shrink-0" />
                  <span className="text-sm font-semibold">Aulas 1:1 ou Grupos (Max. 5)</span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-3">
                  <Clock3 className="size-5 text-[var(--primary)] shrink-0" />
                  <span className="text-sm font-semibold">Horários flexíveis à sua medida</span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4 flex items-center gap-3">
                  <LockKeyhole className="size-5 text-[var(--primary)] shrink-0" />
                  <span className="text-sm font-semibold">Preferências 100% protegidas</span>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
                >
                  Começar Configuração
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MULTI-LANGUAGE SELECTION */}
          {step === 2 && (
            <div>
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Múltipla Seleção Permitida
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Que línguas quer aprender?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Pode selecionar uma ou mais línguas (ex: Inglês + Francês).
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LANGUAGES.map((lang) => {
                  const isSelected = data.languages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)]"
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

          {/* STEP 3: LEVEL PER SELECTED LANGUAGE */}
          {step === 3 && (
            <div>
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Avaliação Inicial
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Qual é o seu nível atual?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Indique o nível de conhecimento para cada idioma selecionado.
                </p>
              </div>

              <div className="mt-8 space-y-8">
                {data.languages.map((langCode) => {
                  const lang = LANGUAGES.find((l) => l.code === langCode);
                  const currentLevel = data.levels[langCode] || "beginner";

                  return (
                    <div key={langCode} className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                      <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                        <Flag code={langCode} size="md" />
                        <h3 className="font-display text-xl font-bold">{lang?.name}</h3>
                      </div>

                      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {LEVEL_CONFIG.map((lvl) => {
                          const isSelected = currentLevel === lvl.id;
                          return (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => setLanguageLevel(langCode, lvl.id)}
                              className={`rounded-2xl border p-4 text-left transition ${
                                isSelected
                                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                  : "border-[var(--border)] hover:bg-[var(--secondary)]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-[var(--foreground)]">{lvl.label}</span>
                                {isSelected && <CheckCircle2 className="size-4 text-[var(--primary)]" />}
                              </div>
                              <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{lvl.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: LEARNING GOALS */}
          {step === 4 && (
            <div>
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Foco & Motivação
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Quais são os seus principais objetivos?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Selecione todas as opções que se aplicam ao seu momento.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {GOAL_CONFIG.map((goal) => {
                  const isSelected = data.learningGoals.includes(goal.id);
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div className={`grid size-10 place-items-center rounded-xl shrink-0 ${
                        isSelected ? "bg-[var(--primary)] text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-sm text-[var(--foreground)]">{goal.label}</span>
                        <span className="block mt-1 text-xs text-[var(--muted)] leading-relaxed">{goal.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: SCHEDULE */}
          {step === 5 && (
            <div>
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Disponibilidade
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Quando prefere ter aulas?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Indique os períodos do dia mais convenientes para o seu estudo.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {SCHEDULE_CONFIG.map((sched) => {
                  const isSelected = data.studySchedule.includes(sched.id);
                  return (
                    <button
                      key={sched.id}
                      type="button"
                      onClick={() => toggleSchedule(sched.id)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div>
                        <span className="block font-bold text-sm text-[var(--foreground)]">{sched.label}</span>
                        <span className="block text-xs text-[var(--muted)] mt-0.5">{sched.time}</span>
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

          {/* STEP 6: GROUP PREFERENCE (Only if not direct group intent) */}
          {step === 6 && !isDirectGroupIntent && (
            <div>
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                  Formato de Ensino
                </span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
                  Tem interesse em estudo em grupo?
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  As nossas turmas são limitadas a no máximo 5 alunos por professor para garantir prática constante.
                </p>
              </div>

              <div className="mt-8 space-y-3 max-w-xl mx-auto">
                {[
                  { id: "interested", title: "Sim — Mostrar grupos disponíveis (Máx. 5 alunos)", desc: "Quero aprender com colegas no mesmo nível e partilhar experiências." },
                  { id: "not-now", title: "Não de momento", desc: "Ainda estou a ponderar o melhor formato para mim." },
                  { id: "private", title: "Prefiro aulas particulares 1:1", desc: "Desejo atenção 100% exclusiva de um professor dedicado." },
                ].map((opt) => {
                  const isSelected = data.groupLearning === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, groupLearning: opt.id as GroupLearningPreference }))}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div
                        className={`grid size-6 place-items-center rounded-full border text-xs mt-0.5 ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)]"
                        }`}
                      >
                        {isSelected && <Check className="size-3.5" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-bold text-sm text-[var(--foreground)]">{opt.title}</span>
                        <span className="block mt-1 text-xs text-[var(--muted)]">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          {step > 1 && (
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
                disabled={!canContinue || saving}
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    {step === TOTAL_STEPS ? (user ? "Finalizar & Ver Recomendações" : "Criar Conta & Ver Recomendações") : "Próximo"}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}