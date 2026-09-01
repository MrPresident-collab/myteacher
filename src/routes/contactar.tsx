import { useState, type FormEvent } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Users,
  Video,
  Loader2,
} from "lucide-react";

import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { Flag } from "@/components/common/Flag";
import { createLearningRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { LanguageLevel } from "@/types";

const LEVELS: { id: LanguageLevel; label: string }[] = [
  { id: "beginner", label: "Iniciante (A1)" },
  { id: "intermediate", label: "Intermédio (B1/B2)" },
  { id: "advanced", label: "Avançado (C1)" },
  { id: "fluent", label: "Fluente (C2)" },
  { id: "unknown", label: "Não tenho a certeza" },
];

export function ContactTeacherPage() {
  const { teacherId } = useParams({
    from: "/professores/$teacherId/contactar",
  });
  const { user, profile } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    language: "english" as LanguageCode,
    level: "beginner" as LanguageLevel,
    lessonType: "1:1" as "1:1" | "group",
    modality: "online" as "online" | "presencial",
    province: profile?.province || "Luanda",
    city: profile?.city || "Luanda",
    schedule: "evening",
    notes: "",
  });

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await createLearningRequest({
        learner_id: user?.id,
        learner_name: form.name,
        learner_email: form.email,
        learner_phone: form.phone,
        teacher_id: teacherId,
        language_code: form.language,
        level: form.level,
        lesson_type: form.lessonType,
        modality: form.modality,
        province: form.province,
        city: form.city,
        schedule_preference: form.schedule,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-5 py-16">
        <div className="w-full rounded-[2.5rem] border border-[var(--border)] bg-white p-8 text-center shadow-md sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-8" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-extrabold text-[var(--foreground)] md:text-4xl">
            Pedido de Aula Enviado!
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-[var(--muted)] text-sm">
            Recebemos o seu pedido. A equipa MyTeacher irá confirmar a disponibilidade do professor e notificá-lo por email e WhatsApp.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/professores"
              className="rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-bold transition hover:bg-[var(--secondary)]"
            >
              Ver outros professores
            </Link>

            <Link
              to="/"
              className="rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        to="/professores/$teacherId"
        params={{ teacherId }}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="size-4" />
        Voltar ao perfil do professor
      </Link>

      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Pedido Direto
        </span>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Agendar Aula com o Professor
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Preencha os dados abaixo para estruturarmos o seu horário e plano de aprendizagem.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2.5rem] border border-[var(--border)] bg-white p-6 shadow-sm sm:p-10 space-y-8"
      >
        {/* IDENTIFICATION */}
        {!user && (
          <div className="border-b border-[var(--border)] pb-8 space-y-4">
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">Os seus dados de contacto</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                required
                placeholder="Seu Nome Completo *"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
              <input
                type="email"
                required
                placeholder="Seu Email *"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
              <input
                type="tel"
                required
                placeholder="Seu Telefone / WhatsApp *"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>
        )}

        {/* LANGUAGE */}
        <div className="border-b border-[var(--border)] pb-8">
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">1. Que língua quer aprender?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => updateField("language", lang.code)}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.language === lang.code
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                <Flag code={lang.code} size="sm" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LEVEL */}
        <div className="border-b border-[var(--border)] pb-8">
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">2. Qual é o seu nível aproximado?</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => updateField("level", lvl.id)}
                className={`rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.level === lvl.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* LESSON TYPE & MODALITY */}
        <div className="border-b border-[var(--border)] pb-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">3. Formato</h2>
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => updateField("lessonType", "1:1")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.lessonType === "1:1"
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                <Video className="size-4" />
                Sessões 1:1 Privadas
              </button>
              <button
                type="button"
                onClick={() => updateField("lessonType", "group")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.lessonType === "group"
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                <Users className="size-4" />
                Turma em Grupo (Máx. 5 alunos)
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">4. Modalidade</h2>
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => updateField("modality", "online")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.modality === "online"
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                <Video className="size-4" />
                Online por Videochamada
              </button>
              <button
                type="button"
                onClick={() => updateField("modality", "presencial")}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${
                  form.modality === "presencial"
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                    : "border-[var(--border)] bg-white hover:bg-[var(--secondary)]"
                }`}
              >
                <MapPin className="size-4" />
                Presencial em Luanda / Domicílio
              </button>
            </div>
          </div>
        </div>

        {/* SCHEDULE & NOTES */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[var(--foreground)]">5. Mensagem ou Horário Pretendido</h2>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            placeholder="Ex.: Gostaria de ter aulas terças e quintas a partir das 18h30..."
            className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              A enviar pedido...
            </>
          ) : (
            <>
              Confirmar e Enviar Pedido
              <ChevronRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
