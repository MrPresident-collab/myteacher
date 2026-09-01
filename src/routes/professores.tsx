import { useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import {
  Loader2,
  MapPin,
  Star,
  ShieldCheck,
  Search,
  Video,
} from "lucide-react";

import { getTeachers } from "@/lib/api";
import type { TeacherProfile } from "@/types";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { Flag } from "@/components/common/Flag";

export function TeachersPage() {
  const search = useSearch({ strict: false }) as { language?: string };

  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | "all">(
    (search?.language as LanguageCode) || "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [modality, setModality] = useState<"all" | "online" | "presencial">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    async function loadTeachers() {
      setLoading(true);
      try {
        const data = await getTeachers({
          languageCode: selectedLanguage === "all" ? undefined : selectedLanguage,
          modality: modality === "all" ? undefined : modality,
          verifiedOnly,
        });
        setTeachers(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os professores.");
      } finally {
        setLoading(false);
      }
    }

    loadTeachers();
  }, [selectedLanguage, modality, verifiedOnly]);

  const filteredTeachers = teachers.filter((t) => {
    if (!searchTerm) return true;
    const name = t.profile?.full_name?.toLowerCase() || "";
    const headline = t.headline?.toLowerCase() || "";
    const city = t.city?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || headline.includes(term) || city.includes(term);
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      {/* PAGE HEADER */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
          Marketplace MyTeacher
        </span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Encontre o seu Professor Ideal
        </h1>
        <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
          Explore professores certificados com experiência comprovada para aulas individuais ou grupos de até 5 alunos em Angola e online.
        </p>
      </div>

      {/* FILTERS BAR */}
      <div className="mt-8 space-y-4 rounded-3xl border border-[var(--border)] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, especialidade ou cidade..."
              className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            />
          </div>

          {/* MODALITY */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[var(--background)] p-1 border border-[var(--border)] shrink-0">
            <button
              type="button"
              onClick={() => setModality("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                modality === "all" ? "bg-white text-[var(--foreground)] shadow-xs" : "text-[var(--muted)]"
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setModality("online")}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                modality === "online" ? "bg-white text-[var(--primary)] shadow-xs" : "text-[var(--muted)]"
              }`}
            >
              <Video className="size-3.5" />
              Online
            </button>
            <button
              type="button"
              onClick={() => setModality("presencial")}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                modality === "presencial" ? "bg-white text-[var(--primary)] shadow-xs" : "text-[var(--muted)]"
              }`}
            >
              <MapPin className="size-3.5" />
              Presencial
            </button>
          </div>

          {/* VERIFIED BADGE FILTER */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--foreground)] px-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="size-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-4 text-emerald-600" />
              Apenas Verificados
            </span>
          </label>
        </div>

        {/* LANGUAGES FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
          <span className="text-xs font-bold text-[var(--muted)] mr-1">Idioma:</span>
          <button
            type="button"
            onClick={() => setSelectedLanguage("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              selectedLanguage === "all"
                ? "bg-[var(--primary)] text-white shadow-xs"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
            }`}
          >
            Todos os Idiomas
          </button>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLanguage(lang.code)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedLanguage === lang.code
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              <Flag code={lang.code} size="sm" />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-20 text-[var(--muted)]">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
          <span className="font-medium">A pesquisar professores certificados...</span>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredTeachers.length === 0 && (
        <div className="mt-10 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-white p-12 text-center">
          <h2 className="font-display text-2xl font-bold">Nenhum professor encontrado com estes filtros</h2>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">
            Experimente alterar os critérios de pesquisa ou deixe um pedido de aprendizagem personalizado.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage("all");
                setModality("all");
                setSearchTerm("");
                setVerifiedOnly(false);
              }}
              className="rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-semibold hover:bg-[var(--secondary)]"
            >
              Limpar Filtros
            </button>
            <Link
              to="/onboarding"
              className="rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[var(--primary-dark)]"
            >
              Pedir Recomendação
            </Link>
          </div>
        </div>
      )}

      {/* TEACHER GRID */}
      {!loading && !error && filteredTeachers.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: TeacherProfile }) {
  const profile = teacher.profile;
  const teacherName = profile?.full_name ?? "Professor MyTeacher";
  const isVerified = teacher.verification_status === "verified";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xs transition hover:-translate-y-1 hover:shadow-xl">
      {/* PHOTO & BADGES */}
      <div className="relative aspect-[4/3] bg-[var(--foreground)]/5 overflow-hidden">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={teacherName}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center text-5xl font-bold text-[var(--foreground)]/20">
            {teacherName.charAt(0)}
          </div>
        )}

        {/* VERIFIED BADGE */}
        {isVerified && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700 shadow-md backdrop-blur-xs">
            <ShieldCheck className="size-4 text-emerald-600 fill-emerald-100" />
            Verificado
          </div>
        )}

        {/* MODALITIES */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {teacher.online_enabled && (
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
              Online
            </span>
          )}
          {teacher.in_person_enabled && (
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
              Presencial
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">{teacherName}</h2>
            {teacher.city && (
              <p className="flex items-center gap-1 text-xs font-medium text-[var(--muted)] mt-0.5">
                <MapPin className="size-3 text-[var(--primary)]" />
                {teacher.city}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900 shrink-0">
            <Star className="size-3.5 fill-amber-400 text-amber-500" />
            {Number(teacher.rating || 5.0).toFixed(1)}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-[var(--muted)] leading-relaxed">
          {teacher.headline || "Professor especializado em ensino comunicativo de línguas."}
        </p>

        {/* LANGUAGES TAUGHT */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
          {teacher.languages?.map((l) => (
            <div
              key={l.language_code}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)]"
            >
              <Flag code={l.language_code} size="sm" />
              <span>{l.language?.name || l.language_code}</span>
            </div>
          ))}
        </div>

        {/* PRICING & ACTIONS */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <p className="text-xs text-[var(--muted)]">A partir de</p>
            <p className="font-display text-lg font-extrabold text-[var(--foreground)]">
              {teacher.online_hourly_price
                ? `${teacher.online_hourly_price.toLocaleString("pt-AO")} Kz`
                : "Sob consulta"}
              <span className="text-xs font-normal text-[var(--muted)]"> / hora</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/professores/$teacherId"
              params={{ teacherId: teacher.id }}
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
