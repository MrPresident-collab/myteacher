import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Settings,
  ShieldCheck,
  Star,
  Users,
  AlertCircle,
  Clock3,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Flag } from "@/components/common/Flag";
import { getTeacher } from "@/lib/api";

export function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <TeacherDashboardContent />
    </ProtectedRoute>
  );
}

type TabType = "overview" | "profile" | "students" | "groups" | "availability" | "earnings";

function TeacherDashboardContent() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [verificationStatus, setVerificationStatus] = useState<string>("submitted");

  useEffect(() => {
    if (!profile?.id) return;
    getTeacher(profile.id)
      .then((teacher) => {
        if (!teacher) return;
        setVerificationStatus(teacher.verification_status);
      })
      .catch((error) => console.error("Unable to load teacher verification status:", error));
  }, [profile?.id]);

  const isVerified = verificationStatus === "verified";

  const teacherName = profile?.full_name?.split(" ")[0] || "Professor";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER BAR WITH VERIFICATION STATUS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                Painel do Docente
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="size-3.5" />
                  Docente Verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  <Clock3 className="size-3.5" />
                  Candidatura Sob Revisão
                </span>
              )}
            </div>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">
              Bem-vindo, Professor {teacherName}!
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)]">
              Espaço de trabalho docente para gerir alunos, turmas de grupo e rendimentos em Kwanzas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/professores"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-bold hover:bg-[var(--secondary)]"
            >
              Ver Perfil Público
            </Link>
          </div>
        </div>

        {/* VERIFICATION NOTICE BANNER IF NOT FULLY VERIFIED */}
        {!isVerified && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">A sua candidatura está a ser analisada pela equipa MyTeacher.</strong>
              <p className="mt-0.5">
                Os seus dados foram recebidos. Logo que as suas habilitações sejam validadas, o selo de Verificação ficará ativo e o seu perfil terá visibilidade máxima no marketplace.
              </p>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
          {[
            { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
            { id: "profile", label: "Perfil Público & Valores", icon: Settings },
            { id: "students", label: "Os Meus Alunos", icon: Users },
            { id: "groups", label: "Minhas Turmas (Máx. 5)", icon: GraduationCap },
            { id: "availability", label: "Disponibilidade & Agenda", icon: Calendar },
            { id: "earnings", label: "Ganhos & Finanças (Kz)", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
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
              {/* STATS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Alunos Ativos</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-[var(--foreground)]">8</span>
                    <span className="text-xs text-emerald-600 font-bold">6 1:1 · 2 Grupos</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Turmas Ativas (Máx. 5)</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-[var(--foreground)]">2</span>
                    <span className="text-xs text-[var(--muted)]">7 alunos total</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Ganhos do Mês</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-xl font-extrabold text-emerald-700">185.000 Kz</span>
                    <span className="text-xs text-[var(--muted)]">Líquido</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
                  <span className="text-xs font-bold text-[var(--muted)]">Classificação</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-amber-700 flex items-center gap-1">
                      <Star className="size-5 fill-amber-400 text-amber-500" />
                      4.95
                    </span>
                    <span className="text-xs text-[var(--muted)]">38 avaliações</span>
                  </div>
                </div>
              </div>

              {/* RECENT LESSONS & OPPORTUNITIES */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                  <h2 className="font-display text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                    <Calendar className="size-5 text-[var(--primary)]" />
                    Próximas Sessões Agendadas
                  </h2>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Aula de Inglês para Negócios com Manuel dos Santos</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Hoje · 18:30 às 19:30 · Online</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Confirmada
                      </span>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Turma A: Inglês de Conversação (3/5 alunos)</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Amanhã · 19:00 às 20:00 · Online</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Turma Ativa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
                  <h2 className="font-display text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                    <MessageCircle className="size-5 text-[var(--primary)]" />
                    Novos Pedidos & Oportunidades
                  </h2>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Novo Pedido 1:1: Ana Beatriz (Iniciante)</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Inglês · Manhãs · Talatona</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                      >
                        Aceitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PUBLIC PROFILE & PRICING */}
          {activeTab === "profile" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
              <div>
                <h2 className="font-display text-xl font-bold">Gestão do Perfil Público</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Estes dados serão visíveis pelos alunos no marketplace. Documentos privados de verificação estão salvaguardados em cofre digital.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Título Profissional</label>
                  <input
                    type="text"
                    defaultValue="Professor Sénior de Inglês para Negócios e Exames"
                    className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Biografia & Metodologia</label>
                  <textarea
                    rows={4}
                    defaultValue="Mais de 8 anos de experiência no ensino comunicativo de inglês em Angola..."
                    className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Preço / Hora Online (Kz)</label>
                    <input
                      type="number"
                      defaultValue={8500}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">Preço / Hora Presencial (Kz)</label>
                    <input
                      type="number"
                      defaultValue={12000}
                      className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm font-bold outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-full bg-[var(--primary)] px-6 py-2.5 text-xs font-bold text-white hover:bg-[var(--primary-dark)]"
                >
                  Guardar Alterações do Perfil
                </button>
              </div>
            </div>
          )}

          {/* 3. STUDENTS */}
          {activeTab === "students" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
              <h2 className="font-display text-xl font-bold">Os Meus Alunos Ativos</h2>
              <div className="mt-6 divide-y divide-[var(--border)]">
                {[
                  { name: "Manuel dos Santos", lang: "english", level: "Intermédio", type: "1:1 Privada", next: "Hoje, 18:30" },
                  { name: "Beatriz Costa", lang: "english", level: "Iniciante", type: "Turma A", next: "Amanhã, 19:00" },
                  { name: "Eduardo Neto", lang: "french", level: "Elementar", type: "1:1 Privada", next: "Quinta, 17:00" },
                ].map((s, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted)]">
                        <Flag code={s.lang} size="sm" />
                        <span>{s.level} · {s.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[var(--primary)]">Próxima: {s.next}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MY GROUPS (5-Student Capacity) */}
          {activeTab === "groups" && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                <h2 className="font-display text-xl font-bold">As Minhas Turmas de Grupo (Máximo 5 Alunos)</h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Turmas com supervisão pedagógica MyTeacher.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flag code="english" size="sm" />
                        <span className="font-bold text-sm">Turma A: Conversação</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        3/5 Alunos
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-2">Terças e Quintas · 18:30 às 19:30 · Online</p>
                    <p className="text-xs font-bold text-[var(--foreground)] mt-3">Alunos inscritos: Beatriz, Paulo, Tiago</p>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flag code="english" size="sm" />
                        <span className="font-bold text-sm">Turma B: Inglês Corporativo</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        4/5 Alunos
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-2">Sábados · 09:00 às 11:00 · Online</p>
                    <p className="text-xs font-bold text-[var(--foreground)] mt-3">1 vaga restante para lotação máxima de 5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. AVAILABILITY */}
          {activeTab === "availability" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs max-w-2xl">
              <h2 className="font-display text-xl font-bold">Matriz Semanal de Disponibilidade</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Defina os blocos horários em que aceita novas marcações.</p>

              <div className="mt-6 space-y-3">
                {["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"].map((day) => (
                  <div key={day} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3.5 text-xs font-bold">
                    <span>{day}</span>
                    <div className="flex gap-2">
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">Manhã (08h-12h)</span>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">Pós-laboral (18h-21h)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. EARNINGS */}
          {activeTab === "earnings" && (
            <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs max-w-2xl space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold">Rendimentos & Pagamentos</h2>
                <p className="text-xs text-[var(--muted)] mt-1">Transparência em Kwanzas (AOA).</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[var(--background)] p-4 border border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)]">Volume Bruto</span>
                  <p className="font-display text-lg font-extrabold text-[var(--foreground)] mt-1">218.000 Kz</p>
                </div>
                <div className="rounded-2xl bg-[var(--background)] p-4 border border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)]">Comissão Plataforma (15%)</span>
                  <p className="font-display text-lg font-extrabold text-red-600 mt-1">-32.700 Kz</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold">Líquido a Receber</span>
                  <p className="font-display text-lg font-extrabold text-emerald-900 mt-1">185.300 Kz</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
