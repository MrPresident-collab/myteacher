import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Loader2,
  MapPin,
  MessageCircle,
  Star,
  Users,
  Video,
  ShieldCheck,
  Award,
} from "lucide-react";

import { getTeacher } from "@/lib/api";
import type { TeacherProfile } from "@/types";
import { Flag } from "@/components/common/Flag";

export function TeacherProfilePage() {
  const { teacherId } = useParams({
    from: "/professores/$teacherId",
  });

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeacher() {
      try {
        const foundTeacher = await getTeacher(teacherId);
        if (!foundTeacher) {
          setError("Professor não encontrado.");
          return;
        }
        setTeacher(foundTeacher);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadTeacher();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-5">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
          <span className="font-medium">A carregar perfil do professor...</span>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16">
        <Link
          to="/professores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
        >
          <ArrowLeft className="size-4" />
          Voltar aos professores
        </Link>

        <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
          <h1 className="font-display text-2xl font-extrabold">Professor não encontrado</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            O perfil que procura pode já não estar disponível.
          </p>
        </div>
      </div>
    );
  }

  const profile = teacher.profile;
  const teacherName = profile?.full_name ?? "Professor MyTeacher";
  const isVerified = teacher.verification_status === "verified";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      {/* BACK */}
      <Link
        to="/professores"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft className="size-4" />
        Voltar à lista de professores
      </Link>

      {/* PROFILE HERO HEADER */}
      <section className="mt-6 overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-xs">
        <div className="grid lg:grid-cols-[360px_1fr]">
          {/* PHOTO */}
          <div className="relative aspect-square bg-[var(--foreground)]/5 lg:aspect-auto lg:min-h-[420px]">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={teacherName}
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-8xl font-bold text-[var(--foreground)]/15">
                {teacherName.charAt(0)}
              </div>
            )}

            {isVerified && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-md">
                <ShieldCheck className="size-4 text-emerald-600 fill-emerald-100" />
                Professor Verificado
              </div>
            )}
          </div>

          {/* MAIN INFO */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-2">
              {teacher.city && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                  <MapPin className="size-3.5 text-[var(--primary)]" />
                  {teacher.city}, {teacher.province || "Angola"}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                <Star className="size-3.5 fill-amber-400 text-amber-500" />
                {Number(teacher.rating || 5.0).toFixed(1)} ({teacher.review_count || 0} avaliações)
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {teacherName}
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--muted)] leading-relaxed">
              {teacher.headline ?? "Professor de línguas certificado no MyTeacher."}
            </p>

            {/* LANGUAGES TAUGHT WITH FLAGS */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {teacher.languages?.map((l) => (
                <div
                  key={l.language_code}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold"
                >
                  <Flag code={l.language_code} size="sm" />
                  <span>{l.language?.name || l.language_code}</span>
                  <span className="text-[var(--muted)] font-normal">({l.proficiency_level})</span>
                </div>
              ))}
            </div>

            {/* ACTIONS & PRICING */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-6">
              <div>
                <p className="text-xs text-[var(--muted)]">Preço por aula</p>
                <p className="font-display text-2xl font-extrabold text-[var(--foreground)]">
                  {teacher.online_hourly_price
                    ? `${teacher.online_hourly_price.toLocaleString("pt-AO")} Kz`
                    : "Sob consulta"}
                  <span className="text-xs font-normal text-[var(--muted)]"> / hora</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/professores/$teacherId/contactar"
                  params={{ teacherId: teacher.id }}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
                >
                  <MessageCircle className="size-4" />
                  Contactar / Agendar Aula
                </Link>
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
                >
                  Avaliar Nível
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS GRID */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* LEFT COLUMN: ABOUT, METHODOLOGY & MODALITIES */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-2.5">
              <BookOpen className="size-6 text-[var(--primary)]" />
              Sobre o Professor
            </h2>
            <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
              {teacher.bio || "Este professor ainda não adicionou uma biografia detalhada."}
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-white p-7 sm:p-8">
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-2.5">
              <Award className="size-6 text-[var(--primary)]" />
              Metodologia & Modalidades de Ensino
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {teacher.online_enabled && (
                <div className="rounded-2xl bg-[var(--background)] p-5 border border-[var(--border)]">
                  <Video className="size-5 text-[var(--primary)]" />
                  <h3 className="mt-2 font-bold text-sm">Aulas Online</h3>
                  <p className="mt-1 text-xs text-[var(--muted)] leading-5">
                    Sessões 100% interativas por videochamada através da plataforma.
                  </p>
                </div>
              )}

              {teacher.in_person_enabled && (
                <div className="rounded-2xl bg-[var(--background)] p-5 border border-[var(--border)]">
                  <MapPin className="size-5 text-[var(--primary)]" />
                  <h3 className="mt-2 font-bold text-sm">Aulas Presenciais</h3>
                  <p className="mt-1 text-xs text-[var(--muted)] leading-5">
                    Disponível para encontros presenciais ou ao domicílio em {teacher.city || "Angola"}.
                  </p>
                </div>
              )}

              <div className="rounded-2xl bg-[var(--background)] p-5 border border-[var(--border)]">
                <Users className="size-5 text-[var(--primary)]" />
                <h3 className="mt-2 font-bold text-sm">Grupos Reduzidos</h3>
                <p className="mt-1 text-xs text-[var(--muted)] leading-5">
                  Turmas colaborativas limitadas a no máximo 5 alunos.
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--background)] p-5 border border-[var(--border)]">
                <CalendarDays className="size-5 text-[var(--primary)]" />
                <h3 className="mt-2 font-bold text-sm">Horários Flexíveis</h3>
                <p className="mt-1 text-xs text-[var(--muted)] leading-5">
                  Manhã, tarde ou pós-laboral mediante marcação prévia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING SUMMARY CARD */}
        <aside className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-7 shadow-xs h-fit sticky top-24">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Agendamento Seguro
          </span>
          <h3 className="mt-2 font-display text-xl font-bold">
            Comece a aprender com {teacherName.split(" ")[0]}
          </h3>

          <div className="mt-6 space-y-3 text-xs text-[var(--muted)] border-y border-[var(--border)] py-4">
            <div className="flex items-center justify-between">
              <span>Experiência docente:</span>
              <strong className="text-[var(--foreground)]">{teacher.teaching_experience_years || 1}+ anos</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Total de aulas dadas:</span>
              <strong className="text-[var(--foreground)]">{teacher.total_lessons_completed || 0} aulas</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Estado de verificação:</span>
              <strong className="text-emerald-700">{isVerified ? "Documentos Verificados" : "Em análise"}</strong>
            </div>
          </div>

          <Link
            to="/professores/$teacherId/contactar"
            params={{ teacherId: teacher.id }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
          >
            <MessageCircle className="size-4" />
            Enviar Pedido de Aula
          </Link>

          <p className="mt-3 text-center text-xs text-[var(--muted)]">
            Sem pagamentos adiantados. A nossa equipa supervisiona cada contacto.
          </p>
        </aside>
      </div>
    </div>
  );
}
