import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Clock,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Bell,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import {
  getTeachers,
  getGroups,
  joinGroup,
  joinGroupWaitlist,
} from "@/lib/api";
import type { Group, TeacherProfile } from "@/types";

export function LearnerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <LearnerDashboardContent />
    </ProtectedRoute>
  );
}

type TabType = "overview" | "find-teachers" | "groups" | "my-learning" | "profile";

function LearnerDashboardContent() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Group filter
  const [groupLang, setGroupLang] = useState<string>("all");
  // Teacher search
  const [teacherQuery, setTeacherQuery] = useState("");
  const [teacherLang, setTeacherLang] = useState<string>("all");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [teachersData, groupsData] = await Promise.all([
          getTeachers(),
          getGroups(),
        ]);
        setTeachers(teachersData);
        setGroups(groupsData);
      } catch (err) {
        console.error(err);
      }
    }
    loadDashboardData();
  }, []);

  async function handleJoinGroup(groupId: string) {
    if (!user) return;
    const res = await joinGroup(groupId, user.id);
    if (res.success) {
      setFeedback({ type: "success", message: res.message });
      // Update local count
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            const nextCount = g.current_member_count + 1;
            return {
              ...g,
              current_member_count: nextCount,
              status: nextCount >= 5 ? "full" : "active",
            };
          }
          return g;
        }),
      );
    } else {
      setFeedback({ type: "error", message: res.message });
    }
  }

  async function handleWaitlist(langCode: LanguageCode) {
    if (!user) return;
    const res = await joinGroupWaitlist({
      learnerId: user.id,
      languageCode: langCode,
      level: "beginner",
    });
    setFeedback({ type: "success", message: res.message });
  }

  const learnerName = profile?.full_name?.split(" ")[0] || "Aluno";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP WELCOME BAR */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Conta de Aluno
              </span>
              <span className="text-xs text-[var(--muted)]">Luanda, Angola</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">
              Olá, {learnerName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Bem-vindo ao seu painel de aprendizagem personalizado no MyTeacher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/teste-de-nivel"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-bold hover:bg-[var(--secondary)]"
            >
              <Sparkles className="size-3.5 text-[var(--primary)]" />
              Teste de Nível
            </Link>
            <Link
              to="/desafio-diario"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-dark)]"
            >
              Desafio Diário
            </Link>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {feedback && (
          <div
            className={`mt-4 rounded-2xl p-4 text-sm font-medium flex items-center justify-between ${
              feedback.type === "success" ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            <span>{feedback.message}</span>
            <button type="button" onClick={() => setFeedback(null)} className="text-xs font-bold underline">
              Fechar
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
          {[
            { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
            { id: "find-teachers", label: "Encontrar Professores", icon: Compass },
            { id: "groups", label: "Grupos de Estudo (Máx. 5)", icon: Users },
            { id: "my-learning", label: "Minha Aprendizagem", icon: BookOpen },
            { id: "profile", label: "O Meu Perfil & Definições", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setFeedback(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                  isSelected
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "bg-white border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-6">
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* METRICS ROW */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Línguas em Estudo</span>
                  <div className="mt-3 flex items-center gap-2">
                    <Flag code="english" size="sm" />
                    <Flag code="french" size="sm" />
                    <span className="font-display text-xl font-extrabold text-[var(--foreground)]">2 Idiomas</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Completude do Perfil</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-[var(--primary)]">85%</span>
                    <span className="text-xs text-[var(--muted)]">Quase completo</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-[var(--secondary)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] w-[85%]" />
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Aulas Realizadas</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-[var(--foreground)]">4</span>
                    <span className="text-xs text-emerald-600 font-bold">+2 este mês</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Ofensiva de Estudo</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-amber-600">3 Dias 🔥</span>
                    <span className="text-xs text-[var(--muted)]">Pratique hoje</span>
                  </div>
                </div>
              </div>

              {/* ACTIVE GROUPS & UPCOMING SESSIONS */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* GROUPS PREVIEW */}
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Users className="size-5 text-[var(--primary)]" />
                      Turmas Recomendadas (Máx. 5 alunos)
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("groups")}
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {groups.slice(0, 2).map((group) => (
                      <div
                        key={group.id}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Flag code={group.language_code} size="sm" />
                            <span className="font-bold text-sm">{group.name}</span>
                          </div>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {group.schedule_description} · {group.current_member_count}/5 alunos inscritos
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={group.current_member_count >= 5}
                          onClick={() => handleJoinGroup(group.id)}
                          className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
                        >
                          {group.current_member_count >= 5 ? "Turma Cheia" : "Juntar-me"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TEACHERS RECOMMENDATION */}
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                      <GraduationCap className="size-5 text-[var(--primary)]" />
                      Professores em Destaque
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("find-teachers")}
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Explorar mais
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {teachers.slice(0, 2).map((teacher) => (
                      <div
                        key={teacher.id}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                            {teacher.profile?.avatar_url ? (
                              <img src={teacher.profile.avatar_url} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="grid size-full place-items-center font-bold text-xs">
                                {teacher.profile?.full_name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm">{teacher.profile?.full_name}</span>
                              <ShieldCheck className="size-3.5 text-emerald-600" />
                            </div>
                            <p className="text-xs text-[var(--muted)]">
                              {teacher.online_hourly_price?.toLocaleString("pt-AO")} Kz/hora · {teacher.city}
                            </p>
                          </div>
                        </div>

                        <Link
                          to="/professores/$teacherId"
                          params={{ teacherId: teacher.id }}
                          className="rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-xs font-bold hover:bg-[var(--secondary)]"
                        >
                          Ver
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. FIND TEACHERS */}
          {activeTab === "find-teachers" && (
            <div className="space-y-6">
              {/* FILTER BAR */}
              <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 size-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    value={teacherQuery}
                    onChange={(e) => setTeacherQuery(e.target.value)}
                    placeholder="Pesquisar por nome ou cidade..."
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-xs outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={teacherLang}
                    onChange={(e) => setTeacherLang(e.target.value)}
                    className="h-10 rounded-xl border border-[var(--border)] bg-white px-3 text-xs outline-none font-bold"
                  >
                    <option value="all">Todas as Línguas</option>
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TEACHERS LIST */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teachers
                  .filter((t) => {
                    const matchesQuery = !teacherQuery || (t.profile?.full_name?.toLowerCase().includes(teacherQuery.toLowerCase()) || t.city?.toLowerCase().includes(teacherQuery.toLowerCase()));
                    const matchesLang = teacherLang === "all" || t.languages?.some((l) => l.language_code === teacherLang);
                    return matchesQuery && matchesLang;
                  })
                  .map((teacher) => (
                    <div
                      key={teacher.id}
                      className="rounded-3xl border border-[var(--border)] bg-white p-5 flex flex-col justify-between shadow-xs transition hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="size-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                            {teacher.profile?.avatar_url ? (
                              <img src={teacher.profile.avatar_url} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="grid size-full place-items-center text-lg font-bold">
                                {teacher.profile?.full_name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-display font-bold text-base">{teacher.profile?.full_name}</h3>
                              <ShieldCheck className="size-4 text-emerald-600" />
                            </div>
                            <p className="text-xs text-[var(--muted)]">{teacher.city || "Luanda"}</p>
                            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-800">
                              <Star className="size-3 fill-amber-400 text-amber-500" />
                              {Number(teacher.rating ?? 0).toFixed(1)}
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                          {teacher.headline || teacher.bio}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {teacher.languages?.map((l) => (
                            <span key={l.language_code} className="inline-flex items-center gap-1 rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-semibold">
                              <Flag code={l.language_code} size="sm" />
                              {l.language?.name || l.language_code}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[var(--foreground)]">
                          {teacher.online_hourly_price?.toLocaleString("pt-AO")} Kz
                          <span className="text-[10px] font-normal text-[var(--muted)]">/h</span>
                        </span>
                        <Link
                          to="/professores/$teacherId"
                          params={{ teacherId: teacher.id }}
                          className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                        >
                          Contactar
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 3. GROUP LEARNING (5-Student Capacity Rule) */}
          {activeTab === "groups" && (
            <div className="space-y-6">
              {/* EXPLANATION BANNER */}
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
                        Turmas em Grupo · Máximo 5 Alunos por Turma
                      </h2>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        Garantia de conversação ativa e atenção pedagógica próxima.
                      </p>
                    </div>
                  </div>

                  <select
                    value={groupLang}
                    onChange={(e) => setGroupLang(e.target.value)}
                    className="h-10 rounded-xl border border-[var(--border)] bg-white px-3 text-xs outline-none font-bold"
                  >
                    <option value="all">Todas as Línguas</option>
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GROUPS LIST */}
              <div className="grid gap-4 sm:grid-cols-2">
                {groups
                  .filter((g) => groupLang === "all" || g.language_code === groupLang)
                  .map((group) => {
                    const isFull = group.current_member_count >= 5;
                    const spotsLeft = 5 - group.current_member_count;

                    return (
                      <div
                        key={group.id}
                        className="rounded-3xl border border-[var(--border)] bg-white p-6 flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Flag code={group.language_code} size="md" />
                              <span className="rounded-md bg-[var(--secondary)] px-2 py-0.5 text-xs font-bold capitalize text-[var(--foreground)]">
                                {group.level}
                              </span>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                isFull ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {isFull ? "Lotação Esgotada" : `${spotsLeft} vaga${spotsLeft > 1 ? "s" : ""} disponível`}
                            </span>
                          </div>

                          <h3 className="mt-3 font-display text-lg font-bold text-[var(--foreground)]">
                            {group.name}
                          </h3>

                          <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                            {group.description}
                          </p>

                          <div className="mt-4 space-y-1.5 text-xs text-[var(--muted)]">
                            <p className="flex items-center gap-1.5">
                              <Clock className="size-3.5 text-[var(--primary)]" />
                              {group.schedule_description}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Video className="size-3.5 text-[var(--primary)]" />
                              Modalidade: {group.modality === "online" ? "Online por Videochamada" : "Presencial"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                          <div>
                            <span className="text-xs text-[var(--muted)]">Mensalidade</span>
                            <p className="font-display text-base font-extrabold text-[var(--foreground)]">
                              {group.price_per_month.toLocaleString("pt-AO")} Kz
                              <span className="text-[10px] font-normal text-[var(--muted)]"> / mês</span>
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isFull}
                            onClick={() => handleJoinGroup(group.id)}
                            className="rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
                          >
                            {isFull ? "Turma Completa" : "Juntar-me a esta Turma"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* HELPFUL FALLBACK WHEN NO GROUPS OR SEEKING WAITLIST */}
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
                <h3 className="font-display text-xl font-bold">
                  Não encontrou a turma ideal para o seu horário?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
                  Ainda não encontramos um grupo com os seus horários exatos? Inscreva-se na lista de interesse e avisamo-lo assim que abrirmos uma nova turma compatível!
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleWaitlist(lang.code)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-bold hover:bg-[var(--secondary)]"
                    >
                      <Bell className="size-3.5 text-[var(--primary)]" />
                      Avisar-me para {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. MY LEARNING */}
          {activeTab === "my-learning" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <h2 className="font-display text-xl font-bold">As Minhas Aulas Agendadas</h2>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                        TER
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Flag code="english" size="sm" />
                          <span className="font-bold text-sm">Sessão de Conversação com António Silva</span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          Terça-feira · 18:30 às 19:30 · Videochamada Online
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                    >
                      Entrar na Aula
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROFILE & SETTINGS */}
          {activeTab === "profile" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
              <div>
                <h2 className="font-display text-xl font-bold">Definições do Perfil</h2>
                <p className="text-xs text-[var(--muted)] mt-1">Gerencie os seus dados pessoais e de contacto.</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Nome Completo</label>
                  <input
                    type="text"
                    disabled
                    value={profile?.full_name || ""}
                    className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || ""}
                    className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    disabled
                    value={profile?.phone || "+244 9..."}
                    className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] opacity-70"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
