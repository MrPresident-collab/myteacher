import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import howImage from "@/assets/how.jpg";
import voceImage from "@/assets/voce.jpg";
import becomeTeacherImage from "@/assets/become-teacher.jpg";

export function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-5 pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm">
            <ShieldCheck className="size-3.5" />
            Transparência & Qualidade
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Como funciona o{" "}
            <span className="text-[var(--primary)]">MyTeacher</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Uma plataforma desenhada para conectar alunos a professores qualificados,
            proporcionar experiências de aprendizagem individuais ou em grupos pequenos,
            com rigor operacional e supervisão humana.
          </p>
        </div>
      </section>

      {/* FOR LEARNERS */}
      <section className="border-y border-[var(--border)] bg-white/60 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Para Alunos
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              O seu percurso de aprendizagem em 4 passos simples
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-2 shadow-lg">
            <img src={howImage} alt="Learners and teachers using MyTeacher" className="aspect-[16/6] w-full rounded-[1.5rem] object-cover" loading="lazy" />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StepCard
              number="01"
              icon={<BookOpen className="size-6" />}
              title="Escolha os seus Idiomas"
              description="Selecione um ou múltiplos idiomas que pretende aprender (ex: Inglês + Francês) e defina os seus objetivos."
            />
            <StepCard
              number="02"
              icon={<Users className="size-6" />}
              title="Individual ou em Grupo"
              description="Escolha entre sessões privadas 1:1 focadas ou turmas de estudo colaborativo limitadas a no máximo 5 alunos."
            />
            <StepCard
              number="03"
              icon={<Video className="size-6" />}
              title="Modalidade e Horários"
              description="Aprenda online de onde estiver ou presencialmente na sua cidade de acordo com a sua disponibilidade."
            />
            <StepCard
              number="04"
              icon={<CheckCircle2 className="size-6" />}
              title="Evolua com Supervisão"
              description="Acompanhe o seu progresso no painel do aluno e receba suporte contínuo da equipa MyTeacher."
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
            >
              Começar a Aprender Agora
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* GROUP LEARNING RULES */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[var(--foreground)] p-8 text-white md:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                Regra dos 5 Alunos
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
                Grupos pequenos para máxima atenção e conversação
              </h2>
              <p className="mt-4 text-white/80 leading-7">
                No MyTeacher, acreditamos que turmas grandes prejudicam a prática individual.
                Por isso, as nossas turmas de grupo são estritamente limitadas a{" "}
                <strong className="text-[var(--gold)]">5 alunos por professor</strong>.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 text-[var(--gold)] shrink-0" />
                  Garante que todos os alunos praticam conversação ativa em cada sessão.
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 text-[var(--gold)] shrink-0" />
                  Permite feedback personalizado e acompanhamento de dúvidas.
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 text-[var(--gold)] shrink-0" />
                  Se uma turma estiver cheia, pode subscrever a lista de interesse com notificação imediata.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <img src={voceImage} alt="Small MyTeacher learning group" className="mb-6 aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
              <h3 className="font-display text-xl font-bold text-[var(--gold)]">
                Como Funciona a Vaga no Grupo?
              </h3>
              <p className="mt-3 text-sm text-white/70 leading-6">
                1 professor ensina no máximo 5 alunos. Um aluno só pode aderir a um grupo se houver até 4 alunos inscritos (tornando-se o 5º membro).
              </p>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span className="text-sm font-semibold">Capacidade padrão:</span>
                <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 font-mono text-sm font-bold text-[var(--gold)]">
                  Máx. 5 alunos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR TEACHERS */}
      <section className="border-t border-[var(--border)] bg-white/60 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Para Professores
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
                Ensine com autonomia, segurança e o selo de Verificação
              </h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                Os professores no MyTeacher têm acesso a ferramentas profissionais para gerir
                alunos, turmas, horários e pagamentos .
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">Processo de Verificação</h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      A equipa MyTeacher revê as qualificações e documentação de cada candidato antes de conceder o distintivo Verificado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                    <GraduationCap className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">Painel Dedicado</h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Gestão completa de agenda, pedidos de alunos, turmas ativas e histórico financeiro detalhado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/tornar-se-professor"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
                >
                  Tornar-se Professor
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-sm">
              <img src={becomeTeacherImage} alt="Independent teacher using the MyTeacher platform" className="aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
              <div className="p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold">Critérios de Qualidade MyTeacher</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Preservamos a confiança na plataforma através de padrões rigorosos:
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <strong>1. Identidade e Contacto:</strong> Validação de dados pessoais e verificação de telefone.
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <strong>2. Fluência Comprovada:</strong> Avaliação do nível linguístico e experiência de docência.
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <strong>3. Certificados e Formação:</strong> Análise de diplomas universitários e certificações oficiais.
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <strong>4. Avaliação Contínua:</strong> Monitorização do feedback e assiduidade nas aulas.
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </div>
        <span className="font-mono text-xs font-extrabold text-[var(--primary)]/40">
          {number}
        </span>
      </div>
      <h3 className="mt-6 font-display text-lg font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
