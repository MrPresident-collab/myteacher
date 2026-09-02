import { useState, useEffect } from "react";
import {
  Building2,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, REGIONAL_MARKETS, type LanguageCode } from "@/lib/languages";
import {
  getAdminStats,
  getTeachers,
  getGroups,
  updateTeacherVerification,
} from "@/lib/api";
import type { TeacherProfile, Group, TeacherVerificationStatus } from "@/types";

export function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "student", "teacher"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

type AdminTab = "overview" | "applications" | "teachers" | "learners" | "groups" | "matching" | "settings";

function AdminDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [stats, setStats] = useState({
    totalLearners: 148,
    totalTeachers: 24,
    pendingApplications: 5,
    verifiedTeachers: 18,
    activeGroups: 8,
    totalBookingsMonth: 230,
    monthlyVolumeKz: 2850000,
  });

  const [teachersList, setTeachersList] = useState<TeacherProfile[]>([]);
  const [groupsList, setGroupsList] = useState<Group[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Application Review Modal / Drawer State
  const [selectedTeacherForReview, setSelectedTeacherForReview] = useState<TeacherProfile | null>(null);

  // New Group Form State
  const [newGroup, setNewGroup] = useState({
    name: "",
    language_code: "english" as LanguageCode,
    level: "beginner" as any,
    teacher_id: "teacher-1",
    schedule_description: "Segundas e Quartas · 18:30 às 19:30",
    modality: "online" as "online" | "presencial",
    price_per_month: 28000,
  });

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error);
    getTeachers().then(setTeachersList).catch(console.error);
    getGroups().then(setGroupsList).catch(console.error);
  }, []);

  async function handleUpdateStatus(teacherId: string, status: TeacherVerificationStatus) {
    if (!user) return;
    await updateTeacherVerification({
      teacherId,
      adminId: user.id,
      status,
      adminNotes: `Status alterado por administrador para ${status}`,
    });

    setTeachersList((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, verification_status: status } : t)),
    );

    setFeedback(`Estado do professor atualizado para: ${status.toUpperCase()}`);
    setSelectedTeacherForReview(null);
  }

  function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    const created: Group = {
      id: `group-${Date.now()}`,
      name: newGroup.name,
      language_code: newGroup.language_code,
      level: newGroup.level,
      teacher_id: newGroup.teacher_id,
      teacher: teachersList.find((t) => t.id === newGroup.teacher_id),
      schedule_description: newGroup.schedule_description,
      modality: newGroup.modality,
      price_per_month: newGroup.price_per_month,
      currency_code: "AOA",
      max_capacity: 5, // Strictly max 5 learners
      current_member_count: 0,
      status: "forming",
      starts_at: new Date().toISOString(),
    };

    setGroupsList([created, ...groupsList]);
    setFeedback(`Nova turma "${created.name}" criada com capacidade máxima de 5 alunos!`);
    setNewGroup({
      name: "",
      language_code: "english",
      level: "beginner",
      teacher_id: "teacher-1",
      schedule_description: "Segundas e Quartas · 18:30 às 19:30",
      modality: "online",
      price_per_month: 28000,
    });
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP ADMIN HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-[var(--foreground)] text-white p-6 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[var(--gold)]">
                Supervisão Operacional MyTeacher
              </span>
              <span className="text-xs text-white/60">Ambiente de Controlo</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              Painel de Administração
            </h1>
            <p className="text-xs sm:text-sm text-white/70">
              Automação com supervisão humana: triagem de professores, gestão de turmas (máx. 5 alunos) e matching.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-[var(--gold)]">
              {stats.pendingApplications} Candidaturas Pendentes
            </span>
          </div>
        </div>

        {/* FEEDBACK NOTICE */}
        {feedback && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-900 border border-emerald-200 flex items-center justify-between">
            <span>{feedback}</span>
            <button type="button" onClick={() => setFeedback(null)} className="underline">
              Fechar
            </button>
          </div>
        )}

        {/* ADMIN NAV TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
          {[
            { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
            { id: "applications", label: `Candidaturas (${stats.pendingApplications})`, icon: FileCheck2 },
            { id: "teachers", label: "Professores", icon: GraduationCap },
            { id: "learners", label: "Alunos", icon: Users },
            { id: "groups", label: "Turmas de Grupo (Máx. 5)", icon: Building2 },
            { id: "matching", label: "Matching & Pedidos", icon: Sparkles },
            { id: "settings", label: "Configuração Regional", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                  setFeedback(null);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                  isSelected
                    ? "bg-[var(--foreground)] text-white shadow-xs"
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
              {/* KEY STATS CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Total de Alunos</span>
                  <p className="mt-2 font-display text-3xl font-extrabold text-[var(--foreground)]">{stats.totalLearners}</p>
                  <span className="text-[11px] text-emerald-600 font-bold">+14 novos esta semana</span>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Professores Verificados</span>
                  <p className="mt-2 font-display text-3xl font-extrabold text-emerald-700">{stats.verifiedTeachers}</p>
                  <span className="text-[11px] text-[var(--muted)]">de {stats.totalTeachers} cadastrados</span>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Turmas Ativas (Capacidade 5)</span>
                  <p className="mt-2 font-display text-3xl font-extrabold text-[var(--primary)]">{groupsList.length}</p>
                  <span className="text-[11px] text-[var(--muted)]">Média de 3.8 alunos/turma</span>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Volume do Mês</span>
                  <p className="mt-2 font-display text-2xl font-extrabold text-[var(--foreground)]">
                    {stats.monthlyVolumeKz.toLocaleString("pt-AO")} Kz
                  </p>
                  <span className="text-[11px] text-emerald-600 font-bold">Comissões MyTeacher</span>
                </div>
              </div>

              {/* ACTION QUEUE */}
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold flex items-center gap-2">
                    <ShieldAlert className="size-5 text-amber-600" />
                    Fila de Triagem: Professores Aguardando Verificação
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("applications")}
                    className="text-xs font-bold text-[var(--primary)] hover:underline"
                  >
                    Gerir todas
                  </button>
                </div>

                <div className="mt-4 divide-y divide-[var(--border)]">
                  {teachersList.slice(0, 3).map((teacher) => (
                    <div key={teacher.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-zinc-100 font-bold grid place-items-center text-xs">
                          {teacher.profile?.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--foreground)]">{teacher.profile?.full_name}</p>
                          <p className="text-xs text-[var(--muted)]">{teacher.headline} · {teacher.city || "Luanda"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTeacherForReview(teacher)}
                          className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-1.5 text-xs font-bold hover:bg-[var(--secondary)]"
                        >
                          Analisar Dossier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(teacher.id, "verified")}
                          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Conceder Verificação
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. APPLICATIONS QUEUE */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <h2 className="font-display text-xl font-bold">Candidaturas de Docentes para Análise</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Revise as informações, qualificações e documentação antes de conceder o distintivo oficial de Verificação.
                </p>

                <div className="mt-6 space-y-4">
                  {teachersList.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">{teacher.profile?.full_name}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              teacher.verification_status === "verified"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {teacher.verification_status === "verified" ? "Verificado" : "Sob Análise"}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1">{teacher.bio}</p>
                        <div className="mt-2 flex gap-2">
                          {teacher.languages?.map((l) => (
                            <span key={l.language_code} className="inline-flex items-center gap-1 text-xs font-semibold">
                              <Flag code={l.language_code} size="sm" />
                              {l.language?.name || l.language_code}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(teacher.id, "verified")}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Verificar (Badge)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(teacher.id, "needs_information")}
                          className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
                        >
                          Pedir Mais Info
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(teacher.id, "rejected")}
                          className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. TEACHERS MANAGEMENT */}
          {activeTab === "teachers" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-display text-xl font-bold">Diretório de Professores</h2>
              <div className="divide-y divide-[var(--border)]">
                {teachersList.map((t) => (
                  <div key={t.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{t.profile?.full_name}</span>
                        {t.verification_status === "verified" && (
                          <ShieldCheck className="size-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)]">
                        {t.online_hourly_price?.toLocaleString("pt-AO")} Kz/h · {t.city || "Luanda"} · {t.total_lessons_completed} aulas
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                        {t.verification_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. LEARNERS MANAGEMENT */}
          {activeTab === "learners" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-display text-xl font-bold">Diretório de Alunos Cadastrados</h2>
              <div className="divide-y divide-[var(--border)]">
                {[
                  { name: "Manuel dos Santos", email: "manuel.santos@exemplo.ao", lang: "english", level: "Iniciante", goal: "Trabalho" },
                  { name: "Beatriz Costa", email: "beatriz.c@exemplo.ao", lang: "french", level: "Intermédio", goal: "Estudos" },
                  { name: "Tiago Manuel", email: "tiago.m@exemplo.ao", lang: "english", level: "Iniciante", goal: "Pessoal" },
                  { name: "Helena Vunge", email: "helena.v@exemplo.ao", lang: "mandarin", level: "Iniciante", goal: "Trabalho" },
                ].map((l, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{l.name}</p>
                      <p className="text-xs text-[var(--muted)]">{l.email}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Flag code={l.lang} size="sm" />
                        {l.level}
                      </span>
                      <span className="rounded-full bg-[var(--secondary)] px-3 py-1 font-bold">
                        {l.goal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GROUPS MANAGEMENT (5-Student Limit Enforcer) */}
          {activeTab === "groups" && (
            <div className="space-y-6">
              {/* CREATE GROUP FORM */}
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <h2 className="font-display text-xl font-bold">Criar Nova Turma de Estudo (Máx. 5 Alunos)</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  A plataforma aplica estritamente o limite de 5 alunos por grupo.
                </p>

                <form onSubmit={handleCreateGroup} className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Nome da Turma *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Francês A1 Conversação"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Língua *</label>
                    <select
                      value={newGroup.language_code}
                      onChange={(e) => setNewGroup({ ...newGroup, language_code: e.target.value as LanguageCode })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-bold outline-none"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Mensalidade (Kz) *</label>
                    <input
                      type="number"
                      required
                      value={newGroup.price_per_month}
                      onChange={(e) => setNewGroup({ ...newGroup, price_per_month: Number(e.target.value) })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Horário & Dias *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex.: Terças e Quintas · 18:30 às 19:30"
                      value={newGroup.schedule_description}
                      onChange={(e) => setNewGroup({ ...newGroup, schedule_description: e.target.value })}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="h-11 w-full rounded-full bg-[var(--primary)] px-6 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary-dark)]"
                    >
                      Criar Turma
                    </button>
                  </div>
                </form>
              </div>

              {/* GROUPS LIST */}
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                <h3 className="font-display text-lg font-bold">Turmas Ativas no Sistema</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {groupsList.map((g) => (
                    <div key={g.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flag code={g.language_code} size="sm" />
                          <span className="font-bold text-sm">{g.name}</span>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          {g.current_member_count}/5 alunos
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1.5">{g.schedule_description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. MATCHING & REQUESTS */}
          {activeTab === "matching" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-display text-xl font-bold">Supervisão de Matching e Pedidos de Alunos</h2>
              <p className="text-xs text-[var(--muted)]">
                Pedidos de alunos que aguardam emparelhamento manual ou confirmação de professor.
              </p>

              <div className="mt-4 divide-y divide-[var(--border)]">
                {[
                  { name: "Ana Paula Silva", lang: "english", level: "Iniciante", type: "Grupo", date: "Hoje, 10:15" },
                  { name: "Domingos Cassule", lang: "mandarin", level: "Iniciante", type: "1:1", date: "Ontem, 16:40" },
                ].map((req, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{req.name}</p>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-0.5">
                        <Flag code={req.lang} size="sm" />
                        <span>{req.level} · {req.type}</span>
                        <span>· {req.date}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeedback(`Professor emparelhado com sucesso para ${req.name}`)}
                      className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                    >
                      Emparelhar Professor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REGIONAL SETTINGS */}
          {activeTab === "settings" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs space-y-6 max-w-3xl">
              <div>
                <h2 className="font-display text-xl font-bold">Configuração de Mercados & Moedas</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Arquitetura data-driven para expansão em países de língua oficial portuguesa.
                </p>
              </div>

              <div className="space-y-4">
                {REGIONAL_MARKETS.map((market) => (
                  <div
                    key={market.code}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4 bg-[var(--background)]"
                  >
                    <div className="flex items-center gap-3">
                      <Flag code={market.code} size="md" />
                      <div>
                        <span className="font-bold text-sm block">{market.name}</span>
                        <span className="text-xs text-[var(--muted)]">
                          Moeda: {market.currencyCode} ({market.currencySymbol}) · Indicativo: {market.phonePrefix}
                        </span>
                      </div>
                    </div>

                    <div>
                      {market.active ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          Mercado Ativo
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                          Pronto para Expansão
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TEACHER DOSSIER REVIEW MODAL */}
      {selectedTeacherForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-amber-600" />
                <h3 className="font-display text-xl font-bold">Dossier de Candidatura</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeacherForReview(null)}
                className="grid size-8 place-items-center rounded-full hover:bg-zinc-100"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-2xl bg-zinc-50 p-4 border border-[var(--border)]">
                <p className="font-bold text-base text-[var(--foreground)]">{selectedTeacherForReview.profile?.full_name}</p>
                <p className="text-xs text-[var(--muted)]">{selectedTeacherForReview.profile?.email} · {selectedTeacherForReview.city || "Luanda"}</p>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">{selectedTeacherForReview.bio}</p>
              </div>

              <div>
                <span className="font-bold text-xs uppercase text-[var(--muted)]">Línguas & Qualificações:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedTeacherForReview.languages?.map((l) => (
                    <span key={l.language_code} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--secondary)] px-2.5 py-1 text-xs font-bold">
                      <Flag code={l.language_code} size="sm" />
                      {l.language?.name || l.language_code} ({l.proficiency_level})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedTeacherForReview.id, "verified")}
                className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Aprovar & Ativar Selo Verificado
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedTeacherForReview.id, "needs_information")}
                className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
              >
                Solicitar Mais Documentos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
